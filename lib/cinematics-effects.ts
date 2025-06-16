// Cinematics effects templates
export const CINEMATICS_EFFECTS_TEMPLATES = [
  {
    id: "golden-hour",
    name: "Golden Hour",
    type: "golden-hour",
    intensity: 80,
    warmth: 1.4,
    thumbnail: "/templates/golden-hour.jpg"
  },
  {
    id: "neon-city",
    name: "Neon City",
    type: "neon-city",
    intensity: 85,
    neonIntensity: 1.5,
    thumbnail: "/templates/neon-city.jpg"
  },
  {
    id: "film-burn",
    name: "Film Burn",
    type: "film-burn",
    intensity: 90,
    burnAmount: 0.7,
    thumbnail: "/templates/film-burn.jpg"
  },
  {
    id: "double-exposure",
    name: "Double Exposure",
    type: "double-exposure",
    intensity: 70,
    blendMode: "multiply",
    thumbnail: "/templates/double-exposure.jpg"
  },
  {
    id: "light-leak",
    name: "Light Leak",
    type: "light-leak",
    intensity: 75,
    leakColor: "#ffaa00",
    thumbnail: "/templates/light-leak.jpg"
  },
  {
    id: "cross-process",
    name: "Cross Process",
    type: "cross-process",
    intensity: 80,
    colorShift: 1.3,
    thumbnail: "/templates/cross-process.jpg"
  },
  {
    id: "infrared",
    name: "Infrared",
    type: "infrared",
    intensity: 75,
    heatMap: true,
    thumbnail: "/templates/infrared.jpg"
  },
  {
    id: "polaroid",
    name: "Polaroid",
    type: "polaroid",
    intensity: 65,
    borderWidth: 20,
    thumbnail: "/templates/polaroid.jpg"
  },
  {
    id: "x-ray",
    name: "X-Ray",
    type: "x-ray",
    intensity: 90,
    invert: true,
    thumbnail: "/templates/x-ray.jpg"
  },
  {
    id: "oil-painting",
    name: "Oil Painting",
    type: "oil-painting",
    intensity: 60,
    brushSize: 3,
    thumbnail: "/templates/oil-painting.jpg"
  },
  {
    id: "dramatic-vignette",
    name: "Dramatic Vignette",
    type: "dramatic-vignette",
    intensity: 75,
    vignetteType: "cinematic",
    thumbnail: "/templates/dramatic-vignette.jpg"
  }
];

export type CinematicsEffectTemplate = typeof CINEMATICS_EFFECTS_TEMPLATES[0];
export type EffectType = "golden-hour" | "neon-city" | "film-burn" | "double-exposure" | "light-leak" | "cross-process" | "infrared" | "polaroid" | "x-ray" | "oil-painting" | "dramatic-vignette";
export type ColorShift = { r: number, g: number, b: number };

/**
 * Apply Golden Hour effect - warm sunset glow
 */
export const applyGoldenHour = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number,
  warmth: number = 1.4
): void => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const factor = intensity / 100;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Golden hour transformation
    data[i] = Math.min(255, r * (1 + 0.3 * factor * warmth) + 30 * factor);
    data[i + 1] = Math.min(255, g * (1 + 0.1 * factor) + 20 * factor);
    data[i + 2] = Math.min(255, b * (0.7 + 0.3 * factor) + 5 * factor);
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  // Add warm glow
  const gradient = ctx.createRadialGradient(width * 0.7, height * 0.3, 0, width * 0.7, height * 0.3, Math.max(width, height));
  gradient.addColorStop(0, `rgba(255, 200, 100, ${0.2 * factor})`);
  gradient.addColorStop(1, 'rgba(255, 150, 50, 0)');
  
  ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'source-over';
};

/**
 * Apply Neon City effect - cyberpunk neon glow
 */
