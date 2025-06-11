// Cinematics effects templates
export const CINEMATICS_EFFECTS_TEMPLATES = [
  {
    id: "film-grain",
    name: "Film Grain",
    type: "film-grain",
    intensity: 30,
    grainSize: 1,
    thumbnail: "/templates/film-grain.jpg"
  },
  {
    id: "letterbox",
    name: "Letterbox",
    type: "letterbox",
    intensity: 100, // percentage of letterbox height
    ratio: "2.35:1", // cinematic aspect ratio
    thumbnail: "/templates/letterbox.jpg"
  },
  {
    id: "vintage-film",
    name: "Vintage Film",
    type: "vintage-film",
    intensity: 70,
    colorShift: { r: 1.2, g: 0.9, b: 0.8 }, // warm vintage look
    thumbnail: "/templates/vintage-film.jpg"
  },
  {
    id: "color-grading",
    name: "Color Grading",
    type: "color-grading",
    intensity: 80,
    preset: "teal-orange", // popular cinematic color grading
    thumbnail: "/templates/color-grading.jpg"
  },
  {
    id: "vignette-cinematic",
    name: "Cinematic Vignette",
    type: "vignette-cinematic",
    intensity: 40,
    radius: 0.85,
    thumbnail: "/templates/vignette-cinematic.jpg"
  },
  {
    id: "anamorphic-lens-flare",
    name: "Anamorphic Flare",
    type: "anamorphic-flare",
    intensity: 60,
    flareColor: "#00aaff", // blue flare typical of anamorphic lenses
    thumbnail: "/templates/anamorphic-flare.jpg"
  }
];

export type CinematicsEffectTemplate = typeof CINEMATICS_EFFECTS_TEMPLATES[0];
export type EffectType = "film-grain" | "letterbox" | "vintage-film" | "color-grading" | "vignette-cinematic" | "anamorphic-flare";
export type ColorShift = { r: number, g: number, b: number };

/**
 * Apply film grain effect to a canvas context
 */
export const applyFilmGrain = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number,
  grainSize: number = 1
): void => {
  // Get image data
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  // Apply film grain
  for (let y = 0; y < height; y += grainSize) {
    for (let x = 0; x < width; x += grainSize) {
      // Generate random noise value
      const noise = (Math.random() * 2 - 1) * (intensity / 100) * 50;
      
      for (let gy = 0; gy < grainSize && y + gy < height; gy++) {
        for (let gx = 0; gx < grainSize && x + gx < width; gx++) {
          const idx = ((y + gy) * width + (x + gx)) * 4;
          
          // Add noise to each RGB channel
          data[idx] = Math.max(0, Math.min(255, data[idx] + noise));
          data[idx + 1] = Math.max(0, Math.min(255, data[idx + 1] + noise));
          data[idx + 2] = Math.max(0, Math.min(255, data[idx + 2] + noise));
        }
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

/**
 * Apply letterbox effect to a canvas context
 */
export const applyLetterbox = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number,
  ratio: string = "2.35:1"
): void => {
  // Parse aspect ratio
  const [w, h] = ratio.split(':').map(Number);
  const targetRatio = w / h;
  
  // Calculate letterbox height
  const currentRatio = width / height;
  let letterboxHeight = 0;
  
  if (currentRatio < targetRatio) {
    // Image is too tall, add letterbox to top and bottom
    const newHeight = width / targetRatio;
    letterboxHeight = (height - newHeight) / 2 * (intensity / 100);
  }
  
  // Draw black bars
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, width, letterboxHeight);
  ctx.fillRect(0, height - letterboxHeight, width, letterboxHeight);
};

/**
 * Apply vintage film effect to a canvas context
 */
export const applyVintageFilm = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number,
  colorShift: ColorShift = { r: 1.2, g: 0.9, b: 0.8 }
): void => {
  // Get image data
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  // Apply vintage color shift
  for (let i = 0; i < data.length; i += 4) {
    // Apply color shift with intensity
    const factor = intensity / 100;
    data[i] = Math.max(0, Math.min(255, data[i] * (1 + (colorShift.r - 1) * factor)));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] * (1 + (colorShift.g - 1) * factor)));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] * (1 + (colorShift.b - 1) * factor)));
    
    // Add slight contrast
    for (let j = 0; j < 3; j++) {
      data[i + j] = (data[i + j] - 128) * (1 + 0.2 * factor) + 128;
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  // Add subtle film grain
  applyFilmGrain(ctx, width, height, intensity * 0.3, 1);
};

/**
 * Apply color grading effect to a canvas context
 */
