import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FormData {
  organizationSize: string;
  industry: string;
  stakeholderGroups: string[];
  numberOfStakeholders: string;
  changeTypes: string[];
  urgency: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: FormData = await req.json();

    const systemPrompt = `You are an expert change management consultant with deep knowledge of organizational transformation, stakeholder engagement, and change frameworks like Kotter's 8-Step Process, ADKAR, and Lean Change Management.

Based on the organization profile provided, generate a comprehensive change management strategy with specific, actionable recommendations.

Organization Profile:
- Size: ${formData.organizationSize}
- Industry: ${formData.industry}
- Stakeholder Groups: ${formData.stakeholderGroups.join(', ')}
- Number of Stakeholders: ${formData.numberOfStakeholders}
- Change Types: ${formData.changeTypes.join(', ')}
- Urgency Level: ${formData.urgency}

Provide a response in JSON format with these exact fields:
{
  "summary": "A 2-3 sentence executive summary of the recommended strategy approach",
  "actionPlan": "3-5 specific, actionable steps this organization should take immediately to begin their change initiative (bullet points format)",
  "stakeholderFocus": "Specific guidance on which stakeholder groups to prioritize and why (2-3 sentences)",
  "trainingLevel": "Recommended training intensity and approach based on the change complexity (2-3 sentences)",
  "communicationFrequency": "Optimal communication cadence and channels for this context (2-3 sentences)",
  "frameworks": "Most suitable change management frameworks and methodologies for this situation (2-3 sentences)",
  "relatedResources": "Array of 2-4 real, working URLs to relevant change management case studies, articles, or organizational resources that match this industry and change type. Include both title and url for each resource in format [{\"title\": \"...\", \"url\": \"...\", \"description\": \"...\"}]"
}

Focus on practical, industry-specific advice that considers the organization size, stakeholder complexity, and urgency level. For relatedResources, find actual URLs to Harvard Business Review, McKinsey, Deloitte, Kotter International, or similar authoritative change management sources.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'Generate a change management strategy based on this organization profile.' }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;
    
    // Parse the JSON response from OpenAI
    let strategyRecommendation;
    try {
      strategyRecommendation = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', generatedContent);
      throw new Error('Invalid response format from OpenAI');
    }

    console.log('Generated strategy for:', formData.organizationSize, formData.industry);

    return new Response(JSON.stringify(strategyRecommendation), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-strategy function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});