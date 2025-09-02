import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Simple logging to see if this function is being called
    console.log("API route called");
    
    const formData = await request.formData();
    const prompt = formData.get('prompt') as string;
    const imageFile = formData.get('image') as File | null;
    const useStyleGuide = formData.get('use_style_guide') === 'true';
    const styleSimilarity = formData.get('style_similarity') ? parseInt(formData.get('style_similarity') as string) : 50;
    
    // Collect reference images if any
    const referenceImages: File[] = [];
    for (let i = 0; i < 5; i++) { // Assume max 5 reference images
      const refImg = formData.get(`reference_image_${i}`) as File | null;
      if (refImg) {
        referenceImages.push(refImg);
      } else {
        break;
      }
    }
    
    console.log(`Found ${referenceImages.length} reference images, useStyleGuide: ${useStyleGuide}, similarity: ${styleSimilarity}%`);

    if (!prompt) {
      return NextResponse.json({ 
        success: false, 
        error: "Prompt is required" 
      }, { status: 400 });
    }

    // Check if API key is available
    if (!process.env.OPENROUTER_API_KEY) {
      console.error("OPENROUTER_API_KEY is not set");
      return NextResponse.json({
        success: false,
        error: "API configuration error - missing API key",
      }, { status: 500 });
    }

    // Extract content type information from the prompt if available (for debugging purposes)
    // This is kept for future use but commented out as it's currently not being used
    /*
    let contentType = "general";
    if (prompt.toLowerCase().includes("tutorial") || prompt.toLowerCase().includes("how to")) {
      contentType = "tutorial";
    } else if (prompt.toLowerCase().includes("review") || prompt.toLowerCase().includes("unboxing")) {
      contentType = "review";
    } else if (prompt.toLowerCase().includes("gaming") || prompt.toLowerCase().includes("game")) {
      contentType = "gaming";
    } else if (prompt.toLowerCase().includes("tech") || prompt.toLowerCase().includes("technology")) {
      contentType = "tech";
    }
    */

    // Prepare the messages array
    interface MessageContent {
      type: string;
      text?: string;
      image_url?: {
        url: string;
      };
    }
    
    interface Message {
      role: string;
      content: MessageContent[];
    }
    
    const messages: Message[] = [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: imageFile 
              ? `${prompt} Please generate an image based on this reference image.${useStyleGuide && referenceImages.length > 0 ? ` Also match the style of the reference thumbnail${referenceImages.length > 1 ? 's' : ''} with ${styleSimilarity}% similarity.` : ''} Do not add any text about R language or Master R language unless specifically requested.` 
              : `${prompt} Please generate a high-quality image that illustrates this concept.${useStyleGuide && referenceImages.length > 0 ? ` Match the style of the reference thumbnail${referenceImages.length > 1 ? 's' : ''} with ${styleSimilarity}% similarity.` : ''} Do not add any text about R language or Master R language unless specifically requested.`
          }
        ]
      }
    ];

    // Add image to the content if provided
    if (imageFile) {
      // Convert image to base64
      const arrayBuffer = await imageFile.arrayBuffer();
      const base64Image = Buffer.from(arrayBuffer).toString('base64');
      const imageDataUrl = `data:${imageFile.type};base64,${base64Image}`;
      
      messages[0].content.push({
        type: "image_url",
        image_url: {
          url: imageDataUrl
        }
      });
    }
    
    // Add reference images if style guide is enabled
    if (useStyleGuide && referenceImages.length > 0) {
      for (const refImg of referenceImages) {
        try {
          // Convert reference image to base64
          const refArrayBuffer = await refImg.arrayBuffer();
          const refBase64 = Buffer.from(refArrayBuffer).toString('base64');
          const refImageDataUrl = `data:${refImg.type};base64,${refBase64}`;
          
          messages[0].content.push({
            type: "image_url",
            image_url: {
              url: refImageDataUrl
            }
          });
          
          console.log(`Added reference image: ${refImg.name}`);
        } catch (error) {
          console.error(`Error processing reference image ${refImg.name}:`, error);
        }
      }
    }

    // Request body for OpenRouter API
    const requestBody = {
      model: "google/gemini-2.5-flash-image-preview:free",
      messages: messages,
      // Parameters optimized for high-quality image generation
      max_tokens: 1024,
      temperature: 0.7,
      stream: false,
      n: 1,
      top_p: 0.9,
      frequency_penalty: 0.5,          // Slightly penalize repetition for more creative results
      presence_penalty: 0.5,           // Encourage new topics/concepts
      stop: null,
      response_model_image_format: "base64",
      image_detail: "high",
      image_format: "png"
    };

    // Log a simplified version of the request (omitting full image data)
    console.log("OpenRouter API request model:", requestBody.model);
    console.log("OpenRouter API request prompt:", prompt);
    console.log("OpenRouter API request includes image:", !!imageFile);

    // Call OpenRouter API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.OPENROUTER_SITE_URL || "", 
        "X-Title": process.env.OPENROUTER_SITE_NAME || "", 
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    // Get the raw response data
    const responseData = await response.json();
    
    if (!response.ok) {
      console.error("OpenRouter API error status:", response.status);
      console.error("OpenRouter API error details:", JSON.stringify({
        error: responseData.error,
        message: responseData.message || responseData.error?.message
      }, null, 2));
      
      return NextResponse.json({
        success: false,
        error: responseData.error?.message || `Failed to generate content: ${response.status} ${response.statusText}`,
      }, { status: response.status });
    }

    // Log a simplified version of the response
    console.log("OpenRouter API response status:", response.status);
    console.log("OpenRouter API response structure:", {
      choices: responseData.choices ? responseData.choices.length : 0,
      usage: responseData.usage,
      model: responseData.model
    });
    
    // Log the most important parts of the response
    if (responseData.choices && responseData.choices.length > 0) {
      const firstChoice = responseData.choices[0];
      console.log("Response choice role:", firstChoice.message?.role);
      
      // Log content structure without the full content
      if (firstChoice.message?.content) {
        if (typeof firstChoice.message.content === 'string') {
          console.log("Response content type: string");
          console.log("Response content preview:", firstChoice.message.content.substring(0, 100) + '...');
        } else if (Array.isArray(firstChoice.message.content)) {
          console.log("Response content type: array with", firstChoice.message.content.length, "items");
          console.log("Response content structure:", firstChoice.message.content.map(item => ({
            type: item.type,
            hasText: !!item.text,
            hasImageUrl: !!item.image_url
          })));
        } else {
          console.log("Response content type: object");
          console.log("Response content keys:", Object.keys(firstChoice.message.content));
        }
      }
      
      // Log if there are any image tokens in the response
      if (responseData.usage?.completion_tokens_details?.image_tokens) {
        console.log("Image tokens in response:", responseData.usage.completion_tokens_details.image_tokens);
      }
    }

    // Process the response to extract text and images
    let textResponse = "";
    let imageData = null;
    
    // Check if there's any image data in the response
    try {
      // Get the message content
      const responseContent = responseData.choices[0]?.message?.content;
      
      // Log more details about the response content
      console.log("Response content type:", typeof responseContent);
      
      // Check if it's a string (just text) or potentially contains image data
      if (typeof responseContent === 'string') {
        textResponse = responseContent;
        
        // Check if the response includes base64 image data within the text
        const base64Match = responseContent.match(/data:image\/[^;]+;base64,([^"'\s]+)/);
        if (base64Match && base64Match[1]) {
          imageData = base64Match[1];
          console.log("Found base64 image data embedded in text response");
        }
      } else if (Array.isArray(responseContent)) {
        // Process content parts if it's an array
        console.log("Processing array content with", responseContent.length, "items");
        
        for (const part of responseContent) {
          console.log("Content part type:", part.type);
          
          if (part.type === 'text') {
            textResponse += part.text || '';
          } else if (part.type === 'image_url') {
            imageData = part.image_url?.url;
            console.log("Found image URL in response part");
          } else if (part.type === 'image') {
            imageData = part.url || part.data;
            console.log("Found direct image data in response part");
          }
        }
      } else if (responseContent && typeof responseContent === 'object') {
        // Check for possible image data in the content object
        console.log("Processing object content with keys:", Object.keys(responseContent));
        
        if (responseContent.parts) {
          for (const part of responseContent.parts) {
            if (part.text) {
              textResponse += part.text;
            } else if (part.inlineData) {
              imageData = part.inlineData.data;
              console.log("Found inline image data in response part");
            }
          }
        }
      }
      
      // Look for image data in specific places in the OpenRouter response
      if (!imageData) {
        // Check if there are image_url fields in the message
        if (responseData.choices?.[0]?.message?.image_url) {
          imageData = responseData.choices[0].message.image_url;
          console.log("Found image_url in message");
        }
        
        // Check if there are content_parts (sometimes used by OpenRouter)
        if (!imageData && responseData.choices?.[0]?.message?.content_parts) {
          const contentParts = responseData.choices[0].message.content_parts;
          for (const part of contentParts) {
            if (part.type === 'image' || part.type === 'image_url') {
              imageData = part.image?.url || part.image_url?.url || part.url || part.data;
              console.log("Found image in content_parts");
              break;
            }
          }
        }
        
        // Check if there's a function call result with image data
        if (!imageData && responseData.choices?.[0]?.message?.function_call) {
          try {
            const functionArgs = JSON.parse(responseData.choices[0].message.function_call.arguments);
            if (functionArgs.image || functionArgs.images) {
              imageData = functionArgs.image || (functionArgs.images && functionArgs.images[0]);
              console.log("Found image in function call arguments");
            }
          } catch (error) {
            console.log("Error parsing function call arguments:", error instanceof Error ? error.message : String(error));
          }
        }
        
        // Check for special gemini_image field that some providers use
        if (!imageData && responseData.gemini_image) {
          imageData = responseData.gemini_image;
          console.log("Found image in gemini_image field");
        }
        
        // Look for any base64 image patterns in the full response
        if (!imageData && responseData.usage?.completion_tokens_details?.image_tokens > 0) {
          // Convert response to string to search for base64 patterns
          const responseStr = JSON.stringify(responseData);
          const base64Match = responseStr.match(/"data:image\/[^;]+;base64,([^"]+)"/);
          if (base64Match && base64Match[1]) {
            imageData = base64Match[1];
            console.log("Found base64 image data in stringified response");
          }
        }
      }
      
      // If no image data found but we have image tokens, log the structure
      if (!imageData && responseData.usage?.completion_tokens_details?.image_tokens > 0) {
        console.log("Image tokens present but couldn't extract image data");
        console.log("Response structure:", JSON.stringify(Object.keys(responseData), null, 2));
        
        if (responseData.choices && responseData.choices.length > 0) {
          console.log("First choice structure:", JSON.stringify(Object.keys(responseData.choices[0]), null, 2));
          if (responseData.choices[0].message) {
            console.log("Message structure:", JSON.stringify(Object.keys(responseData.choices[0].message), null, 2));
          }
        }
      }
    } catch (error) {
      console.error("Error extracting content from response:", error);
    }

    // Prepare a clean response to return
    const cleanResponse = {
      success: true,
      text: textResponse || "Generated content",
      image: imageData,
      modelUsed: responseData.model,
      tokensUsed: responseData.usage?.total_tokens,
      imageGenerated: !!imageData
    };
    
    console.log("Returning response to client:", {
      success: cleanResponse.success,
      hasText: !!cleanResponse.text,
      hasImage: !!cleanResponse.image,
      modelUsed: cleanResponse.modelUsed
    });

    return NextResponse.json(cleanResponse);
  } catch (error: unknown) {
    console.error("OpenRouter API error:", error instanceof Error ? error.message : String(error));
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred with the AI service",
    }, { status: 500 });
  }
}