export const applyNeonCity = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number,
  neonIntensity: number = 1.5
): void => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const factor = intensity / 100;
  
  // Darken image first
  for (let i = 0; i < data.length; i += 4) {
    data[i] *= 0.3;
    data[i + 1] *= 0.3;
    data[i + 2] *= 0.3;
  }
  
  // Add neon edge detection
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      
      // Simple edge detection
      const current = data[idx] + data[idx + 1] + data[idx + 2];
      const right = data[idx + 4] + data[idx + 5] + data[idx + 6];
      const bottom = data[((y + 1) * width + x) * 4] + data[((y + 1) * width + x) * 4 + 1] + data[((y + 1) * width + x) * 4 + 2];
      
      const edge = Math.abs(current - right) + Math.abs(current - bottom);
      
      if (edge > 50) {
        const neonColor = (x + y) % 3;
        if (neonColor === 0) {
          data[idx] = Math.min(255, data[idx] + 200 * factor * neonIntensity); // Red
        } else if (neonColor === 1) {
          data[idx + 1] = Math.min(255, data[idx + 1] + 200 * factor * neonIntensity); // Green
        } else {
          data[idx + 2] = Math.min(255, data[idx + 2] + 200 * factor * neonIntensity); // Blue
        }
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  // Add neon scanlines
  ctx.globalCompositeOperation = 'screen';
  ctx.strokeStyle = `rgba(0, 255, 255, ${0.1 * factor})`;
  ctx.lineWidth = 1;
  
  for (let y = 0; y < height; y += 4) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  
  ctx.globalCompositeOperation = 'source-over';
};

/**
 * Apply Film Burn effect - vintage film damage with realistic burn patterns
 */
export const applyFilmBurn = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number,
  burnAmount: number = 0.7
): void => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const factor = intensity / 100;
  
  // Create multiple burn centers for realistic damage
  const burnCenters = [
    { x: width * 0.2, y: height * 0.1, radius: Math.min(width, height) * 0.3 },
    { x: width * 0.8, y: height * 0.3, radius: Math.min(width, height) * 0.2 },
    { x: width * 0.1, y: height * 0.7, radius: Math.min(width, height) * 0.25 },
    { x: width * 0.9, y: height * 0.9, radius: Math.min(width, height) * 0.15 }
  ];
  
  for (let i = 0; i < data.length; i += 4) {
    const x = (i / 4) % width;
    const y = Math.floor((i / 4) / width);
    
    let burnIntensity = 0;
    
    // Calculate burn intensity from multiple centers
    burnCenters.forEach(center => {
      const distance = Math.sqrt((x - center.x) ** 2 + (y - center.y) ** 2);
      const normalizedDistance = distance / center.radius;
      
      if (normalizedDistance < 1) {
        const centerBurn = (1 - normalizedDistance) * burnAmount * factor;
        // Add organic noise to burn pattern
        const noise = Math.sin(x * 0.02) * Math.cos(y * 0.02) * 0.3 + Math.random() * 0.4;
        burnIntensity = Math.max(burnIntensity, centerBurn * (0.7 + noise));
      }
    });
    
    if (burnIntensity > 0.1) {
      // Create realistic burn colors - from brown to orange to yellow to white
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      if (burnIntensity > 0.8) {
        // Severe burn - white hot
        data[i] = Math.min(255, r + (255 - r) * burnIntensity);
        data[i + 1] = Math.min(255, g + (255 - g) * burnIntensity);
        data[i + 2] = Math.min(255, b + (200 - b) * burnIntensity);
      } else if (burnIntensity > 0.5) {
        // Medium burn - yellow/orange
        data[i] = Math.min(255, r + (255 - r) * burnIntensity);
        data[i + 1] = Math.min(255, g + (200 - g) * burnIntensity);
        data[i + 2] = Math.max(0, b * (1 - burnIntensity * 0.8));
      } else {
        // Light burn - brown/sepia
        data[i] = Math.min(255, r * (1 + burnIntensity * 0.5) + 60 * burnIntensity);
        data[i + 1] = Math.min(255, g * (1 + burnIntensity * 0.3) + 40 * burnIntensity);
        data[i + 2] = Math.min(255, b * (1 - burnIntensity * 0.3) + 20 * burnIntensity);
      }
    }
    
    // Add vintage film grain
    const grain = (Math.random() - 0.5) * 25 * factor;
    data[i] = Math.max(0, Math.min(255, data[i] + grain));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grain));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grain));
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  // Add burn edge effects
  ctx.globalCompositeOperation = 'multiply';
  burnCenters.forEach(center => {
    const gradient = ctx.createRadialGradient(
      center.x, center.y, center.radius * 0.3,
      center.x, center.y, center.radius
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.7, `rgba(139, 69, 19, ${0.8 * factor})`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  });
  ctx.globalCompositeOperation = 'source-over';
};

