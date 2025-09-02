import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Mockup type specifications for consistent placement
const mockupSpecifications = {
  "Billboard": {
    placement: "large outdoor billboard with proper perspective and scale",
    lighting: "natural outdoor lighting with realistic shadows",
    materials: "billboard material with proper texture and mounting"
  },
  "Subway Board": {
    placement: "subway station advertising board with proper urban context",
    lighting: "fluorescent indoor lighting with realistic reflections",
    materials: "advertising board material with proper mounting hardware"
  },
  "Mug": {
    placement: "ceramic mug with proper 3D perspective and handle visibility",
    lighting: "soft studio lighting with realistic ceramic reflections",
    materials: "ceramic material with proper glaze and texture"
  },
  "T-Shirt": {
    placement: "cotton t-shirt with proper fabric drape and fit",
    lighting: "natural lighting showing fabric texture and folds",
    materials: "cotton fabric with realistic texture and stretch"
  },
  "Magazine Cover": {
    placement: "magazine cover with proper proportions and binding",
    lighting: "professional studio lighting with clean shadows",
    materials: "glossy magazine paper with realistic print quality"
  },
  "Poster": {
    placement: "wall-mounted poster with proper perspective and mounting",
    lighting: "natural indoor lighting with realistic wall shadows",
    materials: "poster paper with proper texture and slight curl"
  },
  "Business Card": {
    placement: "business card with proper proportions and thickness",
    lighting: "professional lighting showing card material and edges",
    materials: "cardstock with realistic thickness and finish"
  },
  "Brochure": {
    placement: "folded brochure with proper creases and proportions",
    lighting: "clean lighting showing paper texture and folds",
    materials: "brochure paper with realistic fold lines and thickness"
  },
  "Sticker": {
    placement: "adhesive sticker with proper backing and application",
    lighting: "natural lighting showing sticker material and edges",
    materials: "vinyl sticker material with realistic adhesive backing"
  },
  "Phone Case": {
    placement: "phone case with proper device proportions and cutouts",
    lighting: "natural lighting showing case material and phone integration",
    materials: "phone case material with proper texture and fit"
  },
  "Laptop Skin": {
    placement: "laptop skin with proper device proportions and keyboard cutouts",
    lighting: "natural lighting showing skin material and laptop integration",
    materials: "laptop skin material with proper texture and adhesion"
  },
  "Canvas Print": {
    placement: "canvas print with proper frame and hanging hardware",
    lighting: "gallery lighting showing canvas texture and frame",
    materials: "canvas material with realistic texture and frame"
  },
  "Book Cover": {
    placement: "book cover with proper spine and binding proportions",
    lighting: "natural lighting showing book material and binding",
    materials: "book cover material with realistic texture and binding"
  },
  "CD Cover": {
    placement: "CD case with proper proportions and disc visibility",
    lighting: "natural lighting showing case material and disc",
    materials: "CD case material with realistic transparency and texture"
  },
  "Banner": {
    placement: "banner with proper hanging and fabric drape",
    lighting: "natural lighting showing fabric texture and hanging",
    materials: "banner fabric with realistic texture and weight"
  }
};

/**
 * Creates a strict, accurate prompt for mockup placement
 */
