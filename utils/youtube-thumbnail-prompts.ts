// YouTube Thumbnail Prompt Utilities

export interface ThumbnailPromptOptions {
  title: string;
  keywords?: string;
  useStyleGuide?: boolean;
  styleSimilarity?: number;
  contentType?: 'tutorial' | 'entertainment' | 'review' | 'tech' | 'gaming' | 'education' | 'vlog' | 'other';
  primaryColors?: string[];
  thumbnailStyle?: string;
  additionalRequirements?: string;
}

/**
 * Creates an optimized prompt for generating high-quality YouTube thumbnails
 * @param options - Configuration options for the thumbnail prompt
 * @returns A detailed prompt for the AI to generate a professional YouTube thumbnail
 */
export const createOptimizedThumbnailPrompt = (options: ThumbnailPromptOptions): string => {
  const {
    title,
    keywords = '',
    useStyleGuide = false,
    styleSimilarity = 50,
    contentType = 'other',
    primaryColors = [],
    thumbnailStyle = '',
    additionalRequirements = ''
  } = options;

  // Base prompt with essential requirements
  let prompt = `Create a professional YouTube thumbnail for a video titled: "${title}".
  
Essential requirements:
1. Size: 1280x720 pixels (YouTube recommended)
2. Text: Include large, bold, readable text with maximum 3-5 words
3. Visuals: High contrast, vibrant colors, clear focal point
4. Composition: Rule of thirds, visual hierarchy, minimal clutter
5. Style: Bold, attention-grabbing, professional`;

  // Add content type specific guidance
  switch (contentType) {
    case 'tutorial':
      prompt += `\n\nContent type: Tutorial/How-to video
Focus on showing the end result or key concept being taught.
Use clear, instructional visuals with minimal text.`;
      break;
    case 'entertainment':
      prompt += `\n\nContent type: Entertainment video
Focus on creating an emotional hook with expressive faces or dramatic scenes.
Use vibrant colors and dynamic compositions.`;
      break;
    case 'review':
      prompt += `\n\nContent type: Review video
Include visual elements that represent the product or topic being reviewed.
Use contrasting colors to highlight positive or negative aspects.`;
      break;
    case 'tech':
      prompt += `\n\nContent type: Technology video
Use clean, modern design elements with tech-inspired visuals.
Focus on showcasing gadgets, interfaces, or futuristic concepts.`;
      break;
    case 'gaming':
      prompt += `\n\nContent type: Gaming video
Include gaming-related visuals like controllers, characters, or game scenes.
Use dynamic, energetic compositions with bold colors.`;
      break;
    case 'education':
      prompt += `\n\nContent type: Educational video
Focus on clarity and information hierarchy.
Use clean layouts with visual representations of concepts.`;
      break;
    case 'vlog':
      prompt += `\n\nContent type: Vlog/Lifestyle video
Focus on personal, relatable imagery.
Use warm, inviting colors and authentic visuals.`;
      break;
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

  // Add keywords if provided
  if (keywords) {
    prompt += `\n\nRelevant keywords to incorporate: ${keywords}`;
  }

  // Add additional requirements
  if (additionalRequirements) {
    prompt += `\n\nAdditional requirements: ${additionalRequirements}`;
  }

  // Add style guide instructions if enabled
  if (useStyleGuide && styleSimilarity > 0) {
    prompt += `\n\nStyle matching: Match the visual style of reference thumbnails with ${styleSimilarity}% similarity. 
Focus on color schemes, typography, composition, and overall aesthetic.
Maintain the brand identity while ensuring the thumbnail stands out.`;
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

IMPORTANT: Do NOT add any text about R language or 'Master R language' in the thumbnail unless specifically requested.

The thumbnail should grab attention within 0.5 seconds and clearly communicate the video's value proposition.`;

  return prompt;
};

/**
 * Creates a prompt for generating multiple thumbnail variations
 * @param options - Configuration options for the thumbnail prompt
 * @param count - Number of variations to generate (default: 3)
 * @returns A prompt for generating multiple thumbnail concepts
 */
export const createThumbnailVariationsPrompt = (
  options: ThumbnailPromptOptions, 
  count: number = 3
): string => {
  const basePrompt = createOptimizedThumbnailPrompt(options);
  
  return `${basePrompt}
  
Create ${count} distinct visual concepts for this thumbnail, each with a different approach:
1. Different color schemes
2. Different compositions
3. Different text treatments
4. Different visual focal points

Each concept should be unique while maintaining the core message and requirements.`;
};