export const applyColorGrading = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number,
  preset: string = "teal-orange"
): void => {
  // Get image data
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  // Define color grading presets
  const presets: Record<string, { shadows: ColorShift, highlights: ColorShift }> = {
    "teal-orange": {
      shadows: { r: 0.6, g: 0.9, b: 1.0 },     // Teal shadows
      highlights: { r: 1.2, g: 0.8, b: 0.6 }   // Orange highlights
    },
    "blockbuster": {
      shadows: { r: 0.8, g: 0.9, b: 1.2 },     // Blue shadows
      highlights: { r: 1.1, g: 1.0, b: 0.8 }   // Yellow highlights
    }
  };
  
  const selectedPreset = presets[preset] || presets["teal-orange"];
  const factor = intensity / 100;
  
  // Apply color grading
  for (let i = 0; i < data.length; i += 4) {
    // Calculate luminance to determine if pixel is in shadows or highlights
    const luminance = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    const normalizedLuminance = luminance / 255;
    
    // Mix between shadows and highlights based on luminance
    const r = normalizedLuminance < 0.5 
      ? selectedPreset.shadows.r 
      : selectedPreset.highlights.r;
    const g = normalizedLuminance < 0.5 
      ? selectedPreset.shadows.g 
      : selectedPreset.highlights.g;
    const b = normalizedLuminance < 0.5 
      ? selectedPreset.shadows.b 
      : selectedPreset.highlights.b;
    
    // Apply color shift with intensity
    data[i] = Math.max(0, Math.min(255, data[i] * (1 + (r - 1) * factor)));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] * (1 + (g - 1) * factor)));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] * (1 + (b - 1) * factor)));
  }
  
  ctx.putImageData(imageData, 0, 0);
};

/**
 * Apply cinematic vignette effect to a canvas context
 */
export const applyVignetteCinematic = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number,
  radius: number = 0.85
): void => {
  // Create a radial gradient for the vignette
  const gradient = ctx.createRadialGradient(
    width / 2, height / 2, 0,
    width / 2, height / 2, Math.max(width, height) / 2
  );
  
  // Adjust the gradient stops based on intensity and radius
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(radius, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(1, `rgba(0, 0, 0, ${intensity / 100})`);
  
  // Apply the gradient as an overlay
  ctx.fillStyle = gradient;
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'source-over';
};

/**
 * Apply anamorphic lens flare effect to a canvas context
 */
export const applyAnamorphicFlare = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number,
  flareColor: string = "#00aaff"
): void => {
  // Parse flare color
  const colorMatch = flareColor.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!colorMatch) return;
  
  const r = parseInt(colorMatch[1], 16);
  const g = parseInt(colorMatch[2], 16);
  const b = parseInt(colorMatch[3], 16);
  
  // Create a horizontal lens flare
  const flareY = height / 3; // Position flare in the upper third
  const flareWidth = width * 0.8;
  const flareHeight = height * 0.05 * (intensity / 100);
  
  // Draw the flare
  ctx.globalCompositeOperation = 'screen';
  
  // Create a gradient for the flare
  const gradient = ctx.createLinearGradient(
    (width - flareWidth) / 2, flareY,
    (width + flareWidth) / 2, flareY
  );
  
  gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
  gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${intensity / 100})`);
  gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
  
  ctx.fillStyle = gradient;
  ctx.fillRect((width - flareWidth) / 2, flareY - flareHeight / 2, flareWidth, flareHeight);
  
  // Reset composite operation
  ctx.globalCompositeOperation = 'source-over';
};

/**
 * Process an image with cinematics effect
 */
export const processImageWithCinematicsEffect = (
  image: string,
  canvas: HTMLCanvasElement,
  selectedTemplate: CinematicsEffectTemplate,
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

    // Apply cinematics effect based on template type
    switch (selectedTemplate.type) {
      case 'film-grain':
        applyFilmGrain(ctx, canvas.width, canvas.height, intensity, selectedTemplate.grainSize);
        break;
      case 'letterbox':
        applyLetterbox(ctx, canvas.width, canvas.height, intensity, selectedTemplate.ratio);
        break;
      case 'vintage-film':
        applyVintageFilm(ctx, canvas.width, canvas.height, intensity, selectedTemplate.colorShift);
        break;
      case 'color-grading':
        applyColorGrading(ctx, canvas.width, canvas.height, intensity, selectedTemplate.preset);
        break;
      case 'vignette-cinematic':
        applyVignetteCinematic(ctx, canvas.width, canvas.height, intensity, selectedTemplate.radius);
        break;
      case 'anamorphic-flare':
        applyAnamorphicFlare(ctx, canvas.width, canvas.height, intensity, selectedTemplate.flareColor);
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
  link.download = `cinematics-effect-${Date.now()}.jpg`;
  link.href = processedImage;
  link.click();
};
