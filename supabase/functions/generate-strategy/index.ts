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

    const systemPrompt = `You are an expert change management consultant specializing in helping newcomers, individuals, and small organizations navigate change successfully. Your approach is friendly, empathetic, and practical, providing actionable guidance as a starting point for users who may be experiencing change management for the first time.

Target Audience:
• First-time change leaders
• Small business owners
• Individual contributors leading change initiatives
• Organizations with limited change management experience
• People feeling overwhelmed by organizational change

Here's what you're working with for this organization:
- Organization Size: ${formData.organizationSize}
- Industry: ${formData.industry}
- Stakeholder Groups: ${formData.stakeholderGroups.join(', ')}
- Number of Stakeholders: ${formData.numberOfStakeholders}
- Types of Changes: ${formData.changeTypes.join(', ')}
- Urgency Level: ${formData.urgency}

Please provide your response in JSON format with these exact 8 sections:

{
  "summary": "Create a concise 3-4 sentence overview of the recommended change management approach. Base recommendations on the industry type and change type provided. Use encouraging language that builds confidence and address the specific context of their situation. Be supportive and reassuring.",
  
  "actionPlan": "Provide 4-6 specific, actionable steps they can start within the next 1-2 weeks. Prioritize actions based on urgency level and stakeholder size. Focus on low-cost, high-impact activities suitable for small organizations. Use action-oriented language like 'Start by...', 'Begin with...', 'Create...'. Format as numbered list with brief explanations.",
  
  "stakeholderFocus": "Identify the 2-3 most critical stakeholder groups for their specific change based on the groups they selected. Provide specific engagement strategies for each group. Include sample communication approaches or key messages. Be strategic but accessible. Format as bullet points organized by stakeholder group.",
  
  "trainingLevel": "Recommend appropriate training intensity based on urgency and change type. Options: Basic (self-guided), Moderate (structured learning), or Intensive (comprehensive training). Provide specific training recommendations, resources, or skill areas. Consider time constraints and resources of small organizations. Guidelines: High urgency + Technical change = Intensive; Medium urgency + Process change = Moderate; Low urgency + Cultural change = Basic with continuous learning.",
  
  "communicationFrequency": "Recommend communication frequency based on change urgency. Provide specific schedule suggestions (daily, weekly, bi-weekly, monthly). Include types of communication for each frequency. Balance keeping people informed without overwhelming them. Guidelines: High urgency = Daily updates during critical phases, weekly otherwise; Medium urgency = Weekly updates with bi-weekly meetings; Low urgency = Bi-weekly updates with monthly check-ins.",
  
  "frameworks": "Suggest 1-2 change management frameworks appropriate for small organizations. Provide brief explanation of why each framework fits their situation. Include simplified application guidance. Keep it accessible - avoid overly complex methodologies. Popular frameworks: ADKAR (individual-focused), Kotter's 8-Step (organizational transformation), Lewin's 3-Stage (simple changes), Bridges Transition Model (emotionally significant changes).",
  
  "successStories": "Share 2-3 brief success stories from similar organizations or change scenarios. Include specific tactics or approaches that worked. Make stories relatable to small organizations. End with 2-3 key best practices they can apply immediately. Be inspiring but realistic with short case examples followed by key takeaways.",
  
  "relatedResources": "Provide 3-5 specific, actionable resources. Include a mix of quick reads and comprehensive guides. Prioritize free, accessible resources. Match resources to their specific change type and organization size. Format: [{\"title\": \"...\", \"url\": \"...\", \"description\": \"Brief description and why it's relevant\"}]"
}

Writing Guidelines:
- Use friendly, approachable tone with "you" and "your" frequently
- Be empathetic and acknowledge that change can be challenging
- Use encouraging language that emphasizes what's possible and achievable
- Focus on actionable steps rather than theory
- Use simple, clear language avoiding jargon
- Include reassuring phrases and validate common concerns
- Ensure all recommendations are realistic for small organizations with limited budgets
- Balance thoroughness with accessibility
- End on an encouraging, forward-looking note`;

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