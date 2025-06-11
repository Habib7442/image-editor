// Polaroid effects templates
export const POLAROID_TEMPLATES = [
  {
    id: "memories",
    name: "Memories Polaroid",
    type: "memories",
    intensity: 60,
    borderWidth: 40,
    borderColor: "#ffffff",
    shadowIntensity: 35,
    rotation: 0,
    captionColor: "#000000",
    captionFont: "20px 'Caveat', cursive",
    hasTape: true,
    hasDate: true,
    thumbnail: "/templates/memories-polaroid.jpg",
  },
];

export type PolaroidTemplate = (typeof POLAROID_TEMPLATES)[0];
export type PolaroidType = "memories";

/**
 * Apply classic polaroid effect
 */
const applyClassicPolaroid = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number,
  borderWidth: number,
  borderColor: string,
  shadowIntensity: number,
  caption?: string,
  captionSize: number = 16,
  captionColor: string = "#000000",
  captionFont: string = "Arial"
): void => {
  // Store the original image
  const imageData = ctx.getImageData(0, 0, width, height);

  // Create a new canvas with border
  const newWidth = width + borderWidth * 2;
  const newHeight = height + borderWidth * 2 + (caption ? 60 : 0);

  // Resize canvas
  ctx.canvas.width = newWidth;
  ctx.canvas.height = newHeight;

  // Draw border
  ctx.fillStyle = borderColor;
  ctx.fillRect(0, 0, newWidth, newHeight);

  // Add shadow if intensity > 0
  if (shadowIntensity > 0) {
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = shadowIntensity / 5;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = shadowIntensity / 10;
  }

  // Draw original image
  ctx.putImageData(imageData, borderWidth, borderWidth);

  // Add caption if provided
  if (caption) {
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Use custom font size and color if provided
    if (captionFont === "Arial") {
      ctx.font = `${captionSize}px ${captionFont}`;
    } else {
      ctx.font = captionFont;
    }
    ctx.fillStyle = captionColor;
    ctx.textAlign = "center";
    ctx.fillText(caption, newWidth / 2, height + borderWidth + 30);
  }

  // Apply slight sepia tone based on intensity
  if (intensity > 0) {
    const factor = intensity / 100;
    const imageData = ctx.getImageData(0, 0, newWidth, newHeight);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      // Skip the border pixels
      const x = (i / 4) % newWidth;
      const y = Math.floor(i / 4 / newWidth);

      if (
        x >= borderWidth &&
        x < width + borderWidth &&
        y >= borderWidth &&
        y < height + borderWidth
      ) {
        // Apply sepia effect to the image area only
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        data[i] = Math.min(
          255,
          r * (1 - 0.3 * factor) + g * 0.3 * factor + b * 0.3 * factor
        );
        data[i + 1] = Math.min(
          255,
          r * 0.2 * factor + g * (1 - 0.2 * factor) + b * 0.2 * factor
        );
        data[i + 2] = Math.min(
          255,
          r * 0.1 * factor + g * 0.1 * factor + b * (1 - 0.1 * factor)
        );
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }
};


// Define the Memories Polaroid template
export const MEMORIES_POLAROID_TEMPLATE = {
  id: "memories",
  name: "Memories Polaroid",
  type: "memories",
  intensity: 60,
  borderWidth: 40,
  borderColor: "#ffffff",
  shadowIntensity: 35,
  rotation: 0,
  captionColor: "#000000",
  captionFont: "20px 'Caveat', cursive",
  hasTape: true,
  hasDate: true,
  thumbnail: "/templates/memories-polaroid.jpg",
} as const;

/**
 * Apply memories polaroid effect with tape
 */
const applyMemoriesPolaroid = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number,
  borderWidth: number,
  borderColor: string,
  shadowIntensity: number,
  caption?: string,
  date?: string
): void => {
  // First apply classic polaroid effect with white border
  applyClassicPolaroid(
    ctx,
    width,
    height,
    0,
    borderWidth,
    borderColor,
    shadowIntensity,
    caption
  );

  // Add masking tape effect
  addTapeEffect(ctx, width, borderWidth);

  // Add date at the bottom if provided
  if (date) {
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    ctx.font = "16px 'Caveat', cursive";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.fillText(date, width / 2 + borderWidth, height + borderWidth + 30);
  }

  // Apply vintage effect (slightly warmer tone)
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const data = imageData.data;
  const factor = intensity / 100;

  for (let i = 0; i < data.length; i += 4) {
    // Skip the border pixels
    const x = (i / 4) % ctx.canvas.width;
    const y = Math.floor(i / 4 / ctx.canvas.width);

    if (
      x >= borderWidth &&
      x < width + borderWidth &&
      y >= borderWidth &&
      y < height + borderWidth
    ) {
      // Apply slightly warmer tone to the image area
      data[i] = Math.min(255, data[i] + 10 * factor); // Increase red
      data[i + 1] = Math.min(255, data[i + 1] + 5 * factor); // Increase green slightly
      data[i + 2] = Math.max(0, data[i + 2] - 5 * factor); // Decrease blue slightly

      // Add slight contrast
      for (let j = 0; j < 3; j++) {
        data[i + j] = Math.max(
          0,
          Math.min(255, (data[i + j] - 128) * (1 + 0.1 * factor) + 128)
        );
      }

      // Add subtle vignette
      const centerX = width / 2 + borderWidth;
      const centerY = height / 2 + borderWidth;
      const distX = (x - centerX) / (width / 2);
      const distY = (y - centerY) / (height / 2);
      const dist = Math.sqrt(distX * distX + distY * distY);

      const vignetteAmount = Math.min(
        1,
        Math.max(0, dist - 0.6) * factor * 1.5
      );

      data[i] = Math.max(0, data[i] - data[i] * vignetteAmount * 0.3);
      data[i + 1] = Math.max(0, data[i + 1] - data[i + 1] * vignetteAmount * 0.3);
      data[i + 2] = Math.max(0, data[i + 2] - data[i + 2] * vignetteAmount * 0.3);
    }
  }

  ctx.putImageData(imageData, 0, 0);
};

