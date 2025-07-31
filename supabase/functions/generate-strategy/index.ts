import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // CRITICAL FIX: Properly destructure the nested data structure
    const requestBody = await req.json()
    console.log('Raw request body:', requestBody)
    
    // Extract the actual assessment data from the nested structure
    const assessmentData = requestBody.data || requestBody
    console.log('Assessment data extracted:', assessmentData)

    // Validate that we have the required fields
    if (!assessmentData || !assessmentData.organizationSize) {
      throw new Error('Missing required assessment data - organizationSize not found')
    }

    // Get OpenAI API key from environment
    const apiKey = Deno.env.get('OPENAI_API_KEY')
    if (!apiKey) {
      throw new Error('OpenAI API key not found')
    }

    // Build the system prompt with your new guidelines
    const systemPrompt = `You are an empathetic change management expert helping newcomers and small organizations. Generate a comprehensive change management strategy in the following JSON format:

{
  "summary": "Strategy overview based on industry and change type - use friendly, empathetic language",
  "immediateActionPlan": "Specific action items based on urgency and stakeholder groups - provide 4-6 concrete steps",
  "stakeholderFocus": "Focus areas based on selected stakeholder groups - address their specific needs",
  "trainingLevel": "Training recommendations based on urgency and change type - be specific about time and approach",
  "communicationFrequency": "Communication plan based on urgency - provide specific timeline and channels",
  "recommendedFrameworks": "Relevant change management frameworks with brief explanations",
  "recommendedResources": "Helpful resources, articles, and tools with URLs where possible"
}

Use friendly, empathetic language suitable for newcomers and small organizations. Provide practical, actionable guidance that acknowledges the emotional aspects of change. Make recommendations realistic for limited budgets and resources.`

    // Prepare the user message with assessment data
    const userMessage = `Please generate a change management strategy for:
Organization Size: ${assessmentData.organizationSize}
Industry: ${assessmentData.industry}
Change Types: ${assessmentData.changeTypes?.join(', ') || 'Not specified'}
Urgency: ${assessmentData.urgency}
Stakeholder Groups: ${assessmentData.stakeholderGroups?.join(', ') || 'Not specified'}
Number of Stakeholders: ${assessmentData.numberOfStakeholders || 'Not specified'}
Challenges: ${assessmentData.challenges?.join(', ') || 'Not specified'}

Provide empathetic, practical guidance suitable for someone new to change management.`

    console.log('Calling OpenAI API with system prompt and user message...')

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    })

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json()
      console.error('OpenAI API error:', errorData)
      throw new Error(`OpenAI API error: ${openaiResponse.status} - ${errorData.error?.message}`)
    }

    const openaiData = await openaiResponse.json()
    console.log('OpenAI response received successfully')

    // Extract and parse the content
    const messageContent = openaiData.choices[0].message.content
    console.log('Raw message content:', messageContent)

    // Parse the JSON content
    let strategyData
    try {
      // OpenAI sometimes returns JSON wrapped in markdown code blocks
      const cleanContent = messageContent.replace(/```json\n?|```\n?/g, '').trim()
      strategyData = JSON.parse(cleanContent)
      console.log('Successfully parsed strategy data')
    } catch (parseError) {
      console.error('Failed to parse OpenAI JSON response:', parseError)
      console.error('Content that failed to parse:', messageContent)
      throw new Error(`Failed to parse OpenAI response as JSON: ${parseError.message}`)
    }

    // Validate the response structure
    const requiredFields = ['summary', 'immediateActionPlan', 'stakeholderFocus', 'trainingLevel', 'communicationFrequency', 'recommendedFrameworks', 'recommendedResources']
    const missingFields = requiredFields.filter(field => !strategyData[field])
    
    if (missingFields.length > 0) {
      console.error('OpenAI response missing required fields:', missingFields)
      throw new Error(`OpenAI response missing required fields: ${missingFields.join(', ')}`)
    }

    console.log('✅ Successfully generated AI strategy')

    // Return the parsed strategy data
    return new Response(JSON.stringify(strategyData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('❌ Error in generate-strategy function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        type: 'function_error',
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})