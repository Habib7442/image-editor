import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import axios from "axios";
import crypto from "crypto";

// Cache for recently generated images (memory-based, can be replaced with Redis/DB in production)
const imageCache = new Map<string, {
  timestamp: number;
  variations: Array<{ text: string; image: string; }>;
  timePeriod: string;
  promptsUsed: string[];
}>();

// In-memory rate limiting as fallback
const requestCounts = new Map<string, { count: number; resetTime: number }>();

// Decade characteristics for enhanced prompts
const decadeCharacteristics = {
  "1950s": {
    style: "classic black and white portraits with formal poses, short hairstyles for men, and curled hairstyles for women",
    fashion: "letterman jackets, bow ties, high-waisted pants for men, and modest dresses, peter pan collars, and pearl necklaces for women",
    lighting: "formal studio lighting with soft shadows and classic portrait composition"
  },
  "1960s": {
    style: "high-contrast black and white photos with dramatic lighting, beehive hairstyles for women, and longer hair for men",
    fashion: "mod fashion, slim-fit suits, turtlenecks for men, and shift dresses, go-go boots, and statement accessories for women",
    lighting: "dramatic lighting with stronger shadows and more experimental compositions"
  },
  "1970s": {
    style: "color photography with warm tones, long feathered hair for both men and women",
    fashion: "wide collars, bell-bottoms, patterned shirts for men, and peasant blouses, platform shoes, and bohemian-inspired accessories for women",
    lighting: "natural lighting with a soft glow and earth-toned backgrounds"
  },
  "1980s": {
    style: "vivid color photography with blue backgrounds, big permed or teased hair, and vibrant makeup",
    fashion: "denim jackets, mullets for men, and power suits with shoulder pads, neon colors, and statement jewelry for women",
    lighting: "flash photography with bold colors and laser-backdrop options"
  },
  "1990s": {
    style: "sharper color photography with gradient or laser backgrounds, Rachel haircuts for women, and curtained hair for men",
    fashion: "flannel shirts, varsity jackets for men, and slip dresses, chokers, and grunge-inspired or preppy outfits for women",
    lighting: "studio lighting with mottled backgrounds and subtle gradients"
  },
  "2000s": {
    style: "digital photography with enhanced colors, spiky hair for men, and straight ironed hair for women",
    fashion: "popped collars, layered looks for men, and low-rise jeans, baby tees, and Y2K fashion for women",
    lighting: "high-definition digital photography with cleaner backgrounds"
  },
  "2010s": {
    style: "high-definition digital photography with natural-looking editing, side-swept hair for men, and long layered styles for women",
    fashion: "skinny jeans, v-neck shirts for men, and high-waisted pants, crop tops, and statement accessories for women",
    lighting: "professional lighting with minimal editing and Instagram-inspired filters"
  }
};

