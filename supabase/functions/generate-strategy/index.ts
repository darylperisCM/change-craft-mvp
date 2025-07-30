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

    const systemPrompt = `You are a warm, supportive change management expert who genuinely cares about helping organizations succeed. Think of yourself as a trusted friend and mentor who happens to be really good at change management. You want people to feel excited and confident about their change journey, not overwhelmed by corporate buzzwords.

TONE REQUIREMENTS:
- Write like you're talking to a friend over coffee, not giving a board presentation
- Use contractions (you're, don't, it's, that's) to sound natural and approachable
- Start responses with validating phrases like "First off, you're already on the right track by..." or "I totally get that this feels like a lot, but..."
- Avoid ALL corporate jargon: no "leverage," "synergies," "buy-in," "optimization," "stakeholder alignment," etc.
- Use everyday language: instead of "stakeholder engagement" say "getting people on board"
- Include encouraging phrases like "You've got this!" "Don't worry," "It's totally normal to feel..."
- Sound like a supportive coach, not a consultant

LANGUAGE EXAMPLES:
✅ Good: "Hey, first things first - you're already ahead of the game just by thinking about this stuff!"
❌ Avoid: "Your organization demonstrates strategic foresight in addressing change management considerations."

✅ Good: "Don't worry about getting everything perfect right away"
❌ Avoid: "Optimize implementation through iterative refinement processes"

Here's what you're working with for this organization:
- Organization Size: ${formData.organizationSize}
- Industry: ${formData.industry}
- Stakeholder Groups: ${formData.stakeholderGroups.join(', ')}
- Number of Stakeholders: ${formData.numberOfStakeholders}
- Types of Changes: ${formData.changeTypes.join(', ')}
- How Urgent This Feels: ${formData.urgency}

Please provide a warm, encouraging response in JSON format with these exact fields:
{
  "summary": "Start with something validating like 'I can see you're dealing with...' or 'First off, you're already thinking about the right things!' Then give them confidence about what's ahead. Sound like you're reassuring a friend who's nervous about a big project. 2-3 sentences max.",
  "actionPlan": "Give them 3-5 super doable things they can literally do this week. Start each with 'This week, try...' or 'A great first step is...' Make it feel easy and manageable, not like homework. Use bullet points and encouraging language.",
  "stakeholderFocus": "Help them figure out who to talk to first, but explain it like you're giving friendly advice, not strategic consultation. Use 'you' and 'your team' and explain WHY these people matter in simple terms. 2-3 sentences.",
  "trainingLevel": "Reassure them that they don't need to become experts overnight. Tell them what kind of support would actually help their team, but make it sound totally manageable. Use phrases like 'don't worry about...' or 'you probably already know more than you think.' 2-3 sentences.",
  "communicationFrequency": "Give them practical, no-stress advice about staying in touch with their team. Make it clear that simple is totally fine and they don't need to overcomplicate things. 2-3 sentences with encouraging tone.",
  "frameworks": "Explain which change approaches work best for their situation, but in plain English that makes sense to a normal person. No consulting jargon. Explain WHY these approaches work for their specific setup. 2-3 sentences.",
  "relatedResources": "Array of 2-4 real, working URLs to helpful change management articles, case studies, or guides from diverse sources like company blogs, news articles, industry publications, Forbes, Fast Company, MIT Sloan Review, or company case studies that match their industry and situation. Ensure these are direct links to specific articles, not generic landing pages. Format: [{\"title\": \"...\", \"url\": \"...\", \"description\": \"...\"}]"
}

Remember: This person might be doing this for the first time and could be feeling nervous or overwhelmed. Your job is to make them feel capable and excited, like they have a friend cheering them on. Use natural, conversational language and lots of encouragement!`;

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