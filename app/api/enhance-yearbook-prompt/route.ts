import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
    
    if (!PERPLEXITY_API_KEY) {
      throw new Error('Perplexity API key not configured');
    }

    // Get the data from the request
    const data = await request.json();
    const { year, decade, customPrompt } = data;

    // Validate inputs
    if (!year && !decade) {
      return NextResponse.json({ 
        success: false, 
        error: "Year or decade is required" 
      }, { status: 400 });
    }

    const timePeriod = year ? `${year}` : `${decade}`;

    console.log("Enhancing yearbook prompt with Perplexity for time period:", timePeriod);

    // Create a system prompt for enhancing yearbook prompts
    const systemPrompt = `You are an expert at creating detailed prompts for AI image generation, specifically for vintage yearbook-style photos.
Your job is to enhance and improve a basic request into a comprehensive, detailed prompt 
that will generate high-quality, authentic yearbook-style portraits when sent to an image generation AI.

Focus on these aspects when enhancing the prompt:
1. Specific visual details for the time period (clothing, hairstyles, accessories)
2. Photographic style and equipment typical of that era
3. Background elements and setting appropriate to the time
4. Facial expressions and poses common in yearbook photos of that era
5. Image composition and framing
6. Color grading or black/white treatment appropriate to the time period

CRITICAL RULES:
- Focus ONLY on transforming the photo into an authentic yearbook style from the specified time period
- Do NOT include any modern elements, text, or decorations
- Do NOT add any prefixes like "Enhanced prompt:" or explanations
- Just return the enhanced prompt text directly`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Enhance this yearbook photo prompt for a photo in the style of ${timePeriod}.

${customPrompt ? `User's Custom Instructions: ${customPrompt}` : ''}

Create a detailed, professional prompt optimized for generating an authentic yearbook-style portrait from ${timePeriod}.

Essential requirements:
- Transform the photo into the authentic yearbook style from ${timePeriod}
- Focus on clothing, hairstyles, accessories, and photographic techniques typical of that era
- No modern elements, text, or decorations should be included
- The person in the photo should be the main focus

REMEMBER: Focus ONLY on creating an authentic vintage or retro appearance appropriate to the time period.`
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Perplexity API error:", response.status, errorText);
      throw new Error(`Perplexity API error: ${response.status} - ${errorText}`);
    }

    const responseData = await response.json();
    const enhancedPrompt = responseData.choices[0]?.message?.content;

    if (!enhancedPrompt) {
      throw new Error('No content received from Perplexity API');
    }

    console.log("Enhanced yearbook prompt generated successfully");

    return NextResponse.json({
      success: true,
      originalData: { year, decade, customPrompt },
      enhancedPrompt: enhancedPrompt
    });

  } catch (error: unknown) {
    console.error("Error enhancing yearbook prompt:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred with the AI service",
    }, { status: 500 });
  }
}