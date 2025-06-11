// Optical effects templates
export const OPTICAL_EFFECTS_TEMPLATES = [
  {
    id: "chromatic-aberration",
    name: "Chromatic Aberration",
    type: "chromatic",
    intensity: 5,
    colorShift: 5,
    thumbnail: "/templates/chromatic-aberration.jpg"
  },
  {
    id: "duotone",
    name: "Duotone",
    type: "duotone",
    intensity: 100,
    primaryColor: "#ff00ff", // Magenta
    secondaryColor: "#00ffff", // Cyan
    thumbnail: "/templates/duotone.jpg"
  },
  {
    id: "glitch",
    name: "Glitch",
    type: "glitch",
    intensity: 10,
    glitchOffset: 5,
    thumbnail: "/templates/glitch.jpg"
  },
  {
    id: "rgb-split",
    name: "RGB Split",
    type: "rgb-split",
    intensity: 5,
    redOffset: { x: 5, y: 0 },
    greenOffset: { x: 0, y: 0 },
    blueOffset: { x: -5, y: 0 },
    thumbnail: "/templates/rgb-split.jpg"
  },
  {
    id: "vignette",
    name: "Vignette",
    type: "vignette",
    intensity: 50,
    radius: 0.75,
    thumbnail: "/templates/vignette.jpg"
  },
  {
    id: "pixelate",
    name: "Pixelate",
    type: "pixelate",
    intensity: 8, // pixel size
    thumbnail: "/templates/pixelate.jpg"
  }
];

export type OpticalEffectTemplate = typeof OPTICAL_EFFECTS_TEMPLATES[0];
export type EffectType = "chromatic" | "duotone" | "glitch" | "rgb-split" | "vignette" | "pixelate";
export type Offset = { x: number; y: number };

/**
 * Apply chromatic aberration effect to a canvas context
 */
export const applyChromaticAberration = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number
): void => {
  // Get image data
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const offset = intensity;

  // Create a copy of the image data
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;

  tempCtx.putImageData(imageData, 0, 0);
  const tempImageData = tempCtx.getImageData(0, 0, width, height);
  const tempData = tempImageData.data;

  // Apply chromatic aberration by offsetting red and blue channels
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      
      // Red channel - shift right
      const rX = Math.min(x + offset, width - 1);
      const rIdx = (y * width + rX) * 4;
      data[idx] = tempData[rIdx];
      
      // Blue channel - shift left
      const bX = Math.max(x - offset, 0);
      const bIdx = (y * width + bX) * 4;
      data[idx + 2] = tempData[bIdx + 2];
    }
  }

  ctx.putImageData(imageData, 0, 0);
};

/**
 * Apply duotone effect to a canvas context
 */
export const applyDuotone = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number,
  primaryColor: string,
  secondaryColor: string
): void => {
  // Get image data
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Parse colors
  const primary = hexToRgb(primaryColor);
  const secondary = hexToRgb(secondaryColor);
  
  if (!primary || !secondary) return;

  // Apply duotone effect
  for (let i = 0; i < data.length; i += 4) {
    // Convert to grayscale first
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    const normalizedGray = gray / 255;
    
    // Mix between primary and secondary colors based on grayscale value
    data[i] = Math.round(lerp(secondary.r, primary.r, normalizedGray) * (intensity / 100) + data[i] * (1 - intensity / 100));
    data[i + 1] = Math.round(lerp(secondary.g, primary.g, normalizedGray) * (intensity / 100) + data[i + 1] * (1 - intensity / 100));
    data[i + 2] = Math.round(lerp(secondary.b, primary.b, normalizedGray) * (intensity / 100) + data[i + 2] * (1 - intensity / 100));
  }

  ctx.putImageData(imageData, 0, 0);
};

/**
 * Apply glitch effect to a canvas context
 */
export const applyGlitch = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number,
  glitchOffset: number
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
  
  // Draw the original image
  ctx.drawImage(tempCanvas, 0, 0);
  
  // Apply glitch effect by creating random slices
  const numSlices = Math.floor(intensity);
  
  for (let i = 0; i < numSlices; i++) {
    // Random slice height
    const sliceHeight = Math.floor(Math.random() * (height / 10)) + 5;
    // Random y position for the slice
    const y = Math.floor(Math.random() * (height - sliceHeight));
    // Random x offset for the slice
    const offset = Math.floor(Math.random() * glitchOffset * 2) - glitchOffset;
    
    // Draw the slice with offset
    ctx.drawImage(
      tempCanvas,
      0, y, width, sliceHeight,
      offset, y, width, sliceHeight
    );
    
    // Random color channel shift for some slices
    if (Math.random() > 0.5) {
      const channelData = tempCtx.getImageData(0, y, width, sliceHeight);
      const data = channelData.data;
      
      // Shift color channels
      for (let j = 0; j < data.length; j += 4) {
        // Randomly shift red or blue channel
        if (Math.random() > 0.5) {
          const temp = data[j]; // red
          data[j] = data[j + 2]; // blue
          data[j + 2] = temp;
        }
      }
      
      tempCtx.putImageData(channelData, 0, y);
      ctx.drawImage(
        tempCanvas,
        0, y, width, sliceHeight,
        -offset, y, width, sliceHeight
      );
    }
  }
};

/**
 * Apply RGB split effect to a canvas context
 */