/**
 * Apply Double Exposure effect - professional multiple exposure blend
 */
export const applyDoubleExposure = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number,
  blendMode: string = "multiply"
): void => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const factor = intensity / 100;
  
  // Create multiple exposure layers for realistic effect
  const exposures = [
    { offsetX: width * 0.05, offsetY: height * 0.03, scale: 1.1, opacity: 0.4 },
    { offsetX: -width * 0.03, offsetY: height * 0.07, scale: 0.95, opacity: 0.3 },
    { offsetX: width * 0.02, offsetY: -height * 0.04, scale: 1.05, opacity: 0.2 }
  ];
  
  const originalData = new Uint8ClampedArray(data);
  const blendedData = new Uint8ClampedArray(data.length);
  
  // Initialize with original image
  for (let i = 0; i < data.length; i++) {
    blendedData[i] = data[i];
  }
  
  exposures.forEach(exposure => {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        
        // Calculate source position with scaling and offset
        const centerX = width / 2;
        const centerY = height / 2;
        const scaledX = centerX + (x - centerX) / exposure.scale + exposure.offsetX;
        const scaledY = centerY + (y - centerY) / exposure.scale + exposure.offsetY;
        
        // Bilinear interpolation for smooth scaling
        const x1 = Math.floor(scaledX);
        const y1 = Math.floor(scaledY);
        const x2 = Math.min(x1 + 1, width - 1);
        const y2 = Math.min(y1 + 1, height - 1);
        
        if (x1 >= 0 && y1 >= 0 && x2 < width && y2 < height) {
          const fx = scaledX - x1;
          const fy = scaledY - y1;
          
          const idx1 = (y1 * width + x1) * 4;
          const idx2 = (y1 * width + x2) * 4;
          const idx3 = (y2 * width + x1) * 4;
          const idx4 = (y2 * width + x2) * 4;
          
          for (let c = 0; c < 3; c++) {
            const top = originalData[idx1 + c] * (1 - fx) + originalData[idx2 + c] * fx;
            const bottom = originalData[idx3 + c] * (1 - fx) + originalData[idx4 + c] * fx;
            const interpolated = top * (1 - fy) + bottom * fy;
            
            // Apply color transformation for each exposure
            let transformedColor = interpolated;
            if (c === 0) transformedColor = Math.min(255, interpolated * 1.1); // Enhance red
            if (c === 1) transformedColor = Math.min(255, interpolated * 0.9); // Reduce green
            if (c === 2) transformedColor = Math.min(255, interpolated * 1.2); // Enhance blue
            
            // Blend with existing data using screen blend mode
            const alpha = exposure.opacity * factor;
            const existing = blendedData[idx + c];
            const blended = 255 - ((255 - existing) * (255 - transformedColor)) / 255;
            blendedData[idx + c] = existing * (1 - alpha) + blended * alpha;
          }
        }
      }
    }
  });
  
  // Apply final blend
  for (let i = 0; i < data.length; i += 4) {
    data[i] = blendedData[i];
    data[i + 1] = blendedData[i + 1];
    data[i + 2] = blendedData[i + 2];
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  // Add subtle glow effect
  ctx.globalCompositeOperation = 'screen';
  ctx.globalAlpha = 0.1 * factor;
  
  const gradient = ctx.createRadialGradient(
    width / 2, height / 2, 0,
    width / 2, height / 2, Math.max(width, height) / 2
  );
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
};

/**
 * Apply Light Leak effect - vintage light streaks
 */
