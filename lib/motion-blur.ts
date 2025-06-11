// Motion blur templates
export const MOTION_BLUR_TEMPLATES = [
  {
    id: "horizontal",
    name: "Horizontal",
    direction: 0, // degrees
    intensity: 20,
    thumbnail: "/templates/horizontal-blur.jpg"
  },
  {
    id: "vertical",
    name: "Vertical",
    direction: 90, // degrees
    intensity: 20,
    thumbnail: "/templates/vertical-blur.jpg"
  },
  {
    id: "diagonal-right",
    name: "Diagonal Right",
    direction: 45, // degrees
    intensity: 20,
    thumbnail: "/templates/diagonal-right-blur.jpg"
  },
  {
    id: "diagonal-left",
    name: "Diagonal Left",
    direction: 135, // degrees
    intensity: 20,
    thumbnail: "/templates/diagonal-left-blur.jpg"
  },
  {
    id: "radial",
    name: "Radial",
    direction: "radial", // special case
    intensity: 15,
    thumbnail: "/templates/radial-blur.jpg"
  },
  {
    id: "zoom",
    name: "Zoom",
    direction: "zoom", // special case
    intensity: 15,
    thumbnail: "/templates/zoom-blur.jpg"
  },
  {
    id: "glamour-glow",
    name: "Glamour Glow",
    direction: "glamour-glow", // special case
    intensity: 20,
    thumbnail: "/templates/glamour-glow.jpg"
  },
  {
    id: "vignette-blur",
    name: "Vignette Blur",
    direction: "vignette-blur", // special case
    intensity: 20,
    thumbnail: "/templates/vignette-blur.jpg"
  },
  {
    id: "dreamy-glow",
    name: "Dreamy Glow",
    direction: "dreamy-glow", // special case
    intensity: 25,
    thumbnail: "/templates/dreamy-glow.jpg"
  },
  {
    id: "swirl-blur",
    name: "Swirl Blur",
    direction: "swirl-blur", // special case
    intensity: 15,
    thumbnail: "/templates/swirl-blur.jpg"
  }
];

export type MotionBlurTemplate = typeof MOTION_BLUR_TEMPLATES[0];
export type Direction = number | "radial" | "zoom" | "glamour-glow" | "vignette-blur" | "dreamy-glow" | "swirl-blur";

/**
 * Apply directional motion blur to a canvas context
 */
export const applyDirectionalBlur = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  angle: number,
  intensity: number
): void => {
  // Get image data
  const imageData = ctx.getImageData(0, 0, width, height);

  // Create a copy of the image data
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;

  tempCtx.putImageData(imageData, 0, 0);

  // Clear the original canvas
  ctx.clearRect(0, 0, width, height);

  // Calculate the x and y components of the blur direction
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);

  // Apply the motion blur by drawing the image multiple times with slight offsets
  ctx.globalAlpha = 1 / intensity;

  for (let i = 0; i < intensity; i++) {
    const offset = i - (intensity / 2);
    ctx.drawImage(
      tempCanvas,
      offset * dx,
      offset * dy,
      width,
      height
    );
  }

  ctx.globalAlpha = 1;
};

/**
 * Apply radial motion blur to a canvas context
 */