export const applyRGBSplit = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number,
  redOffset: Offset,
  greenOffset: Offset,
  blueOffset: Offset
): void => {
  // Scale offsets by intensity
  const rOffset = { x: redOffset.x * intensity / 5, y: redOffset.y * intensity / 5 };
  const gOffset = { x: greenOffset.x * intensity / 5, y: greenOffset.y * intensity / 5 };
  const bOffset = { x: blueOffset.x * intensity / 5, y: blueOffset.y * intensity / 5 };

  // Get image data
  const imageData = ctx.getImageData(0, 0, width, height);
  
  // Create a copy of the image data
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;

  tempCtx.putImageData(imageData, 0, 0);
  const tempImageData = tempCtx.getImageData(0, 0, width, height);
  const tempData = tempImageData.data;
  
  // Create a new image data for the result
  const resultImageData = ctx.createImageData(width, height);
  const resultData = resultImageData.data;
  
  // Set all alpha values to 255 (fully opaque)
  for (let i = 3; i < resultData.length; i += 4) {
    resultData[i] = 255;
  }
  
  // Apply RGB split
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      
      // Calculate positions for each channel with offsets
      const rX = Math.min(Math.max(Math.round(x + rOffset.x), 0), width - 1);
      const rY = Math.min(Math.max(Math.round(y + rOffset.y), 0), height - 1);
      const rIdx = (rY * width + rX) * 4;
      
      const gX = Math.min(Math.max(Math.round(x + gOffset.x), 0), width - 1);
      const gY = Math.min(Math.max(Math.round(y + gOffset.y), 0), height - 1);
      const gIdx = (gY * width + gX) * 4;
      
      const bX = Math.min(Math.max(Math.round(x + bOffset.x), 0), width - 1);
      const bY = Math.min(Math.max(Math.round(y + bOffset.y), 0), height - 1);
      const bIdx = (bY * width + bX) * 4;
      
      // Set RGB values from their respective offset positions
      resultData[idx] = tempData[rIdx];     // Red
      resultData[idx + 1] = tempData[gIdx + 1]; // Green
      resultData[idx + 2] = tempData[bIdx + 2]; // Blue
    }
  }
  
  ctx.putImageData(resultImageData, 0, 0);
};

/**
 * Apply vignette effect to a canvas context
 */
export const applyVignette = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number,
  radius: number
): void => {
  // Get image data
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  // Center of the image
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Maximum distance from center to corner
  const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);
  const adjustedRadius = radius * maxDist;
  
  // Apply vignette effect
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      
      // Calculate distance from center
      const dx = x - centerX;
      const dy = y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Calculate vignette factor
      let factor = 1;
      if (dist > adjustedRadius) {
        factor = 1 - Math.min(1, (dist - adjustedRadius) / (maxDist - adjustedRadius)) * (intensity / 100);
      }
      
      // Apply factor to RGB values
      data[idx] = Math.round(data[idx] * factor);
      data[idx + 1] = Math.round(data[idx + 1] * factor);
      data[idx + 2] = Math.round(data[idx + 2] * factor);
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

/**
 * Apply pixelate effect to a canvas context
 */
export const applyPixelate = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number
): void => {
  // Pixel size based on intensity
  const pixelSize = Math.max(2, Math.floor(intensity));
  
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
  
  // Apply pixelate effect
  for (let y = 0; y < height; y += pixelSize) {
    for (let x = 0; x < width; x += pixelSize) {
      // Get the color of the first pixel in the block
      const pixelData = tempCtx.getImageData(x, y, 1, 1).data;
      
      // Fill a rectangle with that color
      ctx.fillStyle = `rgba(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]}, ${pixelData[3] / 255})`;
      ctx.fillRect(x, y, pixelSize, pixelSize);
    }
  }
};

/**
 * Process an image with optical effect
 */
export const processImageWithOpticalEffect = (
  image: string,
  canvas: HTMLCanvasElement,
  selectedTemplate: OpticalEffectTemplate,
  intensity: number,
  callback: (processedImage: string) => void
): void => {
  const img = new Image();
  img.onload = () => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to match image
    canvas.width = img.width;
    canvas.height = img.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw original image
    ctx.drawImage(img, 0, 0);

    // Apply optical effect based on template type
    switch (selectedTemplate.type) {
      case 'chromatic':
        applyChromaticAberration(ctx, canvas.width, canvas.height, intensity);
        break;
      case 'duotone':
        applyDuotone(ctx, canvas.width, canvas.height, intensity, 
          selectedTemplate.primaryColor, selectedTemplate.secondaryColor);
        break;
      case 'glitch':
        applyGlitch(ctx, canvas.width, canvas.height, intensity, 
          selectedTemplate.glitchOffset);
        break;
      case 'rgb-split':
        applyRGBSplit(ctx, canvas.width, canvas.height, intensity,
          selectedTemplate.redOffset, selectedTemplate.greenOffset, selectedTemplate.blueOffset);
        break;
      case 'vignette':
        applyVignette(ctx, canvas.width, canvas.height, intensity, 
          selectedTemplate.radius);
        break;
      case 'pixelate':
        applyPixelate(ctx, canvas.width, canvas.height, intensity);
        break;
    }

    // Get the processed image
    const processedImage = canvas.toDataURL('image/jpeg');
    callback(processedImage);
  };

  img.src = image;
};

/**
 * Download the processed image
 */
export const downloadProcessedImage = (processedImage: string): void => {
  const link = document.createElement('a');
  link.download = `optical-effect-${Date.now()}.jpg`;
  link.href = processedImage;
  link.click();
};

// Helper functions
function hexToRgb(hex: string): { r: number, g: number, b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