/**
 * Generates enhanced creative prompts based on the time period
 * @deprecated - Kept for backward compatibility but no longer directly called
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function generateEnhancedPrompts(timePeriod: string, count: number = 3): Promise<string[]> {
  const decade = timePeriod.includes('s') ? timePeriod : `${Math.floor(parseInt(timePeriod) / 10) * 10}s`;
  
  // Get decade characteristics or use generic if not found
  const decadeInfo = decadeCharacteristics[decade as keyof typeof decadeCharacteristics] || {
    style: "vintage photography typical of the era",
    fashion: "clothing and accessories authentic to the time period",
    lighting: "period-appropriate lighting and composition"
  };
  
  // Try to enhance with Perplexity API if available
  // Note: This path is now deprecated as we use consistent prompts instead
  /*
  try {
    if (process.env.PERPLEXITY_API_KEY) {
      const enhancedPrompts = await enhancePromptsWithPerplexity(timePeriod, count);
      if (enhancedPrompts && enhancedPrompts.length > 0) {
        return enhancedPrompts;
      }
    }
  } catch (error) {
    console.error("Error enhancing prompts with Perplexity:", error);
    // Continue with fallback prompts
  }
  */
  
  // Fallback prompt variations if Perplexity enhancement fails
  const baseVariations = [
    `Transform this portrait into an authentic ${decade} yearbook photo with ${decadeInfo.style}. Style the subject with ${decadeInfo.fashion}. Use ${decadeInfo.lighting}. Create a nostalgic yearbook portrait that perfectly captures the essence and aesthetic of ${timePeriod}. Maintain the subject's likeness while transforming everything else to fit the era.`,
    
    `Create a perfectly authentic ${decade} yearbook portrait. Capture the quintessential ${decadeInfo.style} of the era. Dress the subject in period-accurate ${decadeInfo.fashion}. Apply ${decadeInfo.lighting} for ultimate authenticity. Transform only the style, keeping the subject's facial features recognizable. Make it indistinguishable from a genuine ${timePeriod} yearbook photo.`,
    
    `Reimagine this modern portrait as a ${timePeriod} yearbook photo with impeccable attention to detail. Style with iconic ${decadeInfo.fashion} and capture the ${decadeInfo.style}. Ensure the background and ${decadeInfo.lighting} are exactly as they would appear in a real yearbook from that era. Maintain the subject's identity while perfectly transforming everything else.`
  ];
  
  // Add additional variations if needed
  if (count > 3) {
    baseVariations.push(
      `Transform this photo into the ultimate ${timePeriod} yearbook portrait with meticulous historical accuracy. Style the subject with the most iconic ${decadeInfo.fashion} from that precise moment in history. Use absolutely authentic ${decadeInfo.style} and ${decadeInfo.lighting} that would be indistinguishable from an actual yearbook of the era. Create a masterpiece of nostalgic transformation while preserving the subject's core facial characteristics.`,
      
      `Create a flawless ${decade} yearbook portrait with an artistic twist. Incorporate the defining ${decadeInfo.style} with subtle creative enhancements that honor the era's aesthetic. Style with historically accurate ${decadeInfo.fashion} while adding a touch of timeless elegance. Use ${decadeInfo.lighting} with slight artistic improvements for the perfect blend of authenticity and visual appeal.`
    );
  }
  
  // Return only the requested number of variations
  return baseVariations.slice(0, count);
}

/**
 * Enhances a user-provided custom prompt with additional details and historical accuracy
 */