export const applyRadialBlur = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number
): void => {
  // Get image data
  const imageData = ctx.getImageData(0, 0, width, height);

  // Create a copy of the image data
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;

  tempCtx.putImageData(imageData, 0, 0);

  // Clear the original canvas
  ctx.clearRect(0, 0, width, height);

  // Center point
  const centerX = width / 2;
  const centerY = height / 2;

  // Apply the radial blur
  ctx.globalAlpha = 1 / intensity;

  for (let i = 0; i < intensity; i++) {
    const scale = 1 + (i - intensity / 2) * 0.004;

    ctx.setTransform(
      scale, 0,
      0, scale,
      centerX - centerX * scale,
      centerY - centerY * scale
    );

    ctx.drawImage(tempCanvas, 0, 0);
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
};

/**
 * Apply zoom motion blur to a canvas context
 */
export const applyZoomBlur = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number
): void => {
  // Get image data
  const imageData = ctx.getImageData(0, 0, width, height);

  // Create a copy of the image data
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;

  tempCtx.putImageData(imageData, 0, 0);

  // Clear the original canvas
  ctx.clearRect(0, 0, width, height);

  // Center point
  const centerX = width / 2;
  const centerY = height / 2;

  // Apply the zoom blur
  ctx.globalAlpha = 1 / intensity;

  for (let i = 0; i < intensity; i++) {
    const scale = 1 + (i - intensity / 2) * 0.01;

    ctx.setTransform(
      scale, 0,
      0, scale,
      centerX - centerX * scale,
      centerY - centerY * scale
    );

    ctx.drawImage(tempCanvas, 0, 0);
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
};

/**
 * Apply glamour glow effect to a canvas context
 * Creates a dreamy, ethereal look with red/orange overlay and horizontal streaking
 */
export const applyGlamourGlow = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number
): void => {
  // Get image data
  const imageData = ctx.getImageData(0, 0, width, height);

  // Create a copy of the image data
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;

  tempCtx.putImageData(imageData, 0, 0);

  // Create another canvas for the color overlay
  const overlayCanvas = document.createElement('canvas');
  overlayCanvas.width = width;
  overlayCanvas.height = height;
  const overlayCtx = overlayCanvas.getContext('2d');
  if (!overlayCtx) return;

  // Draw the original image to the overlay canvas
  overlayCtx.drawImage(tempCanvas, 0, 0);

  // Apply a red/orange color overlay to the overlay canvas
  overlayCtx.fillStyle = 'rgba(255, 50, 30, 0.4)';
  overlayCtx.globalCompositeOperation = 'overlay';
  overlayCtx.fillRect(0, 0, width, height);

  // Reset composite operation
  overlayCtx.globalCompositeOperation = 'source-over';

  // Clear the original canvas
  ctx.clearRect(0, 0, width, height);

  // Draw the colored overlay as the base
  ctx.drawImage(overlayCanvas, 0, 0);

  // Apply horizontal streaking with varying opacity
  ctx.globalCompositeOperation = 'screen';

  // Create multiple streaks with different offsets and opacities
  const streakCount = intensity * 1.5;

  for (let i = 0; i < streakCount; i++) {
    // Calculate offset and opacity
    const offset = (i - (streakCount / 2)) * 2.2;

    // Create a pattern of varying opacities for more interesting streaks
    const opacityPattern = Math.sin((i / streakCount) * Math.PI) * 0.5 + 0.3;
    ctx.globalAlpha = opacityPattern / (streakCount * 0.4);

    // Draw with offset
    ctx.drawImage(
      tempCanvas,
      offset, // Horizontal offset
      0,      // No vertical offset
      width,
      height
    );
  }

  // Add a subtle bloom effect
  ctx.globalAlpha = 0.3;
  ctx.filter = 'blur(4px)';
  ctx.drawImage(overlayCanvas, 0, 0);

  // Reset
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
  ctx.filter = 'none';
};

/**
 * Apply vignette blur effect to a canvas context
 * Creates a blur that's stronger at the edges and fades toward the center
 */
