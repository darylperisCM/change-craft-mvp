import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ---------- Types ----------
type StakeholderIn = { name: string; severity?: number; likelihood?: number; notes?: string };
type StakeholderResult = StakeholderIn & { severity: number; likelihood: number; riskScore: number; rag: "Red"|"Amber"|"Green" };

const ragFromScore = (n: number): StakeholderResult["rag"] => (n >= 16 ? "Red" : n >= 9 ? "Amber" : "Green");
const clampSL = (n?: number) => {
  const x = Number(n ?? 3);
  if (Number.isNaN(x)) return 3;
  return Math.min(5, Math.max(1, Math.round(x)));
};
const toResult = (s: StakeholderIn): StakeholderResult => {
  const severity = clampSL(s.severity);
  const likelihood = clampSL(s.likelihood);
  const riskScore = severity * likelihood;
  return { ...s, severity, likelihood, riskScore, rag: ragFromScore(riskScore) };
};

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const requestBody = await req.json();
    const assessmentData = requestBody?.data ?? requestBody;

    // Basic validation (back-compat)
    if (!assessmentData || !assessmentData.organizationSize) {
      throw new Error("Missing required assessment data - organizationSize not found");
    }

    // Normalize stakeholders (supports new detailed shape or legacy groups)
    const stakeholdersIn: StakeholderIn[] =
      Array.isArray(assessmentData.stakeholders) && assessmentData.stakeholders.length
        ? assessmentData.stakeholders
        : Array.isArray(assessmentData.stakeholderGroups)
        ? assessmentData.stakeholderGroups.map((name: string) => ({ name, severity: 3, likelihood: 3 }))
        : [];

    const stakeholderResults: StakeholderResult[] = stakeholdersIn
      .filter((s) => (s?.name ?? "").toString().trim().length > 0)
      .map(toResult);

    // Build 5x5 matrix [likelihood-1][severity-1]
    const matrix: StakeholderResult[][][] = Array.from({ length: 5 }, () =>
      Array.from({ length: 5 }, () => []),
    );
    for (const r of stakeholderResults) {
      matrix[r.likelihood - 1][r.severity - 1].push(r);
    }

    const reds = stakeholderResults.filter((r) => r.rag === "Red").length;
    const ambers = stakeholderResults.filter((r) => r.rag === "Amber").length;
    const greens = stakeholderResults.filter((r) => r.rag === "Green").length;
    const maxScore = stakeholderResults.reduce((m, r) => Math.max(m, r.riskScore), 0);
    const highestRisk = stakeholderResults.filter((r) => r.riskScore === maxScore);

    // OpenAI
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) throw new Error("OpenAI API key not found");

    // People-first, motivational schema
    const systemPrompt = `You are an empathetic change-management expert who balances logic with the human side of change.

Return VALID JSON ONLY (no markdown fences) with this schema:

{
  "summary": "Strategy overview in friendly, empathetic language; acknowledge emotions & uncertainty; motivate",
  "immediateActionPlan": "4–6 concrete steps; include at least one human/motivation action",
  "stakeholderFocus": "What matters to each stakeholder group; include WIIFM and likely concerns",
  "trainingLevel": "Right-sized training (time-bound) incl. psychological safety tips",
  "communicationFrequency": "Cadence + channels; include tone (reassuring, transparent, two-way)",
  "recommendedFrameworks": "Relevant frameworks (ADKAR/Kotter/Lewin) with why-for-humans",
  "recommendedResources": "Helpful resources/tools with URLs where possible",

  "humanElements": {
    "likelyEmotions": ["examples across change curve: denial, anxiety, curiosity, hope"],
    "resistancePatterns": ["passive, active, overload; spotting early"],
    "managerTalkingPoints": ["3–5 short scripts managers can say verbatim"],
    "motivationBoosters": ["celebrate quick wins, peer shoutouts, rituals, visible sponsorship"],
    "inclusionAccessibility": ["language, timezones, neurodiversity, frontline inclusion tips"]
  },

  "stakeholderMitigations": [
    {
      "name": "<stakeholder name>",
      "mitigation": [
        "3–5 bullets: communication, training, sponsorship, resistance mgmt, quick wins",
        "Include at least one emotion/motivation action tied to WIIFM"
      ]
    }
  ]
}

Style & voice rules:
- Supportive coach: warm, plain English, respectful, encouraging.
- Acknowledge that people react differently; normalize anxiety & uncertainty.
- Emphasize WIIFM and psychological safety.
- Keep steps realistic for small teams and limited budgets.
- Be specific, time-bound, and action-oriented. Avoid jargon.
- NO markdown, NO code fences. Return compact JSON.`;

    // Build stakeholder line for the model
    const stakeholderLine =
      stakeholderResults.length > 0
        ? stakeholderResults
            .map(
              (s) =>
                `${s.name} (Severity ${s.severity}/5, Likelihood ${s.likelihood}/5, Risk ${s.riskScore}, ${s.rag})${
                  s.notes ? ` — Notes: ${s.notes}` : ""
                }`,
            )
            .join("\n")
        : "None provided";

    // User message (includes human-centric guidance)
    const userMessage = `Please generate a change management strategy for:
Organization Size: ${assessmentData.organizationSize}
Industry: ${assessmentData.industry}
Change Types: ${assessmentData.changeTypes?.join(", ") || "Not specified"}
Urgency: ${assessmentData.urgency}
Stakeholder Groups (detailed):
${stakeholderLine}
Number of Stakeholders: ${assessmentData.numberOfStakeholders || "Not specified"}
Challenges: ${assessmentData.challenges?.join(", ") || "Not specified"}

Provide empathetic, practical guidance suitable for someone new to change management.
For each stakeholder, reflect likely emotional reactions (e.g., uncertainty, loss of control, overload) and include one motivational action tied to WIIFM.`;

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-2025-04-14",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json().catch(() => ({}));
      throw new Error(`OpenAI API error: ${openaiResponse.status} - ${errorData?.error?.message || "Unknown error"}`);
    }

    const openaiData = await openaiResponse.json();
    const messageContent = openaiData.choices?.[0]?.message?.content || "";

    // Parse JSON (strip code fences just in case)
    const cleanContent = messageContent.replace(/```json\n?|```\n?/g, "").trim();
    let strategyData: any;
    try {
      strategyData = JSON.parse(cleanContent);
    } catch (e: any) {
      throw new Error(`Failed to parse OpenAI response as JSON: ${e.message}`);
    }

    // Validate original required fields
    const requiredFields = [
      "summary",
      "immediateActionPlan",
      "stakeholderFocus",
      "trainingLevel",
      "communicationFrequency",
      "recommendedFrameworks",
      "recommendedResources",
    ];
    const missing = requiredFields.filter((f) => !strategyData[f]);
    if (missing.length) throw new Error(`OpenAI response missing required fields: ${missing.join(", ")}`);

    // Ensure mitigations line up 1:1 with stakeholders (soft-correct if needed)
    const mitigations = Array.isArray(strategyData.stakeholderMitigations) ? strategyData.stakeholderMitigations : [];
    if (stakeholderResults.length && mitigations.length !== stakeholderResults.length) {
      strategyData.stakeholderMitigations = stakeholderResults.map((s, i) => ({
        name: s.name,
        mitigation:
          mitigations[i]?.mitigation?.length
            ? mitigations[i].mitigation
            : s.rag === "Red"
            ? [
                "Assign executive sponsor and hold weekly check-ins",
                "Provide role-based training with hands-on support",
                "Address top concerns transparently; track adoption KPIs",
              ]
            : s.rag === "Amber"
            ? [
                "Clarify WIIFM and expected benefits",
                "Host Q&A sessions with champions",
                "Share quick-reference guides and pilot wins",
              ]
            : ["Maintain awareness comms", "Share success stories", "Monitor sentiment and feedback"],
      }));
    }

    // Compose final response (adds stakeholderImpact + stakeholderMitigations)
    const responseBody = {
      // Original fields
      summary: strategyData.summary,
      immediateActionPlan: strategyData.immediateActionPlan,
      stakeholderFocus: strategyData.stakeholderFocus,
      trainingLevel: strategyData.trainingLevel,
      communicationFrequency: strategyData.communicationFrequency,
      recommendedFrameworks: strategyData.recommendedFrameworks,
      recommendedResources: strategyData.recommendedResources,

      // Optional human-centric enrichments (pass through if present)
      humanElements: strategyData.humanElements,

      // New: deterministic stakeholder analytics for UI
      stakeholderImpact: {
        stakeholders: stakeholderResults,
        matrix,
        summary: { reds, ambers, greens, highestRisk },
      },

      // New: AI mitigations aligned with stakeholders
      stakeholderMitigations: strategyData.stakeholderMitigations,
    };

    return new Response(JSON.stringify(responseBody), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("❌ Error in generate-strategy function:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
        type: "function_error",
        timestamp: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 },
    );
  }
});
