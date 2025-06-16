// Optical effects templates
export const OPTICAL_EFFECTS_TEMPLATES = [
  {
    id: "chromatic-aberration",
    name: "Chromatic Aberration",
    type: "chromatic",
    intensity: 8,
    colorShift: 5,
    thumbnail: "/templates/chromatic-aberration.jpg"
  },
  {
    id: "holographic",
    name: "Holographic",
    type: "holographic",
    intensity: 25,
    rainbowIntensity: 0.3,
    thumbnail: "/templates/holographic.jpg"
  },
  {
    id: "cyberpunk-glitch",
    name: "Cyberpunk Glitch",
    type: "cyberpunk-glitch",
    intensity: 15,
    neonIntensity: 0.8,
    thumbnail: "/templates/cyberpunk-glitch.jpg"
  },
  {
    id: "prism-split",
    name: "Prism Split",
    type: "prism-split",
    intensity: 12,
    prismAngle: 45,
    thumbnail: "/templates/prism-split.jpg"
  },
  {
    id: "neon-glow",
    name: "Neon Glow",
    type: "neon-glow",
    intensity: 30,
    glowColor: "#00ffff",
    thumbnail: "/templates/neon-glow.jpg"
  },
  {
    id: "digital-noise",
    name: "Digital Noise",
    type: "digital-noise",
    intensity: 15,
    noiseType: "rgb",
    thumbnail: "/templates/digital-noise.jpg"
  },

  {
    id: "infrared",
    name: "Infrared Vision",
    type: "infrared",
    intensity: 80,
    heatmap: true,
    thumbnail: "/templates/infrared.jpg"
  },
  {
    id: "lens-flare",
    name: "Lens Flare",
    type: "lens-flare",
    intensity: 25,
    flarePosition: { x: 0.7, y: 0.3 },
    thumbnail: "/templates/lens-flare.jpg"
  }
];

export type OpticalEffectTemplate = typeof OPTICAL_EFFECTS_TEMPLATES[0];
export type EffectType = "chromatic" | "holographic" | "cyberpunk-glitch" | "prism-split" | "neon-glow" | "digital-noise" | "infrared" | "lens-flare";
export type Offset = { x: number; y: number };
export type Position = { x: number; y: number };

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
 * Apply holographic effect to a canvas context
 */
export const applyHolographic = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number,
  rainbowIntensity: number
): void => {
  // Get image data
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Apply holographic rainbow effect
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      
      // Create rainbow effect based on position and intensity
      const angle = (x / width + y / height) * Math.PI * 4;
      const hue = (Math.sin(angle) + 1) * 180; // 0-360 hue range
      
      // Convert HSV to RGB for rainbow effect
      const rgb = hsvToRgb(hue, 0.8, 1);
      
      // Mix with original colors
      const mixFactor = rainbowIntensity * (intensity / 100);
      data[idx] = Math.round(data[idx] * (1 - mixFactor) + rgb.r * mixFactor);
      data[idx + 1] = Math.round(data[idx + 1] * (1 - mixFactor) + rgb.g * mixFactor);
      data[idx + 2] = Math.round(data[idx + 2] * (1 - mixFactor) + rgb.b * mixFactor);
      
      // Add holographic shimmer
      const shimmer = Math.sin(x * 0.1 + y * 0.1) * 0.3 + 0.7;
      data[idx] = Math.min(255, data[idx] * shimmer);
      data[idx + 1] = Math.min(255, data[idx + 1] * shimmer);
      data[idx + 2] = Math.min(255, data[idx + 2] * shimmer);
    }
  }

  ctx.putImageData(imageData, 0, 0);
};

/**
 * Apply cyberpunk glitch effect to a canvas context
 */
