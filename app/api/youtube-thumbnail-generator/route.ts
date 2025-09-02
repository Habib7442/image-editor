import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import crypto from "crypto";
import axios from "axios";

// Cache for recently generated thumbnails (memory-based, can be replaced with Redis/DB in production)
const thumbnailCache = new Map<string, {
  timestamp: number;
  variations: Array<{ text: string; image: string; }>;
  title: string;
  promptsUsed: string[];
}>();

// In-memory rate limiting 
const requestCounts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(identifier: string): { success: boolean; limit?: number; remaining?: number; reset?: number } {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour in milliseconds
  const maxRequests = 10; // 10 requests per hour

  // Clean up old entries
  for (const [key, value] of requestCounts.entries()) {
    if (now > value.resetTime) {
      requestCounts.delete(key);
    }
  }

  const userRecord = requestCounts.get(identifier) || { count: 0, resetTime: now + windowMs };
  
  if (now > userRecord.resetTime) {
    userRecord.count = 0;
    userRecord.resetTime = now + windowMs;
  }

  if (userRecord.count >= maxRequests) {
    return {
      success: false,
      limit: maxRequests,
      remaining: 0,
      reset: userRecord.resetTime
    };
  }

  userRecord.count += 1;
  requestCounts.set(identifier, userRecord);

  return {
    success: true,
    limit: maxRequests,
    remaining: maxRequests - userRecord.count,
    reset: userRecord.resetTime
  };
}

// Content types with specific guidance
const contentTypeGuidance = {
  "tutorial": "Focus on showing the end result or key concept being taught. Use clear, instructional visuals with minimal text.",
  "entertainment": "Focus on creating an emotional hook with expressive faces or dramatic scenes. Use vibrant colors and dynamic compositions.",
  "review": "Include visual elements that represent the product or topic being reviewed. Use contrasting colors to highlight positive aspects.",
  "tech": "Use clean, modern design elements with tech-inspired visuals. Focus on showcasing gadgets, interfaces, or futuristic concepts.",
  "gaming": "Include gaming-related visuals like controllers, characters, or game scenes. Use dynamic, energetic compositions with bold colors.",
  "education": "Focus on clarity and information hierarchy. Use clean layouts with visual representations of concepts.",
  "vlog": "Focus on personal, relatable imagery. Use warm, inviting colors and authentic visuals.",
  "other": "Create an engaging, professional design that communicates the video's value."
};

/**
 * Enhances a YouTube thumbnail prompt with additional details for better results
 */