export const applyLightLeak = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number,
  leakColor: string = "#ffaa00"
): void => {
  const imageData = ctx.getImageData(0, 0, width, height);
  ctx.putImageData(imageData, 0, 0);
  
  const factor = intensity / 100;
  
  // Create multiple light leaks
  ctx.globalCompositeOperation = 'screen';
  
  for (let i = 0; i < 3; i++) {
    const startX = Math.random() * width;
    const startY = Math.random() * height;
    const endX = Math.random() * width;
    const endY = Math.random() * height;
    
    const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
    gradient.addColorStop(0, `rgba(255, 200, 100, ${0.3 * factor})`);
    gradient.addColorStop(0.5, `rgba(255, 150, 50, ${0.2 * factor})`);
    gradient.addColorStop(1, 'rgba(255, 100, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
  
  // Add lens flare spots
  for (let i = 0; i < 5; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = Math.random() * 100 + 50;
    
    const spotGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    spotGradient.addColorStop(0, `rgba(255, 255, 255, ${0.4 * factor})`);
    spotGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = spotGradient;
    ctx.fillRect(0, 0, width, height);
  }
  
  ctx.globalCompositeOperation = 'source-over';
};

/**
 * Apply Cross Process effect - shifted color channels
 */
export const applyCrossProcess = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number,
  colorShift: number = 1.3
): void => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const factor = intensity / 100;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Cross processing color shifts
    const newR = Math.min(255, g * 0.8 + b * 0.2 * colorShift * factor + r * (1 - factor));
    const newG = Math.min(255, b * 0.8 + r * 0.2 * colorShift * factor + g * (1 - factor));
    const newB = Math.min(255, r * 0.8 + g * 0.2 * colorShift * factor + b * (1 - factor));
    
    data[i] = newR;
    data[i + 1] = newG;
    data[i + 2] = newB;
  }
  
  ctx.putImageData(imageData, 0, 0);
};

/**
 * Apply Infrared effect - heat vision
 */
export const applyInfrared = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number,
  heatMap: boolean = true
): void => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const factor = intensity / 100;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Calculate heat intensity
    const heat = (r + g + b) / 3;
    
    if (heatMap) {
      // Heat map colors
      if (heat < 85) {
        data[i] = heat * 3 * factor + r * (1 - factor);
        data[i + 1] = 0;
        data[i + 2] = (85 - heat) * 3 * factor + b * (1 - factor);
      } else if (heat < 170) {
        data[i] = 255 * factor + r * (1 - factor);
        data[i + 1] = (heat - 85) * 3 * factor + g * (1 - factor);
        data[i + 2] = 0;
      } else {
        data[i] = 255 * factor + r * (1 - factor);
        data[i + 1] = 255 * factor + g * (1 - factor);
        data[i + 2] = (heat - 170) * 3 * factor + b * (1 - factor);
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

/**
 * Apply Polaroid effect - instant camera look with border
 */
export const applyPolaroid = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number,
  borderWidth: number = 20
): void => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const factor = intensity / 100;
  
  // Vintage color grading
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Polaroid color shift
    data[i] = Math.min(255, r * (1.1 + 0.1 * factor) + 10 * factor);
    data[i + 1] = Math.min(255, g * (1.05 + 0.05 * factor) + 5 * factor);
    data[i + 2] = Math.min(255, b * (0.9 + 0.1 * factor));
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  // Add white border
  const border = borderWidth * factor;
  ctx.fillStyle = '#f8f8f0';
  ctx.fillRect(0, 0, width, border); // Top
  ctx.fillRect(0, 0, border, height); // Left
  ctx.fillRect(width - border, 0, border, height); // Right
  ctx.fillRect(0, height - border * 2, width, border * 2); // Bottom (thicker)
  
  // Add slight shadow inside border
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.lineWidth = 2;
  ctx.strokeRect(border, border, width - border * 2, height - border * 3);
};

/**
 * Apply X-Ray effect - medical imaging look
 */
export const applyXRay = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number,
  invert: boolean = true
): void => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const factor = intensity / 100;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Convert to grayscale
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    
    if (invert) {
      // Invert for X-ray look
      const inverted = 255 - gray;
      data[i] = inverted * factor + r * (1 - factor);
      data[i + 1] = inverted * factor + g * (1 - factor);
      data[i + 2] = inverted * factor + b * (1 - factor);
    } else {
      data[i] = gray * factor + r * (1 - factor);
      data[i + 1] = gray * factor + g * (1 - factor);
      data[i + 2] = gray * factor + b * (1 - factor);
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  // Add X-ray glow
  ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = `rgba(100, 150, 255, ${0.1 * factor})`;
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'source-over';
};

/**
 * Apply Oil Painting effect - advanced Kuwahara filter with color quantization
 */