export const applyCyberpunkGlitch = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number,
  neonIntensity: number
): void => {
  // Get image data
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
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
  
  // Apply cyberpunk glitch effect
  const numSlices = Math.floor(intensity);
  
  for (let i = 0; i < numSlices; i++) {
    // Random slice height
    const sliceHeight = Math.floor(Math.random() * (height / 8)) + 3;
    // Random y position for the slice
    const y = Math.floor(Math.random() * (height - sliceHeight));
    // Random x offset for the slice
    const offset = Math.floor(Math.random() * intensity * 2) - intensity;
    
    // Draw the slice with offset
    ctx.drawImage(
      tempCanvas,
      0, y, width, sliceHeight,
      offset, y, width, sliceHeight
    );
    
    // Add neon cyberpunk color effects
    const sliceData = tempCtx.getImageData(0, y, width, sliceHeight);
    const slicePixels = sliceData.data;
    
    for (let j = 0; j < slicePixels.length; j += 4) {
      // Enhanced cyan/magenta cyberpunk effect
      if (Math.random() < neonIntensity) {
        const brightness = (slicePixels[j] + slicePixels[j + 1] + slicePixels[j + 2]) / 3;
        
        if (brightness > 128) {
          // Bright areas get cyan
          slicePixels[j] = Math.min(255, slicePixels[j] * 0.3); // Reduce red
          slicePixels[j + 1] = Math.min(255, slicePixels[j + 1] * 1.5); // Boost green
          slicePixels[j + 2] = Math.min(255, slicePixels[j + 2] * 1.8); // Boost blue
        } else {
          // Dark areas get magenta
          slicePixels[j] = Math.min(255, slicePixels[j] * 1.8); // Boost red
          slicePixels[j + 1] = Math.min(255, slicePixels[j + 1] * 0.3); // Reduce green
          slicePixels[j + 2] = Math.min(255, slicePixels[j + 2] * 1.5); // Boost blue
        }
      }
      
      // Random digital noise
      if (Math.random() < 0.1) {
        const noise = Math.random() * 100 - 50;
        slicePixels[j] = Math.max(0, Math.min(255, slicePixels[j] + noise));
        slicePixels[j + 1] = Math.max(0, Math.min(255, slicePixels[j + 1] + noise));
        slicePixels[j + 2] = Math.max(0, Math.min(255, slicePixels[j + 2] + noise));
      }
    }
    
    tempCtx.putImageData(sliceData, 0, y);
    ctx.drawImage(tempCanvas, offset, y, width, sliceHeight, offset, y, width, sliceHeight);
  }
  
  // Add scanlines for extra cyberpunk effect
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = 'rgba(0, 255, 255, 0.1)';
  for (let i = 0; i < height; i += 4) {
    ctx.fillRect(0, i, width, 1);
  }
  ctx.globalCompositeOperation = 'source-over';
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
      case 'holographic':
        applyHolographic(ctx, canvas.width, canvas.height, intensity, 
          selectedTemplate.rainbowIntensity || 0.3);
        break;
      case 'cyberpunk-glitch':
        applyCyberpunkGlitch(ctx, canvas.width, canvas.height, intensity, 
          selectedTemplate.neonIntensity || 0.8);
        break;
      case 'prism-split':
        applyPrismSplit(ctx, canvas.width, canvas.height, intensity,
          selectedTemplate.prismAngle || 45);
        break;
      case 'neon-glow':
        applyNeonGlow(ctx, canvas.width, canvas.height, intensity, 
          selectedTemplate.glowColor || "#00ffff");
        break;
      case 'digital-noise':
        applyDigitalNoise(ctx, canvas.width, canvas.height, intensity,
          selectedTemplate.noiseType || "rgb");
        break;

      case 'infrared':
        applyInfrared(ctx, canvas.width, canvas.height, intensity,
          selectedTemplate.heatmap || true);
        break;
      case 'lens-flare':
        applyLensFlare(ctx, canvas.width, canvas.height, intensity,
          selectedTemplate.flarePosition || { x: 0.7, y: 0.3 });
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

/**
 * Convert HSV to RGB
 */
function hsvToRgb(h: number, s: number, v: number): { r: number, g: number, b: number } {
  const c = v * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = v - c;
  
  let r = 0, g = 0, b = 0;
  
  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else if (h >= 300 && h < 360) {
    r = c; g = 0; b = x;
  }
  
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  };
}

/**
 * Apply prism split effect to a canvas context
 */
