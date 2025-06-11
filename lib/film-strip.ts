import { FilmStripTemplate, AspectRatio } from './film-strip-templates';

/**
 * Process images into a film strip layout
 * @param mainImage - The main large image
 * @param stripImages - Array of images for the film strip
 * @param rotation - Rotation angle for the main image
 * @param template - The selected film strip template
 * @param aspectRatio - The selected aspect ratio
 * @param callback - Callback function to receive the processed image
 */
export const processFilmStrip = (
  mainImage: string,
  stripImages: string[],
  rotation: number,
  template: FilmStripTemplate,
  aspectRatio: AspectRatio,
  callback: (processedImage: string) => void
): void => {
  // Helper function to calculate height based on aspect ratio
  const getHeightForAspectRatio = (width: number, aspectRatio: AspectRatio): number => {
    switch (aspectRatio) {
      case "1:1":
        return width; // Square
      case "4:5":
        return width * 1.25; // 4:5 ratio (portrait)
      default:
        return width; // Default to square
    }
  };

  // Create a canvas element
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    console.error('Could not get canvas context');
    return;
  }

  // Set canvas dimensions based on aspect ratio
  const baseWidth = 800;
  canvas.width = baseWidth;

  // Adjust canvas height based on aspect ratio
  switch (aspectRatio) {
    case "1:1":
      canvas.height = baseWidth; // Square
      break;
    case "4:5":
      canvas.height = baseWidth * 1.25; // 4:5 ratio
      break;
    default:
      canvas.height = baseWidth; // Default to square
  }

  // Fill background with template background color
  ctx.fillStyle = template.backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // No speckle pattern needed

  // Load the main image
  const mainImg = new Image();
  mainImg.onload = () => {
    // Load strip images
    const stripImgs: HTMLImageElement[] = [];
    let loadedCount = 0;

    const drawFilmStrip = () => {
      const stripWidth = 192; // w-48
      const stripHeight = canvas.height; // Use canvas height for strip height
      const stripPosition = template.stripPosition;
      const stripColor = template.stripColor;

      // Function to draw a film strip at the specified position
      const drawStrip = (position: 'left' | 'right') => {
        const stripX = position === 'left' ? 0 : canvas.width - stripWidth;

        // Draw strip background
        ctx.fillStyle = stripColor;
        ctx.fillRect(stripX, 0, stripWidth, stripHeight);

        // Draw perforations on both sides
        const drawPerforations = (x: number) => {
          ctx.fillStyle = '#d1d5db'; // gray-300
          // Calculate spacing based on strip height to maintain consistent look
          const perforationCount = 20; // Target number of perforations
          const spacing = stripHeight / perforationCount;

          for (let i = 0; i < perforationCount; i++) {
            const y = i * spacing;
            ctx.fillRect(x, y + 2, 6, 12);
          }
        };

        // Draw left and right perforations
        drawPerforations(stripX + 4); // Left perforations
        drawPerforations(stripX + stripWidth - 10); // Right perforations

        // Draw strip images - adjust spacing based on strip height
        const imageHeight = stripHeight / 5; // Divide strip height by number of images
        // Calculate width to maximize space but avoid overlapping with perforations
        const imageWidth = stripWidth - 20; // Leave just enough space for perforations
        const imageX = stripX + 10; // Center between perforations

        // Calculate aspect ratio for strip images (use 5:6 vertical ratio)
        const stripImageAspectRatio = 0.833; // 5:6 aspect ratio (width:height)
        // Make sure the height is consistent across all aspect ratios
        const adjustedImageHeight = Math.min(imageHeight - 16, stripHeight / 6); // Account for padding and ensure consistent size
        const adjustedImageWidth = adjustedImageHeight * stripImageAspectRatio;

        for (let i = 0; i < 5; i++) {
          const y = i * imageHeight + 8; // Added vertical padding

          // Draw image if available, otherwise draw placeholder
          if (i < stripImgs.length) {
            // Draw image with proper aspect ratio preservation and strict containment
            const img = stripImgs[i];
            const imgWidth = img.width;
            const imgHeight = img.height;
            const frameWidth = adjustedImageWidth; // Use adjusted width for 3:4 aspect ratio
            const frameHeight = adjustedImageHeight; // Use adjusted height for 3:4 aspect ratio

            // Calculate dimensions to maintain aspect ratio and COVER the frame
            let drawWidth, drawHeight, offsetX = 0, offsetY = 0;

            const imgRatio = imgWidth / imgHeight;
            const frameRatio = frameWidth / frameHeight;

            // For strip images, always use COVER to fill the frame without blank space
            if (imgRatio > frameRatio) {
              // Image is wider than frame (relative to height)
              drawHeight = frameHeight;
              drawWidth = drawHeight * imgRatio;
              offsetX = (frameWidth - drawWidth) / 2;
            } else {
              // Image is taller than frame (relative to width)
              drawWidth = frameWidth;
              drawHeight = drawWidth / imgRatio;
              offsetY = (frameHeight - drawHeight) / 2;
            }

            // Create a clipping path for the frame
            ctx.save();
            ctx.beginPath();
            // Center the frame in the available space horizontally and vertically
            const frameX = imageX + (imageWidth - frameWidth) / 2;
            const frameY = y + (imageHeight - frameHeight) / 2; // Center vertically in the cell
            ctx.rect(frameX, frameY, frameWidth, frameHeight);
            ctx.clip();

            // Draw the image centered in the frame
            ctx.drawImage(img, frameX + offsetX, frameY + offsetY, drawWidth, drawHeight);

            // Restore context to remove clipping
            ctx.restore();
          } else {
            ctx.fillStyle = stripColor; // Use strip color for placeholder
            // Center the placeholder in the frame horizontally and vertically
            const placeholderX = imageX + (imageWidth - adjustedImageWidth) / 2;
            const placeholderY = y + (imageHeight - adjustedImageHeight) / 2; // Center vertically
            ctx.fillRect(placeholderX, placeholderY, adjustedImageWidth, adjustedImageHeight); // Use adjusted dimensions
          }
        }
      };

      // Draw strips based on template position
      if (stripPosition === 'left' || stripPosition === 'both') {
        drawStrip('left');
      }

      if (stripPosition === 'right' || stripPosition === 'both') {
        drawStrip('right');
      }

      // Now draw the main image on top
      const mainImageWidth = 384; // w-96
      const mainImageHeight = getHeightForAspectRatio(mainImageWidth, aspectRatio);
      const mainImageX = canvas.width / 2 - mainImageWidth / 2; // Center horizontally
      const mainImageY = canvas.height / 2 - mainImageHeight / 2; // Center vertically

      // Adjust position based on strip position
      let positionOffsetX = 0;
      if (stripPosition === 'left') {
        positionOffsetX = 48; // Move right when strip is on the left
      } else if (stripPosition === 'right') {
        positionOffsetX = -48; // Move left when strip is on the right
      }

      // Save context state
      ctx.save();

      // Translate to the center of where we want the image
      ctx.translate(mainImageX + mainImageWidth / 2 + positionOffsetX, mainImageY + mainImageHeight / 2);

      // Rotate
      ctx.rotate((rotation * Math.PI) / 180);

      // Draw border using template border color and width
      ctx.fillStyle = template.mainImageBorderColor;
      const borderWidth = template.mainImageBorderWidth;
      ctx.fillRect(
        -mainImageWidth / 2 - borderWidth,
        -mainImageHeight / 2 - borderWidth,
        mainImageWidth + borderWidth * 2,
        mainImageHeight + borderWidth * 2
      );

      // Calculate dimensions to maintain aspect ratio and COVER the frame
      const imgWidth = mainImg.width;
      const imgHeight = mainImg.height;
      const frameWidth = mainImageWidth;
      const frameHeight = mainImageHeight;

      let drawWidth, drawHeight, offsetX = 0, offsetY = 0;

      const imgRatio = imgWidth / imgHeight;
      const frameRatio = frameWidth / frameHeight;

      // For main image, use COVER to fill the frame without blank space
      if (imgRatio > frameRatio) {
        // Image is wider than frame (relative to height)
        drawHeight = frameHeight;
        drawWidth = drawHeight * imgRatio;
        offsetX = (frameWidth - drawWidth) / 2;
      } else {
        // Image is taller than frame (relative to width)
        drawWidth = frameWidth;
        drawHeight = drawWidth / imgRatio;
        offsetY = (frameHeight - drawHeight) / 2;
      }

      // Create a clipping path for the frame
      ctx.save();
      ctx.beginPath();
      ctx.rect(-frameWidth / 2, -frameHeight / 2, frameWidth, frameHeight);
      ctx.clip();

      // Draw image with proper aspect ratio preservation
      ctx.drawImage(mainImg, -frameWidth / 2 + offsetX, -frameHeight / 2 + offsetY, drawWidth, drawHeight);

      // Restore the clipping context
      ctx.restore();

      // Restore context state
      ctx.restore();

      // Convert canvas to image
      const processedImage = canvas.toDataURL('image/jpeg');
      callback(processedImage);
    };

    // If there are no strip images, draw the film strip immediately
    if (stripImages.length === 0) {
      drawFilmStrip();
      return;
    }

    // Load strip images
    stripImages.forEach((src, index) => {
      const img = new Image();
      img.onload = () => {
        stripImgs[index] = img;
        loadedCount++;

        // Draw when all images are loaded
        if (loadedCount === stripImages.length) {
          drawFilmStrip();
        }
      };
      img.src = src;
    });
  };

  mainImg.src = mainImage;
};

/**
 * Download the processed film strip image
 */
export const downloadProcessedImage = (processedImage: string): void => {
  const link = document.createElement('a');
  link.download = `film-strip-${Date.now()}.jpg`;
  link.href = processedImage;
  link.click();
};