export const applyOilPainting = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number,
  brushSize: number = 3
): void => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const factor = intensity / 100;
  const radius = Math.max(2, Math.floor(brushSize * factor * 2));
  
  const newData = new Uint8ClampedArray(data.length);
  
  // Kuwahara filter for oil painting effect
  for (let y = radius; y < height - radius; y++) {
    for (let x = radius; x < width - radius; x++) {
      const idx = (y * width + x) * 4;
      
      // Divide the neighborhood into 4 quadrants
      const quadrants = [
        { startX: x - radius, endX: x, startY: y - radius, endY: y },
        { startX: x, endX: x + radius, startY: y - radius, endY: y },
        { startX: x - radius, endX: x, startY: y, endY: y + radius },
        { startX: x, endX: x + radius, startY: y, endY: y + radius }
      ];
      
      let bestQuadrant = { r: 0, g: 0, b: 0, variance: Infinity };
      
      quadrants.forEach(quad => {
        let sumR = 0, sumG = 0, sumB = 0;
        let sumR2 = 0, sumG2 = 0, sumB2 = 0;
        let count = 0;
        
        for (let qy = quad.startY; qy < quad.endY; qy++) {
          for (let qx = quad.startX; qx < quad.endX; qx++) {
            if (qx >= 0 && qx < width && qy >= 0 && qy < height) {
              const qIdx = (qy * width + qx) * 4;
              const r = data[qIdx];
              const g = data[qIdx + 1];
              const b = data[qIdx + 2];
              
              sumR += r;
              sumG += g;
              sumB += b;
              sumR2 += r * r;
              sumG2 += g * g;
              sumB2 += b * b;
              count++;
            }
          }
        }
        
        if (count > 0) {
          const meanR = sumR / count;
          const meanG = sumG / count;
          const meanB = sumB / count;
          
          const varR = (sumR2 / count) - (meanR * meanR);
          const varG = (sumG2 / count) - (meanG * meanG);
          const varB = (sumB2 / count) - (meanB * meanB);
          const totalVariance = varR + varG + varB;
          
          if (totalVariance < bestQuadrant.variance) {
            bestQuadrant = {
              r: meanR,
              g: meanG,
              b: meanB,
              variance: totalVariance
            };
          }
        }
      });
      
      // Color quantization for oil painting effect
      const levels = Math.max(4, 16 - Math.floor(factor * 8));
      const quantizedR = Math.floor(bestQuadrant.r / (256 / levels)) * (256 / levels);
      const quantizedG = Math.floor(bestQuadrant.g / (256 / levels)) * (256 / levels);
      const quantizedB = Math.floor(bestQuadrant.b / (256 / levels)) * (256 / levels);
      
      newData[idx] = quantizedR;
      newData[idx + 1] = quantizedG;
      newData[idx + 2] = quantizedB;
      newData[idx + 3] = data[idx + 3];
    }
  }
  
  // Handle edges by copying original data
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      if (x < radius || x >= width - radius || y < radius || y >= height - radius) {
        newData[idx] = data[idx];
        newData[idx + 1] = data[idx + 1];
        newData[idx + 2] = data[idx + 2];
        newData[idx + 3] = data[idx + 3];
      }
    }
  }
  
  // Blend with original based on intensity
  for (let i = 0; i < data.length; i += 4) {
    data[i] = newData[i] * factor + data[i] * (1 - factor);
    data[i + 1] = newData[i + 1] * factor + data[i + 1] * (1 - factor);
    data[i + 2] = newData[i + 2] * factor + data[i + 2] * (1 - factor);
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  // Add subtle texture overlay for canvas effect
  ctx.globalCompositeOperation = 'overlay';
  ctx.globalAlpha = 0.1 * factor;
  
  // Create canvas texture pattern
  for (let y = 0; y < height; y += 3) {
    for (let x = 0; x < width; x += 3) {
      const noise = Math.random() * 0.5 + 0.5;
      ctx.fillStyle = `rgba(255, 255, 255, ${noise * 0.3})`;
      ctx.fillRect(x, y, 2, 2);
    }
  }
  
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
};

/**
 * Apply dramatic vignette effect with top-focused circular light
 */