async function enhanceCustomPrompt(customPrompt: string, timePeriod: string): Promise<string> {
  // Try to enhance with Perplexity if available
  try {
    if (process.env.PERPLEXITY_API_KEY) {
      const perplexityPrompt = `I have a user-provided prompt for an AI image generator that will transform a modern portrait photo into a yearbook photo from ${timePeriod}. The user's prompt is: "${customPrompt}". 

Please enhance this prompt with historically accurate details about yearbook photography from that era, including specifics about:
- Photography style and techniques used during that time period
- Common poses, facial expressions, and framing used in yearbook photos
- Typical lighting setups, backdrops, and composition
- Fashion details, accessories, and hairstyles authentic to the era

Your response should be a single, detailed prompt paragraph that incorporates the user's original instructions but adds rich historical detail. Do not include any explanations, just provide the enhanced prompt text.`;
      
      const response = await axios.post('https://api.perplexity.ai/chat/completions', {
        model: 'sonar',
        messages: [
          {
            role: 'system',
            content: 'You are an expert prompt engineer and historical photography consultant specializing in creating detailed, historically accurate descriptions for AI image generation.'
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
        const enhancedContent = response.data.choices[0].message.content.trim();
        if (enhancedContent) {
          return `Transform this photo into a yearbook-style portrait from ${timePeriod}. \n${enhancedContent}\nFocus on creating an authentic vintage appearance appropriate to the time period. The person should be the main focus. \n\nEXTREMELY IMPORTANT OUTPUT REQUIREMENTS:\n- Generate EXACTLY in Instagram post size format\n- Final image must be 1080x1350 pixels with 4:5 aspect ratio\n- Center the subject properly in this vertical format\n- Ensure the composition works well with this portrait orientation\n- Do not generate in landscape format or any other dimensions`;
        }
      }
    }
  } catch (error) {
    console.error("Error enhancing custom prompt with Perplexity:", error);
  }
  
  // If enhancement fails, return the original prompt with some basic additions
  const decade = timePeriod.includes('s') ? timePeriod : `${Math.floor(parseInt(timePeriod) / 10) * 10}s`;
  const decadeInfo = decadeCharacteristics[decade as keyof typeof decadeCharacteristics] || {
    style: "vintage photography typical of the era",
    fashion: "clothing and accessories authentic to the time period",
    lighting: "period-appropriate lighting and composition"
  };
  
  return `Transform this photo into a yearbook-style portrait from ${timePeriod}. \n${customPrompt}\n\nAdditional details: Capture the ${decadeInfo.style}. Style with authentic ${decadeInfo.fashion}. Use ${decadeInfo.lighting} for historical accuracy.\n\nFocus on creating an authentic vintage appearance appropriate to the time period. The person should be the main focus.\n\nEXTREMELY IMPORTANT OUTPUT REQUIREMENTS:\n- Generate EXACTLY in Instagram post size format\n- Final image must be 1080x1350 pixels with 4:5 aspect ratio\n- Center the subject properly in this vertical format\n- Ensure the composition works well with this portrait orientation\n- Do not generate in landscape format or any other dimensions`;
}

/**
 * Enhances prompts using Perplexity API for more creative and detailed variations
 * @deprecated - Kept for backward compatibility but no longer directly called
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function enhancePromptsWithPerplexity(timePeriod: string, count: number): Promise<string[]> {
  try {
    const perplexityPrompt = `Generate ${count} different, highly detailed and creative prompts for an AI image generator that will transform a modern portrait photo into an authentic yearbook photo from the ${timePeriod}. Each prompt should have unique styling details, capture the essence of the era's photography style, fashion, hairstyles, and lighting techniques. Focus on historical accuracy and authenticity. Format the response as a JSON array of strings, with each string being a complete, detailed prompt. Do not include any explanations or additional text outside the JSON array.`;
    
    const response = await axios.post('https://api.perplexity.ai/chat/completions', {
      model: 'sonar',
      messages: [
        {
          role: 'system',
          content: 'You are an expert prompt engineer specializing in creating detailed, historically accurate descriptions for AI image generation.'
        },
        {
          role: 'user',
          content: perplexityPrompt
        }
      ],
      max_tokens: 2048
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`
      }
    });
    
    if (response.data && response.data.choices && response.data.choices[0].message.content) {
      try {
        // Extract JSON array from response text
        const content = response.data.choices[0].message.content;
        const jsonMatch = content.match(/\[\s*".*"\s*\]/s);
        if (jsonMatch) {
          const promptsArray = JSON.parse(jsonMatch[0]);
          if (Array.isArray(promptsArray) && promptsArray.length > 0) {
            return promptsArray.map(prompt => 
              `Transform this photo into a yearbook-style portrait from ${timePeriod}. \n${prompt}\nFocus on creating an authentic vintage appearance appropriate to the time period. The person should be the main focus.`
            );
          }
        }
      } catch (parseError) {
        console.error("Error parsing Perplexity response:", parseError);
      }
    }
  } catch (error) {
    console.error("Perplexity API error:", error);
  }
  
  return [];
}

function checkRateLimit(identifier: string): { success: boolean; limit?: number; remaining?: number; reset?: number } {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour in milliseconds
  const maxRequests = 5; // 5 requests per hour

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

export async function GET(request: NextRequest) {
  try {
    // Get the cache key from the URL
    const { searchParams } = new URL(request.url);
    const cacheKey = searchParams.get('key');
    
    if (!cacheKey) {
      return NextResponse.json({ success: false, error: "Cache key is required" }, { status: 400 });
    }
    
    // Check if the cache key exists
    if (imageCache.has(cacheKey)) {
      const cachedData = imageCache.get(cacheKey);
      if (cachedData) {
        return NextResponse.json({
          success: true,
          variations: cachedData.variations,
          timePeriod: cachedData.timePeriod,
          variationCount: cachedData.variations.length,
          fromCache: true,
          promptsUsed: cachedData.promptsUsed,
          cacheKey
        });
      }
    }
    
    return NextResponse.json({ success: false, error: "Cache key not found" }, { status: 404 });
  } catch (error: unknown) {
    console.error("Error retrieving cached image:", error);
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
            "X-RateLimit-Limit": rateLimitResult.limit?.toString() || "5",
            "X-RateLimit-Remaining": rateLimitResult.remaining?.toString() || "0",
            "X-RateLimit-Reset": rateLimitResult.reset?.toString() || "0",
          },
        }
      );
    }

    const formData = await request.formData();
    const imageFile = formData.get("image") as File | null;
    const year = formData.get("year") as string;
    const decade = formData.get("decade") as string;
    const customPrompt = formData.get("customPrompt") as string;
    const variationCount = Number(formData.get("variationCount") as string) || 3; // Default to 3 variations
    const cacheKey = formData.get("cacheKey") as string; // For retrieving cached results
    const enhance = formData.get("enhance") !== "false"; // Whether to enhance prompts with AI (default true)
    
    // Check if we should retrieve from cache
    if (cacheKey && imageCache.has(cacheKey)) {
      const cachedData = imageCache.get(cacheKey);
      if (cachedData) {
        return NextResponse.json({
          success: true,
          variations: cachedData.variations,
          timePeriod: cachedData.timePeriod,
          variationCount: cachedData.variations.length,
          fromCache: true,
          promptsUsed: cachedData.promptsUsed,
          cacheKey
        }, {
          headers: {
            "X-RateLimit-Limit": rateLimitResult.limit?.toString() || "5",
            "X-RateLimit-Remaining": rateLimitResult.remaining?.toString() || "0",
            "X-RateLimit-Reset": rateLimitResult.reset?.toString() || "0",
          },
        });
      }
    }

    // Validate inputs
    if (!imageFile) {
      return NextResponse.json(
        { success: false, error: "Image is required" },
        { status: 400 }
      );
    }

    if (!year && !decade) {
      return NextResponse.json(
        { success: false, error: "Year or decade is required" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(imageFile.type)) {
      return NextResponse.json(
        { success: false, error: "Invalid file type. Please upload a JPG, PNG, or WebP image." },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (imageFile.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "File size too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    // Use the custom prompt if provided, otherwise create enhanced prompts
    const timePeriod = year ? `${year}` : `${decade}`;
    const basePrompts = [];
    
    if (customPrompt) {
      if (enhance) {
        // If custom prompt is provided but we should enhance it
        const enhancedCustomPrompt = await enhanceCustomPrompt(customPrompt, timePeriod);
        
        // Create identical prompts for all variations, with only a small suffix to indicate variation number
        for (let i = 0; i < variationCount; i++) {
          const variationSuffix = i === 0 ? '' : `\n\nThis is variation ${i+1}. Follow the exact same instructions as above while creating a slightly different visual interpretation. Maintain all the specific requirements exactly as requested.`;
          basePrompts.push(enhancedCustomPrompt + variationSuffix + "\nOutput size: 1080x1350 pixels (4:5 aspect ratio).");
        }
      } else {
        // Use custom prompt as-is for all variations
        const baseCustomPrompt = `Transform this photo into a yearbook-style portrait from ${timePeriod}. 
        ${customPrompt}
        Focus on creating an authentic vintage or retro appearance appropriate to the time period.
        Do not include any modern elements, text, or decorations.
        The person in the photo should be the main focus.
        
        EXTREMELY IMPORTANT OUTPUT REQUIREMENTS:
        - Generate EXACTLY in Instagram post size format
        - Final image must be 1080x1350 pixels with 4:5 aspect ratio
        - Center the subject properly in this vertical format
        - Ensure the composition works well with this portrait orientation
        - Do not generate in landscape format or any other dimensions`;
        
        // Create identical prompts for all variations, with only a small suffix to indicate variation number
        for (let i = 0; i < variationCount; i++) {
          const variationSuffix = i === 0 ? '' : `\n\nThis is variation ${i+1}. Follow the exact same instructions as above while creating a slightly different visual interpretation. Maintain all the specific requirements exactly as requested.`;
          basePrompts.push(baseCustomPrompt + variationSuffix);
        }
      }
    } else {
      // Create base prompt with decade characteristics
      const decade = timePeriod.includes('s') ? timePeriod : `${Math.floor(parseInt(timePeriod) / 10) * 10}s`;
      const decadeInfo = decadeCharacteristics[decade as keyof typeof decadeCharacteristics] || {
        style: "vintage photography typical of the era",
        fashion: "clothing and accessories authentic to the time period",
        lighting: "period-appropriate lighting and composition"
      };
      
      // Create a single base prompt
      const basePrompt = `Transform this portrait into an authentic ${decade} yearbook photo with ${decadeInfo.style}. 
      Style the subject with ${decadeInfo.fashion}. Use ${decadeInfo.lighting}. 
      Create a nostalgic yearbook portrait that perfectly captures the essence and aesthetic of ${timePeriod}. 
      Maintain the subject's likeness while transforming everything else to fit the era.
      
      EXTREMELY IMPORTANT OUTPUT REQUIREMENTS:
      - Generate EXACTLY in Instagram post size format
      - Final image must be 1080x1350 pixels with 4:5 aspect ratio
      - Center the subject properly in this vertical format
      - Ensure the composition works well with this portrait orientation
      - Do not generate in landscape format or any other dimensions`;
      
      // Create identical prompts for all variations with only slight variation suffix
      for (let i = 0; i < variationCount; i++) {
        const variationSuffix = i === 0 ? '' : `\n\nThis is variation ${i+1}. Follow the exact same instructions as above while creating a slightly different visual interpretation. Maintain all the specific requirements exactly as requested.`;
        basePrompts.push(basePrompt + variationSuffix);
      }
    }

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

    // Convert image to base64
    const arrayBuffer = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");

    // Initialize Google Generative AI with the correct options object
    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY! });

    // Generate variations
    const variationPromises = basePrompts.map(async (prompt) => {
      try {
        // Note: Since generationConfig is not supported in this version of the API,
        // we'll rely entirely on prompt instructions for size guidelines
        return await ai.models.generateContent({
          model: "gemini-2.5-flash-image-preview",
          contents: [
            prompt,
            {
              inlineData: {
                data: base64Image,
                mimeType: imageFile.type,
              },
            }
          ]
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
          text: text || "Yearbook-style image variation generated successfully",
          image: imageData,
        });
      }
    }

    // Generate a unique cache key
    const newCacheKey = crypto.randomBytes(16).toString('hex');
    
    // Store in cache for future retrieval
    imageCache.set(newCacheKey, {
      timestamp: Date.now(),
      variations: results,
      timePeriod,
      promptsUsed: basePrompts
    });
    
    // Clean up old cache entries (keep for 24 hours)
    const cacheCleanupTime = Date.now() - (24 * 60 * 60 * 1000);
    for (const [key, value] of imageCache.entries()) {
      if (value.timestamp < cacheCleanupTime) {
        imageCache.delete(key);
      }
    }

    // Prepare response
    const cleanResponse = {
      success: true,
      variations: results,
      timePeriod: timePeriod,
      variationCount: results.length,
      modelUsed: "gemini-2.5-flash-image-preview",
      promptsUsed: basePrompts,
      cacheKey: newCacheKey
    };

    return NextResponse.json(cleanResponse, {
      headers: {
        "X-RateLimit-Limit": rateLimitResult.limit?.toString() || "5",
        "X-RateLimit-Remaining": rateLimitResult.remaining?.toString() || "0",
        "X-RateLimit-Reset": rateLimitResult.reset?.toString() || "0",
      },
    });
  } catch (error: unknown) {
    console.error("AI Yearbook Generator API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred with the AI service",
      },
      { status: 500 }
    );
  }
}