export const applyPrismSplit = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number,
  prismAngle: number
): void => {
  // Get image data
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  // Create a copy of the image data
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;

  tempCtx.putImageData(imageData, 0, 0);
  const tempImageData = tempCtx.getImageData(0, 0, width, height);
  const tempData = tempImageData.data;
  
  // Calculate prism offsets based on angle
  const angleRad = (prismAngle * Math.PI) / 180;
  const baseOffset = intensity / 3;
  
  // RGB channel offsets for prism effect
  const redOffset = { 
    x: Math.cos(angleRad) * baseOffset, 
    y: Math.sin(angleRad) * baseOffset 
  };
  const greenOffset = { 
    x: Math.cos(angleRad + Math.PI * 2/3) * baseOffset, 
    y: Math.sin(angleRad + Math.PI * 2/3) * baseOffset 
  };
  const blueOffset = { 
    x: Math.cos(angleRad + Math.PI * 4/3) * baseOffset, 
    y: Math.sin(angleRad + Math.PI * 4/3) * baseOffset 
  };

  // Apply prism split
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      
      // Calculate positions for each channel with prism offsets
      const rX = Math.min(Math.max(Math.round(x + redOffset.x), 0), width - 1);
      const rY = Math.min(Math.max(Math.round(y + redOffset.y), 0), height - 1);
      const rIdx = (rY * width + rX) * 4;
      
      const gX = Math.min(Math.max(Math.round(x + greenOffset.x), 0), width - 1);
      const gY = Math.min(Math.max(Math.round(y + greenOffset.y), 0), height - 1);
      const gIdx = (gY * width + gX) * 4;
      
      const bX = Math.min(Math.max(Math.round(x + blueOffset.x), 0), width - 1);
      const bY = Math.min(Math.max(Math.round(y + blueOffset.y), 0), height - 1);
      const bIdx = (bY * width + bX) * 4;
      
      // Set RGB values from their respective offset positions
      data[idx] = tempData[rIdx];         // Red
      data[idx + 1] = tempData[gIdx + 1]; // Green
      data[idx + 2] = tempData[bIdx + 2]; // Blue
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

/**
 * Apply neon glow effect to a canvas context
 */
export const applyNeonGlow = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number,
  glowColor: string
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

  // Parse glow color
  const glow = hexToRgb(glowColor);
  if (!glow) return;

  // Create multiple glow layers for realistic neon effect
  const glowRadius = Math.floor(intensity / 2);
  
  // First, darken the image to make neon pop
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = `rgba(0, 0, 0, ${0.3 + (intensity / 200)})`;
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'source-over';

  // Create edge detection for neon tubes
  const edgeCanvas = document.createElement('canvas');
  edgeCanvas.width = width;
  edgeCanvas.height = height;
  const edgeCtx = edgeCanvas.getContext('2d');
  if (!edgeCtx) return;

  // Apply edge detection filter
  edgeCtx.filter = 'contrast(300%) brightness(150%) grayscale(100%)';
  edgeCtx.drawImage(tempCanvas, 0, 0);
  
  // Create the glow effect with multiple layers
  for (let layer = 0; layer < 5; layer++) {
    const layerRadius = glowRadius * (1 + layer * 0.5);
    const layerAlpha = (0.8 - layer * 0.15) * (intensity / 50);
    
    // Create radial glow
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = layerRadius;
    ctx.globalAlpha = layerAlpha;
    ctx.globalCompositeOperation = 'screen';
    
    // Draw edges with glow
    ctx.drawImage(edgeCanvas, 0, 0);
  }

  // Reset shadow and alpha
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';

  // Add bright neon core
  ctx.globalCompositeOperation = 'screen';
  ctx.globalAlpha = intensity / 100;
  
  // Create bright core gradient
  const coreGradient = ctx.createRadialGradient(
    width / 2, height / 2, 0,
    width / 2, height / 2, Math.max(width, height) / 2
  );
  coreGradient.addColorStop(0, glowColor);
  coreGradient.addColorStop(0.3, `${glowColor}80`);
  coreGradient.addColorStop(1, 'transparent');
  
  ctx.fillStyle = coreGradient;
  ctx.fillRect(0, 0, width, height);
  
  // Reset
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
};

/**
 * Apply digital noise effect to a canvas context
 */
export const applyDigitalNoise = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number,
  noiseType: string
): void => {
  // Get image data
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  // Much more aggressive noise settings
  const noiseIntensity = intensity * 4;
  const noiseProbability = Math.min(0.8, intensity / 50); // Higher probability
  
  // Apply digital noise
  for (let i = 0; i < data.length; i += 4) {
    if (Math.random() < noiseProbability) {
      if (noiseType === 'rgb') {
        // RGB noise - random color channels with more dramatic effect
        const rNoise = (Math.random() - 0.5) * noiseIntensity;
        const gNoise = (Math.random() - 0.5) * noiseIntensity;
        const bNoise = (Math.random() - 0.5) * noiseIntensity;
        
        data[i] = Math.max(0, Math.min(255, data[i] + rNoise));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + gNoise));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + bNoise));
        
        // Add random pixel corruption
        if (Math.random() < 0.1) {
          data[i] = Math.random() * 255;
          data[i + 1] = Math.random() * 255;
          data[i + 2] = Math.random() * 255;
        }
      } else {
        // Monochrome noise with digital artifacts
        const noise = (Math.random() - 0.5) * noiseIntensity;
        data[i] = Math.max(0, Math.min(255, data[i] + noise));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
        
        // Add digital static blocks
        if (Math.random() < 0.05) {
          const staticValue = Math.random() > 0.5 ? 255 : 0;
          data[i] = staticValue;
          data[i + 1] = staticValue;
          data[i + 2] = staticValue;
        }
      }
    }
    
    // Add compression artifacts
    if (Math.random() < intensity / 200) {
      // Create blocky compression artifacts
      const blockValue = Math.floor(data[i] / 32) * 32;
      data[i] = blockValue;
      data[i + 1] = Math.floor(data[i + 1] / 32) * 32;
      data[i + 2] = Math.floor(data[i + 2] / 32) * 32;
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};