function createStrictMockupPrompt(
  mode: string,
  mockupType: string | null,
  customPrompt: string | null,
  primaryColor: string | null
): string {
  if (mode === "text-to-image") {
    const mockupSpec = mockupSpecifications[mockupType as keyof typeof mockupSpecifications] || {
      placement: "professional mockup with proper perspective and scale",
      lighting: "realistic lighting with proper shadows and reflections",
      materials: "appropriate material with realistic texture"
    };

    return `CRITICAL MOCKUP INSTRUCTIONS - FOLLOW EXACTLY:

MOCKUP PLACEMENT REQUIREMENTS:
- Create a professional ${mockupType} mockup featuring the provided image
- Place the image with ${mockupSpec.placement}
- Apply ${mockupSpec.lighting}
- Use ${mockupSpec.materials}
- Ensure proper perspective, scale, and proportions
- Maintain the original image quality and clarity

IMAGE PRESERVATION:
- PRESERVE the exact content, colors, and details of the provided image
- DO NOT alter, modify, or distort the image content
- DO NOT add text, logos, or decorative elements to the image
- MAINTAIN the original image's aspect ratio and composition
- KEEP the image sharp and high-quality

MOCKUP REALISM:
- Create realistic shadows and reflections appropriate to the mockup type
- Ensure proper lighting that matches the mockup environment
- Add appropriate material textures and finishes
- Include realistic mounting, hanging, or placement elements
- Make the mockup look professionally photographed

ABSOLUTE PROHIBITIONS:
- NO TEXT, WORDS, LETTERS, OR WRITING of any kind
- NO DECORATIVE ELEMENTS, BORDERS, OR FRAMES with text
- NO LOGOS, WATERMARKS, OR BRANDING elements
- NO MODIFICATIONS to the original image content
- NO DISTORTION or quality loss of the original image

${primaryColor ? `COLOR SCHEME: Apply ${primaryColor} as the dominant color in the mockup design while preserving the original image colors.` : ''}

${customPrompt ? `ADDITIONAL USER REQUIREMENTS: ${customPrompt}` : ''}

Remember: This is a mockup creation, not an image modification. Preserve the original image perfectly while creating a realistic mockup presentation.`;
  } else {
    return `CRITICAL IMAGE PLACEMENT INSTRUCTIONS - FOLLOW EXACTLY:

IMAGE PLACEMENT REQUIREMENTS:
- Place the main image realistically into the target image scene
- Ensure natural perspective, lighting, and alignment that matches the environment
- Maintain proper scale and proportions relative to the target scene
- Create seamless integration with the target environment
- Preserve the original image quality and clarity

IMAGE PRESERVATION:
- PRESERVE the exact content, colors, and details of the main image
- DO NOT alter, modify, or distort the main image content
- DO NOT add text, logos, or decorative elements to the main image
- MAINTAIN the original image's aspect ratio and composition
- KEEP the main image sharp and high-quality

ENVIRONMENT INTEGRATION:
- Match the lighting conditions of the target scene
- Create appropriate shadows and reflections for the environment
- Ensure the main image looks naturally placed in the scene
- Maintain realistic perspective and depth
- Blend seamlessly with the target environment

ABSOLUTE PROHIBITIONS:
- NO TEXT, WORDS, LETTERS, OR WRITING of any kind
- NO DECORATIVE ELEMENTS, BORDERS, OR FRAMES with text
- NO LOGOS, WATERMARKS, OR BRANDING elements
- NO MODIFICATIONS to the original main image content
- NO DISTORTION or quality loss of the original main image

${customPrompt ? `ADDITIONAL PLACEMENT REQUIREMENTS: ${customPrompt}` : ''}

Remember: This is image placement, not image modification. Preserve the main image perfectly while placing it naturally in the target scene.`;
  }
}

/**
 * Validates and cleans mockup prompts to ensure they don't contain conflicting instructions
 */
function validateAndCleanMockupPrompt(prompt: string): string {
  // Remove any conflicting instructions that might cause issues
  const cleanedPrompt = prompt
    .replace(/add text|include text|write|caption|title|label/gi, '')
    .replace(/decorative|ornament|border|frame/gi, '')
    .replace(/modify image|alter image|change image/gi, 'preserve image')
    .replace(/distort|warp|stretch/gi, 'maintain proportions');
  
  return cleanedPrompt;
}

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

    // Check for API key
    const GEMINI_API_KEY = process.env.GOOGLE_GENAI_API_KEY;

    if (!GEMINI_API_KEY) {
      console.error("GOOGLE_GENAI_API_KEY is not set");
      return NextResponse.json(
        { success: false, error: "API configuration error - missing Gemini API key" },
        { status: 500 }
      );
    }

    // Create strict mockup prompt for consistent, accurate placement
    const strictPrompt = createStrictMockupPrompt(mode, mockupType, customPrompt, primaryColor);
    
    // Validate and clean the prompt to remove any conflicting instructions
    const validatedPrompt = validateAndCleanMockupPrompt(strictPrompt);
    
    // Add final consistency check
    const finalPrompt = `${validatedPrompt}

FINAL CONSISTENCY CHECK:
- Ensure the main image is placed perfectly without any distortion
- NO text, words, or writing anywhere in the final result
- Maintain the original image quality and clarity
- Create realistic mockup presentation with proper lighting and materials
- Make the result look professionally photographed and commercially viable`;

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
    const contents = [finalPrompt];

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
      prompt: finalPrompt,
      mode: mode,
      mockupType: mockupType
    });

  } catch (error: unknown) {
    console.error("AI Mockup Studio API error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error occurred" },
      { status: 500 }
    );
  }
}