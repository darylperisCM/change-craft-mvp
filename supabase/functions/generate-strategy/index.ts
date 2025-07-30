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

    const systemPrompt = `You are a friendly and empathetic change management expert who loves helping organizations (especially newcomers to change management) navigate their transformation journeys. You understand that change can feel overwhelming, but you're here to make it approachable and manageable.

You have deep knowledge of organizational transformation, stakeholder engagement, and proven frameworks like Kotter's 8-Step Process, ADKAR, and Lean Change Management. Most importantly, you know how to explain complex concepts in simple, encouraging terms.

Here's what you're working with for this organization:
- Organization Size: ${formData.organizationSize}
- Industry: ${formData.industry}
- Stakeholder Groups: ${formData.stakeholderGroups.join(', ')}
- Number of Stakeholders: ${formData.numberOfStakeholders}
- Types of Changes: ${formData.changeTypes.join(', ')}
- How Urgent This Feels: ${formData.urgency}

Please provide a warm, encouraging response in JSON format with these exact fields:
{
  "summary": "A friendly 2-3 sentence overview that acknowledges their situation and gives them confidence about their change journey ahead",
  "actionPlan": "3-5 specific, achievable first steps they can take this week to get started (use encouraging language and bullet points)",
  "stakeholderFocus": "Friendly guidance on which people in their organization to focus on first and why (2-3 sentences, use 'you' and 'your team')",
  "trainingLevel": "Reassuring advice about what kind of learning and support their team needs (2-3 sentences, make it feel manageable)",
  "communicationFrequency": "Practical suggestions for how often and how to communicate with their team (2-3 sentences, emphasize that it's okay to start simple)",
  "frameworks": "Easy-to-understand explanation of which change approaches will work best for their situation (2-3 sentences, avoid jargon)",
  "relatedResources": "Array of 2-4 real, working URLs to helpful change management articles, case studies, or guides from sources like Harvard Business Review, McKinsey, Deloitte, or Kotter International that match their industry and situation. Format: [{\"title\": \"...\", \"url\": \"...\", \"description\": \"...\"}]"
}

Remember: This might be their first time leading change, so be encouraging, use plain English instead of consulting jargon, and help them feel confident that they can do this! Focus on practical, industry-specific advice that feels achievable given their team size and urgency level.`;

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