/**
 * Add masking tape effect to the polaroid
 */
const addTapeEffect = (
  ctx: CanvasRenderingContext2D,
  width: number,
  borderWidth: number
): void => {
  // Save current context state
  ctx.save();

  // Tape dimensions and position
  const tapeWidth = 60;
  const tapeHeight = 30;
  const tapeX = width / 4; // Position on the left side
  const tapeY = 0;

  // Rotate slightly for a more natural look
  ctx.translate(tapeX + borderWidth, tapeY);
  ctx.rotate(-Math.PI / 30); // Slight rotation

  // Draw semi-transparent tape
  ctx.globalAlpha = 0.6;
  ctx.fillStyle = "#f5f5f5";
  ctx.fillRect(-tapeWidth / 2, 0, tapeWidth, tapeHeight);

  // Add subtle texture to the tape
  ctx.globalAlpha = 0.1;
  for (let i = 0; i < 10; i++) {
    const lineY = Math.random() * tapeHeight;
    ctx.beginPath();
    ctx.moveTo(-tapeWidth / 2, lineY);
    ctx.lineTo(tapeWidth / 2, lineY);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  // Restore context
  ctx.restore();
};

/**
 * Process an image with polaroid effect
 */
export const processImageWithPolaroid = (
  image: string,
  canvas: HTMLCanvasElement,
  selectedTemplate: typeof MEMORIES_POLAROID_TEMPLATE,
  intensity: number,
  rotation: number,
  caption: string,
  captionSize: number = 20,
  callback: (processedImage: string) => void,
  date: string = "20.10.2022" // Default date
): void => {
  const img = new Image();
  img.onload = () => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Optimize canvas size for performance
    const maxDimension = 800; // Limit for faster processing
    let width = img.width;
    let height = img.height;
    if (width > height && width > maxDimension) {
      height = Math.round((height * maxDimension) / width);
      width = maxDimension;
    } else if (height > maxDimension) {
      width = Math.round((width * maxDimension) / height);
      height = maxDimension;
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);

    // Apply Memories Polaroid effect
    applyMemoriesPolaroid(
      ctx,
      width,
      height,
      intensity,
      selectedTemplate.borderWidth,
      selectedTemplate.borderColor,
      selectedTemplate.shadowIntensity,
      caption,
      date
    );

    // Apply rotation if needed
    if (rotation !== 0) {
      const rotatedCanvas = document.createElement("canvas");
      const rotatedCtx = rotatedCanvas.getContext("2d");
      if (!rotatedCtx) {
        callback(canvas.toDataURL("image/jpeg"));
        return;
      }

      const radians = (rotation * Math.PI) / 180;
      const sin = Math.abs(Math.sin(radians));
      const cos = Math.abs(Math.cos(radians));
      const rotWidth = Math.ceil(canvas.width * cos + canvas.height * sin);
      const rotHeight = Math.ceil(canvas.width * sin + canvas.height * cos);

      rotatedCanvas.width = rotWidth;
      rotatedCanvas.height = rotHeight;

      rotatedCtx.translate(rotWidth / 2, rotHeight / 2);
      rotatedCtx.rotate(radians);
      rotatedCtx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);

      callback(rotatedCanvas.toDataURL("image/jpeg"));
    } else {
      callback(canvas.toDataURL("image/jpeg"));
    }
  };
  img.src = image;
};

/**
 * Download the processed image
 */
export const downloadProcessedImage = (processedImage: string): void => {
  const link = document.createElement("a");
  link.download = `memories-polaroid-${Date.now()}.jpg`;
  link.href = processedImage;
  link.click();
};