export const applyVignetteBlur = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number
): void => {
  // Get image data
  const imageData = ctx.getImageData(0, 0, width, height);

  // Create a copy of the image data
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;

  tempCtx.putImageData(imageData, 0, 0);

  // Create another canvas for the blurred version
  const blurCanvas = document.createElement('canvas');
  blurCanvas.width = width;
  blurCanvas.height = height;
  const blurCtx = blurCanvas.getContext('2d');
  if (!blurCtx) return;

  // Draw the original image to the blur canvas
  blurCtx.drawImage(tempCanvas, 0, 0);

  // Apply a strong blur to the entire image
  blurCtx.filter = `blur(${intensity / 2}px)`;
  blurCtx.globalAlpha = 0.9;
  blurCtx.drawImage(tempCanvas, 0, 0);
  blurCtx.filter = 'none';
  blurCtx.globalAlpha = 1;

  // Clear the original canvas
  ctx.clearRect(0, 0, width, height);

  // Draw the original image
  ctx.drawImage(tempCanvas, 0, 0);

  // Create a radial gradient for the vignette mask
  const gradient = ctx.createRadialGradient(
    width / 2, height / 2, Math.min(width, height) * 0.2, // Inner circle
    width / 2, height / 2, Math.max(width, height) * 0.7  // Outer circle
  );
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');     // Transparent in center
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.85)');  // Dark at edges

  // Apply the blurred version with the gradient mask
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.globalCompositeOperation = 'source-atop';
  ctx.drawImage(blurCanvas, 0, 0);

  // Reset
  ctx.globalCompositeOperation = 'source-over';
};

/**
 * Apply dreamy glow effect to a canvas context
 * Creates a soft, ethereal glow effect with a cool blue tint
 */
export const applyDreamyGlow = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number
): void => {
  // Get image data
  const imageData = ctx.getImageData(0, 0, width, height);

  // Create a copy of the image data
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;

  tempCtx.putImageData(imageData, 0, 0);

  // Create another canvas for the glow effect
  const glowCanvas = document.createElement('canvas');
  glowCanvas.width = width;
  glowCanvas.height = height;
  const glowCtx = glowCanvas.getContext('2d');
  if (!glowCtx) return;

  // Draw the original image to the glow canvas
  glowCtx.drawImage(tempCanvas, 0, 0);

  // Apply a blue tint to the glow canvas
  glowCtx.fillStyle = 'rgba(100, 150, 255, 0.3)';
  glowCtx.globalCompositeOperation = 'overlay';
  glowCtx.fillRect(0, 0, width, height);

  // Reset composite operation
  glowCtx.globalCompositeOperation = 'source-over';

  // Apply a strong blur to create the glow
  glowCtx.filter = `blur(${intensity / 2}px)`;
  glowCtx.globalAlpha = 0.7;
  glowCtx.drawImage(glowCanvas, 0, 0);
  glowCtx.filter = 'none';
  glowCtx.globalAlpha = 1;

  // Clear the original canvas
  ctx.clearRect(0, 0, width, height);

  // Draw the original image first
  ctx.drawImage(tempCanvas, 0, 0);

  // Overlay the glow effect
  ctx.globalCompositeOperation = 'screen';
  ctx.drawImage(glowCanvas, 0, 0);

  // Add a subtle bloom effect
  ctx.globalAlpha = 0.4;
  ctx.filter = 'blur(3px) brightness(1.1)';
  ctx.drawImage(glowCanvas, 0, 0);

  // Reset
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
  ctx.filter = 'none';

  // Add a subtle vignette
  const gradient = ctx.createRadialGradient(
    width / 2, height / 2, Math.min(width, height) * 0.5,
    width / 2, height / 2, Math.max(width, height) * 0.8
  );
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');

  ctx.fillStyle = gradient;
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillRect(0, 0, width, height);

  // Reset
  ctx.globalCompositeOperation = 'source-over';
};

/**
 * Apply swirl blur effect to a canvas context
 * Creates a blur that swirls around the center
 */
export const applySwirlBlur = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number
): void => {
  // Get image data
  const imageData = ctx.getImageData(0, 0, width, height);

  // Create a copy of the image data
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;

  tempCtx.putImageData(imageData, 0, 0);

  // Clear the original canvas
  ctx.clearRect(0, 0, width, height);

  // Center point
  const centerX = width / 2;
  const centerY = height / 2;

  // Apply the swirl blur
  ctx.globalAlpha = 1 / intensity;

  // Calculate max radius for swirl effect
  const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);

  for (let i = 0; i < intensity; i++) {
    // Calculate rotation angle based on intensity
    const angle = (i / intensity) * Math.PI * 2;

    // Save the current transformation state
    ctx.save();

    // Translate to center
    ctx.translate(centerX, centerY);

    // Rotate based on the current iteration
    ctx.rotate(angle * 0.2);

    // Scale slightly for added effect
    const scale = 1 + (i - intensity / 2) * 0.003;
    ctx.scale(scale, scale);

    // Translate back
    ctx.translate(-centerX, -centerY);

    // Draw the image with the current transformation
    ctx.drawImage(tempCanvas, 0, 0);

    // Restore the transformation state
    ctx.restore();
  }

  ctx.globalAlpha = 1;
};