// This helper function is commented out as it's no longer used, but kept for reference
/*
function enhancePromptForThumbnails(prompt: string, contentType: string): string {
  // Add specific instructions for YouTube thumbnails
  const thumbnailInstructions = `
Create a professional YouTube thumbnail with these specifications:
- Size: 1280x720 pixels
- Text: Large, bold, readable (max 3-5 words)
- Colors: High contrast, vibrant
- Composition: Clear focal point, rule of thirds
- Style: Bold, attention-grabbing`;

  // Add content-type specific guidance
  let contentTypeGuidance = "";
  switch (contentType) {
    case "tutorial":
      contentTypeGuidance = "\nFocus on showing the end result or key concept being taught. Use clear, instructional visuals.";
      break;
    case "review":
      contentTypeGuidance = "\nInclude visual elements that represent the product or topic being reviewed. Highlight positive aspects.";
      break;
    case "gaming":
      contentTypeGuidance = "\nUse gaming-related visuals like controllers, characters, or game scenes. Dynamic, energetic composition.";
      break;
    case "tech":
      contentTypeGuidance = "\nClean, modern design with tech-inspired visuals. Showcase gadgets or interfaces.";
      break;
    default:
      contentTypeGuidance = "\nCreate an engaging, professional design that communicates the video's value.";
  }

  // Add final enhancement instructions
  const enhancementInstructions = `
Design this thumbnail to achieve maximum click-through rates:
- Use contrasting colors that stand out in YouTube's dark interface
- Include expressive faces or clear subject matter when relevant
- Create visual hierarchy with text and imagery
- Ensure readability at small sizes
- Use bold, sans-serif fonts for maximum impact`;

  return `${prompt}\n\n${thumbnailInstructions}${contentTypeGuidance}\n${enhancementInstructions}`;
}
*/