async function enhancePromptWithPerplexity(
  title: string, 
  contentType: string,
  primaryColors: string[] = [], 
  thumbnailStyle: string = "",
  additionalRequirements: string = ""
): Promise<string> {
  try {
    if (!process.env.PERPLEXITY_API_KEY) {
      throw new Error("Perplexity API key not configured");
    }

    const perplexityPrompt = `I need an optimized prompt for generating a professional YouTube thumbnail for a video titled: "${title}".

${contentType ? `Video Category: ${contentType}` : ''}
${primaryColors.length > 0 ? `Primary Colors: ${primaryColors.join(', ')}` : ''}
${thumbnailStyle ? `Visual Style: ${thumbnailStyle}` : ''}
${additionalRequirements ? `Additional Requirements: ${additionalRequirements}` : ''}

Essential YouTube thumbnail specifications:
- Output size: Exactly 1280x720 pixels (16:9 aspect ratio)
- The only text allowed in the thumbnail is the video title or a shortened version (3-5 words)
- Design must have high contrast, vibrant colors, and a clear focal point
- Composition must follow rule of thirds with clear visual hierarchy
- Style should be bold, attention-grabbing, and professional

Create a detailed, professional prompt optimized for a high-quality thumbnail that would achieve high click-through rates. Do not include any explanations, just provide the enhanced prompt.`;
    
    const response = await axios.post('https://api.perplexity.ai/chat/completions', {
      model: 'sonar',
      messages: [
        {
          role: 'system',
          content: 'You are an expert prompt engineer specializing in creating detailed, visually striking YouTube thumbnail prompts.'
        },
        {
          role: 'user',
          content: perplexityPrompt
        }
      ],
      max_tokens: 1024
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`
      }
    });
    
    if (response.data && response.data.choices && response.data.choices[0].message.content) {
      return response.data.choices[0].message.content.trim();
    }
  } catch (error) {
    console.error("Error enhancing prompt with Perplexity:", error);
  }
  
  // If enhancement fails, return a well-crafted fallback prompt
  return createFallbackPrompt(title, contentType, primaryColors, thumbnailStyle, additionalRequirements);
}

/**
 * Creates a fallback prompt if the Perplexity API enhancement fails
 */
function createFallbackPrompt(
  title: string, 
  contentType: string = "other",
  primaryColors: string[] = [], 
  thumbnailStyle: string = "",
  additionalRequirements: string = ""
): string {
  let prompt = `Create a professional YouTube thumbnail for a video titled: "${title}".
  
Essential requirements:
1. Size: 1280x720 pixels (YouTube recommended)
2. Text: Include large, bold, readable text with maximum 3-5 words from the title
3. Visuals: High contrast, vibrant colors, clear focal point
4. Composition: Rule of thirds, visual hierarchy, minimal clutter
5. Style: Bold, attention-grabbing, professional`;

  // Add content type specific guidance
  if (contentType && contentTypeGuidance[contentType as keyof typeof contentTypeGuidance]) {
    prompt += `\n\nContent type: ${contentType}\n${contentTypeGuidance[contentType as keyof typeof contentTypeGuidance]}`;
  }

  // Add color preferences
  if (primaryColors.length > 0) {
    prompt += `\n\nPreferred color scheme: ${primaryColors.join(", ")}
Use these colors prominently in the design for brand consistency.`;
  }

  // Add style preferences
  if (thumbnailStyle) {
    prompt += `\n\nVisual style: ${thumbnailStyle}
Apply this visual style to create a cohesive look.`;
  }

  // Add additional requirements
  if (additionalRequirements) {
    prompt += `\n\nAdditional requirements: ${additionalRequirements}`;
  }

  // Add final instructions for maximum impact
  prompt += `\n\nDesign this thumbnail to look like a million-dollar YouTube thumbnail that would achieve high click-through rates.
Key design principles:
- Use contrasting colors that stand out in YouTube's dark interface
- Include expressive faces or clear subject matter
- Create a clear visual hierarchy with text and imagery
- Avoid clutter and maintain focus on the main message
- Ensure text is readable even at small sizes
- Use bold, sans-serif fonts for maximum impact

The thumbnail should grab attention within 0.5 seconds and clearly communicate the video's value proposition.`;

  return prompt;
}

/**
 * Creates variations of a base prompt for generating multiple thumbnails
 */
function createPromptVariations(basePrompt: string, count: number = 3): string[] {
  const variations = [basePrompt];
  
  if (count <= 1) return variations;
  
  // Create variations with different emphases
  const variationTemplates = [
    `${basePrompt}\n\nFor this variation, emphasize bold, vibrant colors and maximize the visual impact with high contrast. Focus on creating an eye-catching thumbnail that stands out in search results.`,
    `${basePrompt}\n\nFor this variation, use a clean, minimalist approach with ample negative space. Focus on making the text extremely readable with a simple, powerful visual hierarchy.`,
    `${basePrompt}\n\nFor this variation, create an emotionally engaging thumbnail that evokes curiosity. Use dramatic lighting and composition to draw viewers in and make them want to click.`,
    `${basePrompt}\n\nFor this variation, use a professional, corporate style with polished graphics and a sophisticated color palette. Focus on establishing authority and expertise in the thumbnail design.`,
    `${basePrompt}\n\nFor this variation, use an energetic, action-oriented design with dynamic elements. Create a sense of motion and excitement to attract viewers.`
  ];
  
  // Add variations up to the requested count
  for (let i = 0; i < Math.min(count - 1, variationTemplates.length); i++) {
    variations.push(variationTemplates[i]);
  }
  
  return variations;
}

export async function GET(request: NextRequest) {
  try {
    // Get the cache key from the URL
    const { searchParams } = new URL(request.url);
    const cacheKey = searchParams.get('key');
    
    if (!cacheKey) {
      return NextResponse.json({ success: false, error: "Cache key is required" }, { status: 400 });
    }
    
    // Check if the cache key exists
    if (thumbnailCache.has(cacheKey)) {
      const cachedData = thumbnailCache.get(cacheKey);
      if (cachedData) {
        return NextResponse.json({
          success: true,
          variations: cachedData.variations,
          title: cachedData.title,
          variationCount: cachedData.variations.length,
          fromCache: true,
          promptsUsed: cachedData.promptsUsed,
          cacheKey
        });
      }
    }
    
    return NextResponse.json({ success: false, error: "Cache key not found" }, { status: 404 });
  } catch (error: unknown) {
    console.error("Error retrieving cached thumbnails:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = request.headers.get("x-forwarded-for") || "anonymous";
    const rateLimitResult = checkRateLimit(identifier);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": rateLimitResult.limit?.toString() || "10",
            "X-RateLimit-Remaining": rateLimitResult.remaining?.toString() || "0",
            "X-RateLimit-Reset": rateLimitResult.reset?.toString() || "0",
          },
        }
      );
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const keywords = formData.get("keywords") as string;
    const contentType = formData.get("contentType") as string;
    const primaryColors = (formData.get("primaryColors") as string || "").split(",").filter(Boolean);
    const thumbnailStyle = formData.get("thumbnailStyle") as string;
    const additionalRequirements = formData.get("additionalRequirements") as string;
    const customPrompt = formData.get("customPrompt") as string;
    const imageFile = formData.get("image") as File | null;
    const variationCount = Number(formData.get("variationCount") as string) || 3; // Default to 3 variations
    const cacheKey = formData.get("cacheKey") as string; // For retrieving cached results
    
    // Check if we should retrieve from cache
    if (cacheKey && thumbnailCache.has(cacheKey)) {
      const cachedData = thumbnailCache.get(cacheKey);
      if (cachedData) {
        return NextResponse.json({
          success: true,
          variations: cachedData.variations,
          title: cachedData.title,
          variationCount: cachedData.variations.length,
          fromCache: true,
          promptsUsed: cachedData.promptsUsed,
          cacheKey
        }, {
          headers: {
            "X-RateLimit-Limit": rateLimitResult.limit?.toString() || "10",
            "X-RateLimit-Remaining": rateLimitResult.remaining?.toString() || "0",
            "X-RateLimit-Reset": rateLimitResult.reset?.toString() || "0",
          },
        });
      }
    }

    // Validate inputs
    if (!title) {
      return NextResponse.json(
        { success: false, error: "Video title is required" },
        { status: 400 }
      );
    }

    // Generate base prompt
    let basePrompt: string;
    
    if (customPrompt) {
      // If custom prompt is provided, use it directly
      basePrompt = customPrompt;
    } else {
      // Generate an enhanced prompt
      basePrompt = await enhancePromptWithPerplexity(
        title, 
        contentType, 
        primaryColors,
        thumbnailStyle, 
        `${keywords ? `Keywords: ${keywords}. ` : ''}${additionalRequirements || ''}`
      );
    }

    // Generate prompt variations for multiple thumbnails
    const promptVariations = createPromptVariations(basePrompt, variationCount);

    // Check if API key is available
    if (!process.env.GOOGLE_GENAI_API_KEY) {
      console.error("GOOGLE_GENAI_API_KEY is not set");
      return NextResponse.json(
        {
          success: false,
          error: "API configuration error - missing API key",
        },
        { status: 500 }
      );
    }

    // Convert image to base64 if provided
    let base64Image: string | null = null;
    if (imageFile) {
      const arrayBuffer = await imageFile.arrayBuffer();
      base64Image = Buffer.from(arrayBuffer).toString("base64");
    }

    // Initialize Google Generative AI
    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY! });

    // Generate variations
    const variationPromises = promptVariations.map(async (prompt) => {
      try {
        const contents = [prompt];
        
        // Add image if available
        if (base64Image) {
          // @ts-expect-error - The Gemini API type definitions don't match the actual API structure
          contents.push({
            inlineData: {
              data: base64Image,
              mimeType: imageFile!.type,
            }
          });
        }
        
        return await ai.models.generateContent({
          model: "gemini-2.5-flash-image-preview",
          contents,
        });
      } catch (error) {
        console.error("Error generating variation:", error);
        return null;
      }
    });
    
    const variations = await Promise.all(variationPromises);
    const validVariations = variations.filter(response => response !== null);

    // Process all variations
    const results = [];
    
    for (const response of validVariations) {
      let text = "";
      let imageData = null;

      // Extract image data from response with proper null checking
      try {
        if (response.candidates && response.candidates[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.text) {
              text += part.text;
            } else if (part.inlineData) {
              imageData = part.inlineData.data;
              break;
            }
          }
        }
      } catch (error) {
        console.error("Error extracting image data:", error);
      }

      if (imageData) {
        results.push({
          text: text || "YouTube thumbnail generated successfully",
          image: imageData,
        });
      }
    }

    // Generate a unique cache key
    const newCacheKey = crypto.randomBytes(16).toString('hex');
    
    // Store in cache for future retrieval
    thumbnailCache.set(newCacheKey, {
      timestamp: Date.now(),
      variations: results,
      title,
      promptsUsed: promptVariations
    });
    
    // Clean up old cache entries (keep for 24 hours)
    const cacheCleanupTime = Date.now() - (24 * 60 * 60 * 1000);
    for (const [key, value] of thumbnailCache.entries()) {
      if (value.timestamp < cacheCleanupTime) {
        thumbnailCache.delete(key);
      }
    }

    // Prepare response
    const cleanResponse = {
      success: true,
      variations: results,
      title,
      variationCount: results.length,
      modelUsed: "gemini-2.5-flash-image-preview",
      promptsUsed: promptVariations,
      cacheKey: newCacheKey
    };

    return NextResponse.json(cleanResponse, {
      headers: {
        "X-RateLimit-Limit": rateLimitResult.limit?.toString() || "10",
        "X-RateLimit-Remaining": rateLimitResult.remaining?.toString() || "0",
        "X-RateLimit-Reset": rateLimitResult.reset?.toString() || "0",
      },
    });
  } catch (error: unknown) {
    console.error("YouTube Thumbnail Generator API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred with the AI service",
      },
      { status: 500 }
    );
  }
}