import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
    
    if (!PERPLEXITY_API_KEY) {
      throw new Error('Perplexity API key not configured');
    }

    // Get the prompt and other thumbnail data from the request
    const data = await request.json();
    const { prompt, title, category, primaryColors, thumbnailStyle, additionalRequirements } = data;

    if (!prompt) {
      return NextResponse.json({ 
        success: false, 
        error: "Prompt is required" 
      }, { status: 400 });
    }

    console.log("Enhancing prompt with Perplexity for title:", title || "[No title provided]");

    // Create a system prompt for enhancing YouTube thumbnail prompts
    const systemPrompt = `You are an expert at creating detailed YouTube thumbnail generation prompts.
Your job is to enhance and improve a basic prompt into a comprehensive, detailed prompt 
that will generate high-quality, eye-catching YouTube thumbnails when sent to an image generation AI.

Focus on these aspects when enhancing the prompt:
1. Clarity about the thumbnail's main focus and message
2. Specific visual details (colors, layout, focal points)
3. Text treatment (font style, size, placement) - ONLY use the video title text
4. Background design
5. Visual hierarchy
6. Professional thumbnail best practices

YouTube thumbnail specifications:
- Output size: Exactly 1280x720 pixels (16:9 aspect ratio)
- Minimum width: 640 pixels
- Maximum file size: Under 2MB
- Acceptable formats: JPG, PNG, GIF

CRITICAL RULES:
- The ONLY text allowed in the thumbnail is the video title (or part of it)
- DO NOT include category names, keywords, or any descriptive text
- DO NOT include any labels, watermarks, or unrelated text
- If the title is too long, include only the most important 3-5 words from it

Do NOT add any prefixes like "Enhanced prompt:" or explanations.
Just return the enhanced prompt text directly.`;

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
            content: `Enhance this YouTube thumbnail prompt for a thumbnail with the following details:

${title ? `Video Title: "${title}"` : ''}
${category ? `Video Category: ${category}` : ''}
${primaryColors && primaryColors.length > 0 ? `Primary Colors: ${primaryColors.join(', ')}` : ''}
${thumbnailStyle ? `Visual Style: ${thumbnailStyle}` : ''}
${additionalRequirements ? `Additional Requirements: ${additionalRequirements}` : ''}

User's Prompt: ${prompt}

Essential YouTube thumbnail specifications:
- Output size: Exactly 1280x720 pixels (16:9 aspect ratio)
- Minimum width: 640 pixels
- Maximum file size: Under 2MB
- Acceptable formats: JPG, PNG, GIF

Create a detailed, professional prompt optimized for a high-quality thumbnail with high click-through rates.

REMEMBER: The ONLY text that should appear in the generated thumbnail is the video title (or part of it). NO category names, NO keywords, NO descriptive text, and NO labels should be visible in the final image.`
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

    console.log("Enhanced prompt generated successfully");

    return NextResponse.json({
      success: true,
      originalPrompt: prompt,
      enhancedPrompt: enhancedPrompt
    });

  } catch (error: unknown) {
    console.error("Error enhancing prompt:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred with the AI service",
    }, { status: 500 });
  }
}