// Cache for processed images
const processedImageCache = new Map<string, string>();

/**
 * Generate a cache key for the image processing parameters
 */
const generateCacheKey = (
  image: string,
  templateId: string,
  intensity: number,
  direction: Direction
): string => {
  return `${image.substring(0, 50)}_${templateId}_${intensity}_${direction}`;
};

/**
 * Process an image with motion blur effect with caching
 */
export const processImageWithMotionBlur = (
  image: string,
  canvas: HTMLCanvasElement,
  selectedTemplate: MotionBlurTemplate,
  intensity: number,
  direction: Direction,
  callback: (processedImage: string) => void
): void => {
  // Generate cache key
  const cacheKey = generateCacheKey(image, selectedTemplate.id, intensity, direction);

  // Check if we have a cached version
  if (processedImageCache.has(cacheKey)) {
    // Use cached version
    setTimeout(() => {
      callback(processedImageCache.get(cacheKey)!);
    }, 0);
    return;
  }

  // Create image object
  const img = new Image();

  // Set image loading priority to high
  img.loading = 'eager';
  img.decoding = 'sync';

  img.onload = () => {
    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    if (!ctx) return;

    // Optimize canvas size for performance
    const maxDimension = 1200; // Limit for faster processing
    let width = img.width;
    let height = img.height;

    if (width > height && width > maxDimension) {
      height = Math.round((height * maxDimension) / width);
      width = maxDimension;
    } else if (height > maxDimension) {
      width = Math.round((width * maxDimension) / height);
      height = maxDimension;
    }

    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw original image with optimized rendering
    ctx.imageSmoothingQuality = 'medium';
    ctx.drawImage(img, 0, 0, width, height);

    // Apply motion blur based on template type
    if (selectedTemplate.direction === "radial") {
      applyRadialBlur(ctx, width, height, intensity);
    } else if (selectedTemplate.direction === "zoom") {
      applyZoomBlur(ctx, width, height, intensity);
    } else if (selectedTemplate.direction === "glamour-glow") {
      applyGlamourGlow(ctx, width, height, intensity);
    } else if (selectedTemplate.direction === "vignette-blur") {
      applyVignetteBlur(ctx, width, height, intensity);
    } else if (selectedTemplate.direction === "dreamy-glow") {
      applyDreamyGlow(ctx, width, height, intensity);
    } else if (selectedTemplate.direction === "swirl-blur") {
      applySwirlBlur(ctx, width, height, intensity);
    } else if (typeof direction === 'number') {
      // Convert direction from degrees to radians
      const angleRad = direction * Math.PI / 180;
      applyDirectionalBlur(ctx, width, height, angleRad, intensity);
    }

    // Get the processed image
    const processedImage = canvas.toDataURL('image/jpeg', 0.9);

    // Cache the result
    processedImageCache.set(cacheKey, processedImage);

    // Limit cache size to prevent memory issues
    if (processedImageCache.size > 50) {
      const firstKey = processedImageCache.keys().next().value;
      processedImageCache.delete(firstKey);
    }

    callback(processedImage);
  };

  // Handle errors
  img.onerror = () => {
    console.error('Error loading image');
    callback('');
  };

  img.src = image;
};

/**
 * Download the processed image
 */
export const downloadProcessedImage = (processedImage: string): void => {
  if (!processedImage) return;

  const link = document.createElement('a');
  link.download = 'motion-blur-image.jpg';
  link.href = processedImage;
  link.click();
};