export const applyDramaticVignette = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number,
  vignetteType: string = "cinematic"
): void => {
  const factor = intensity / 100;
  
  // Position the light focus in the upper portion of the image
  const lightCenterX = width * 0.5;  // Center horizontally
  const lightCenterY = height * 0.25; // Upper quarter of the image
  const maxRadius = Math.max(width, height) * 1.2; // Increased for bigger light
  
  // Create dramatic spotlight effect with much bigger circular light
  const spotlightLayers = [
    { radius: maxRadius * 0.35, opacity: 0.0 },    // Much bigger bright center
    { radius: maxRadius * 0.5, opacity: 0.1 * factor },
    { radius: maxRadius * 0.65, opacity: 0.2 * factor },
    { radius: maxRadius * 0.8, opacity: 0.4 * factor },
    { radius: maxRadius * 0.95, opacity: 0.6 * factor },
    { radius: maxRadius * 1.1, opacity: 0.8 * factor },
    { radius: maxRadius * 1.3, opacity: 0.95 * factor }
  ];
  
  ctx.globalCompositeOperation = 'multiply';
  
  spotlightLayers.forEach(layer => {
    const gradient = ctx.createRadialGradient(
      lightCenterX, lightCenterY, 0,
      lightCenterX, lightCenterY, layer.radius
    );
    
    if (vignetteType === "cinematic") {
      // Cinematic spotlight with warm light
      gradient.addColorStop(0, 'rgba(255, 248, 220, 1)');        // Warm white center
      gradient.addColorStop(0.2, 'rgba(255, 235, 180, 1)');      // Warm yellow
      gradient.addColorStop(0.4, 'rgba(220, 180, 120, 0.95)');   // Golden transition
      gradient.addColorStop(0.6, `rgba(150, 100, 60, ${1 - layer.opacity * 0.3})`);  // Warm brown
      gradient.addColorStop(0.8, `rgba(80, 50, 30, ${1 - layer.opacity * 0.6})`);    // Dark brown
      gradient.addColorStop(1, `rgba(20, 15, 10, ${1 - layer.opacity})`);            // Very dark
    } else {
      // Standard dramatic spotlight
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');        // Bright center
      gradient.addColorStop(0.3, 'rgba(200, 200, 200, 0.9)');    // Light gray
      gradient.addColorStop(0.6, `rgba(100, 100, 100, ${1 - layer.opacity * 0.4})`); // Medium gray
      gradient.addColorStop(1, `rgba(0, 0, 0, ${1 - layer.opacity})`);               // Black edges
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  });
  
  // Add additional dramatic shadow to bottom portion
  const bottomGradient = ctx.createLinearGradient(0, height * 0.6, 0, height);
  bottomGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  bottomGradient.addColorStop(1, `rgba(0, 0, 0, ${0.4 * factor})`);
  
  ctx.fillStyle = bottomGradient;
  ctx.fillRect(0, 0, width, height);
  
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
      case 'golden-hour':
        applyGoldenHour(ctx, canvas.width, canvas.height, intensity, selectedTemplate.warmth);
        break;
      case 'neon-city':
        applyNeonCity(ctx, canvas.width, canvas.height, intensity, selectedTemplate.neonIntensity);
        break;
      case 'film-burn':
        applyFilmBurn(ctx, canvas.width, canvas.height, intensity, selectedTemplate.burnAmount);
        break;
      case 'double-exposure':
        applyDoubleExposure(ctx, canvas.width, canvas.height, intensity, selectedTemplate.blendMode);
        break;
      case 'light-leak':
        applyLightLeak(ctx, canvas.width, canvas.height, intensity, selectedTemplate.leakColor);
        break;
      case 'cross-process':
        applyCrossProcess(ctx, canvas.width, canvas.height, intensity, selectedTemplate.colorShift);
        break;
      case 'infrared':
        applyInfrared(ctx, canvas.width, canvas.height, intensity, selectedTemplate.heatMap);
        break;
      case 'polaroid':
        applyPolaroid(ctx, canvas.width, canvas.height, intensity, selectedTemplate.borderWidth);
        break;
      case 'x-ray':
        applyXRay(ctx, canvas.width, canvas.height, intensity, selectedTemplate.invert);
        break;
      case 'oil-painting':
        applyOilPainting(ctx, canvas.width, canvas.height, intensity, selectedTemplate.brushSize);
        break;
      case 'dramatic-vignette':
        applyDramaticVignette(ctx, canvas.width, canvas.height, intensity, selectedTemplate.vignetteType);
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