/**
 * Apply infrared vision effect to a canvas context
 */
export const applyInfrared = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number,
  heatmap: boolean
): void => {
  // Get image data
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  // Apply infrared effect
  for (let i = 0; i < data.length; i += 4) {
    // Convert to grayscale first
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    
    if (heatmap) {
      // Apply thermal heatmap colors
      const normalizedGray = gray / 255;
      let r, g, b;
      
      if (normalizedGray < 0.25) {
        // Cold - black to purple
        r = normalizedGray * 4 * 128;
        g = 0;
        b = normalizedGray * 4 * 255;
      } else if (normalizedGray < 0.5) {
        // Cool - purple to blue
        const t = (normalizedGray - 0.25) * 4;
        r = 128 * (1 - t);
        g = 0;
        b = 255;
      } else if (normalizedGray < 0.75) {
        // Warm - blue to red
        const t = (normalizedGray - 0.5) * 4;
        r = t * 255;
        g = t * 128;
        b = 255 * (1 - t);
      } else {
        // Hot - red to white
        const t = (normalizedGray - 0.75) * 4;
        r = 255;
        g = 128 + t * 127;
        b = t * 255;
      }
      
      // Mix with original based on intensity
      const mixFactor = intensity / 100;
      data[i] = Math.round(data[i] * (1 - mixFactor) + r * mixFactor);
      data[i + 1] = Math.round(data[i + 1] * (1 - mixFactor) + g * mixFactor);
      data[i + 2] = Math.round(data[i + 2] * (1 - mixFactor) + b * mixFactor);
    } else {
      // Simple infrared - invert and enhance reds
      const mixFactor = intensity / 100;
      data[i] = Math.round(data[i] * (1 - mixFactor) + (255 - gray) * mixFactor);
      data[i + 1] = Math.round(data[i + 1] * (1 - mixFactor) + gray * 0.3 * mixFactor);
      data[i + 2] = Math.round(data[i + 2] * (1 - mixFactor) + gray * 0.1 * mixFactor);
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

/**
 * Apply lens flare effect to a canvas context
 */
export const applyLensFlare = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number,
  flarePosition: Position
): void => {
  // Calculate flare position
  const flareX = width * flarePosition.x;
  const flareY = height * flarePosition.y;
  
  // Create lens flare gradient
  const gradient = ctx.createRadialGradient(
    flareX, flareY, 0,
    flareX, flareY, Math.max(width, height) * 0.6
  );
  
  const alpha = intensity / 100;
  gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.8})`);
  gradient.addColorStop(0.1, `rgba(255, 255, 200, ${alpha * 0.6})`);
  gradient.addColorStop(0.3, `rgba(255, 200, 100, ${alpha * 0.3})`);
  gradient.addColorStop(0.6, `rgba(255, 150, 50, ${alpha * 0.1})`);
  gradient.addColorStop(1, 'rgba(255, 100, 0, 0)');
  
  // Draw the main flare
  ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Add multiple lens elements
  const numElements = Math.floor(intensity / 10);
  for (let i = 0; i < numElements; i++) {
    const elementX = flareX + (Math.random() - 0.5) * width * 0.3;
    const elementY = flareY + (Math.random() - 0.5) * height * 0.3;
    const size = Math.random() * 50 + 20;
    
    const elementGradient = ctx.createRadialGradient(
      elementX, elementY, 0,
      elementX, elementY, size
    );
    
    const elementAlpha = alpha * 0.3;
    elementGradient.addColorStop(0, `rgba(255, 255, 255, ${elementAlpha})`);
    elementGradient.addColorStop(0.5, `rgba(255, 200, 100, ${elementAlpha * 0.5})`);
    elementGradient.addColorStop(1, 'rgba(255, 100, 0, 0)');
    
    ctx.fillStyle = elementGradient;
    ctx.beginPath();
    ctx.arc(elementX, elementY, size, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Reset blend mode
  ctx.globalCompositeOperation = 'source-over';
};
