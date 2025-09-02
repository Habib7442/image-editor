import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    // Get form data
    const formData = await request.formData();
    const mainImage = formData.get("mainImage") as File | null;
    const targetImage = formData.get("targetImage") as File | null;
    const mode = formData.get("mode") as string;
    const mockupType = formData.get("mockupType") as string | null;
    const customPrompt = formData.get("customPrompt") as string | null;
    const primaryColor = formData.get("primaryColor") as string | null;

    // Validate required inputs
    if (!mainImage) {
      return NextResponse.json(
        { success: false, error: "Main image is required" },
        { status: 400 }
      );
    }

    if (mode === "text-to-image" && !mockupType) {
      return NextResponse.json(
        { success: false, error: "Mockup type is required for text-to-image mode" },
        { status: 400 }
      );
    }

    if (mode === "image-to-image" && !targetImage) {
      return NextResponse.json(
        { success: false, error: "Target image is required for image-to-image mode" },
        { status: 400 }
      );
    }

    // Check for API keys
    const GEMINI_API_KEY = process.env.GOOGLE_GENAI_API_KEY;
    const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

    if (!GEMINI_API_KEY) {
      console.error("GOOGLE_GENAI_API_KEY is not set");
      return NextResponse.json(
        { success: false, error: "API configuration error - missing Gemini API key" },
        { status: 500 }
      );
    }

    if (!PERPLEXITY_API_KEY) {
      console.error("PERPLEXITY_API_KEY is not set");
      return NextResponse.json(
        { success: false, error: "API configuration error - missing Perplexity API key" },
        { status: 500 }
      );
    }

    // Enhance prompt with Perplexity AI
    let enhancedPrompt = customPrompt;
    if (customPrompt) {
      try {
        const perplexitySystemPrompt = `You are an expert at creating detailed prompts for AI image generation, specifically for mockup design.
Your job is to enhance and improve a basic request into a comprehensive, detailed prompt 
that will generate high-quality, realistic mockups when sent to an image generation AI.

Focus on these aspects when enhancing the prompt:
1. Specific visual details for the mockup type
2. Realistic lighting, shadows, and reflections
3. Proper perspective and dimensionality
4. High-quality materials and textures
5. Professional composition and framing
6. Color harmony and primary color influence

CRITICAL RULES:
- Focus ONLY on creating realistic mockups
- Do NOT include any text, logos, or decorative elements unless specifically requested
- Do NOT add any prefixes like "Enhanced prompt:" or explanations
- Just return the enhanced prompt text directly`;

        const perplexityUserPrompt = mode === "text-to-image"
          ? `Enhance this mockup prompt for a realistic ${mockupType} mockup${primaryColor ? ` with primary color ${primaryColor}` : ""}: "${customPrompt}"`
          : `Enhance this image placement prompt for placing an image into a target scene: "${customPrompt}"`;

        const perplexityResponse = await axios.post(
          "https://api.perplexity.ai/chat/completions",
          {
            model: "sonar-small-online",
            messages: [
              {
                role: "system",
                content: perplexitySystemPrompt
              },
              {
                role: "user",
                content: perplexityUserPrompt
              }
            ]
          },
          {
            headers: {
              "Authorization": `Bearer ${PERPLEXITY_API_KEY}`,
              "Content-Type": "application/json"
            }
          }
        );

        if (perplexityResponse.data.choices?.[0]?.message?.content) {
          enhancedPrompt = perplexityResponse.data.choices[0].message.content;
        }
      } catch (error) {
        console.error("Perplexity API error:", error);
        // Continue with original prompt if enhancement fails
      }
    }

    // Prepare Gemini AI prompt
    let geminiPrompt = "";
    if (mode === "text-to-image") {
      geminiPrompt = `Create a professional, photorealistic mockup of a ${mockupType} featuring the provided image. 
${primaryColor ? `Apply a primary color scheme with ${primaryColor} as the dominant color. ` : ""}
${enhancedPrompt ? `Additional instructions: ${enhancedPrompt} ` : ""}
Ensure realistic lighting, shadows, and materials. The mockup should be suitable for commercial use with high attention to detail.`;
    } else {
      geminiPrompt = `Place the main image realistically into the target image scene. 
Ensure natural perspective, lighting, and alignment that matches the environment. 
${enhancedPrompt ? `Additional placement instructions: ${enhancedPrompt} ` : ""}
The composite should look professionally edited with proper shadows and reflections where appropriate.`;
    }

    // Convert images to base64
    const mainImageArrayBuffer = await mainImage.arrayBuffer();
    const mainImageBase64 = Buffer.from(mainImageArrayBuffer).toString("base64");

    let targetImageBase64 = "";
    if (targetImage) {
      const targetImageArrayBuffer = await targetImage.arrayBuffer();
      targetImageBase64 = Buffer.from(targetImageArrayBuffer).toString("base64");
    }

    // Initialize Google Generative AI
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    // Prepare contents array for Gemini
    const contents = [geminiPrompt];

    // Add main image
    // @ts-expect-error - The Gemini API type definitions don't match the actual API structure
    contents.push({
      inlineData: {
        data: mainImageBase64,
        mimeType: mainImage.type,
      }
    });

    // Add target image for image-to-image mode
    if (mode === "image-to-image" && targetImageBase64) {
      // @ts-expect-error - The Gemini API type definitions don't match the actual API structure
      contents.push({
        inlineData: {
          data: targetImageBase64,
          mimeType: targetImage.type,
        }
      });
    }

    // Generate content with Gemini
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash-image-preview",
      contents,
    });

    // Extract image data from response with proper null checking
    let imageData = null;
    try {
      if (result.candidates && result.candidates[0]?.content?.parts) {
        for (const part of result.candidates[0].content.parts) {
          if (part.inlineData) {
            imageData = part.inlineData.data;
            break;
          }
        }
      }
    } catch (error) {
      console.error("Error extracting image data:", error);
    }

    // If we couldn't extract image data, return an error
    if (!imageData) {
      console.error("No image data found in Gemini response:", JSON.stringify(result, null, 2));
      return NextResponse.json(
        { success: false, error: "Failed to extract image from AI response" },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      image: imageData,
      prompt: geminiPrompt
    });

  } catch (error: unknown) {
    console.error("AI Mockup Studio API error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error occurred" },
      { status: 500 }
    );
  }
}