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

  // Instagram post dimensions - more compact and social media friendly
  const stripWidth = 120; // Reduced from 192 to make it more compact
  const mainImageWidth = 280; // Reduced from 384 to make it more Instagram-like
  const padding = 20; // Reduced padding for tighter layout
  
  // Calculate total width needed based on strip position
  let totalWidth = mainImageWidth + padding * 2; // Base width with padding
  
  if (template.stripPosition === 'left' || template.stripPosition === 'right') {
    totalWidth += stripWidth; // Add one strip width
  } else if (template.stripPosition === 'both') {
    totalWidth += stripWidth * 2; // Add two strip widths
  }

  // Set canvas dimensions - Instagram post style (more compact)
  canvas.width = totalWidth;

  // Adjust canvas height based on aspect ratio - keep it more compact
  switch (aspectRatio) {
    case "1:1":
      canvas.height = totalWidth; // Square
      break;
    case "4:5":
      canvas.height = totalWidth * 1.25; // 4:5 ratio (Instagram portrait)
      break;
    default:
      canvas.height = totalWidth; // Default to square
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
      const stripHeight = canvas.height; // Use canvas height for strip height
      const stripPosition = template.stripPosition;
      const stripColor = template.stripColor;

      // Function to draw a film strip at the specified position
      const drawStrip = (position: 'left' | 'right') => {
        const stripX = position === 'left' ? 0 : canvas.width - stripWidth;

        // Draw strip background
        ctx.fillStyle = stripColor;
        ctx.fillRect(stripX, 0, stripWidth, stripHeight);

        // Draw perforations on both sides - adjusted for smaller strip
        const drawPerforations = (x: number) => {
          ctx.fillStyle = '#d1d5db'; // gray-300
          // Calculate spacing based on strip height to maintain consistent look
          const perforationCount = Math.floor(stripHeight / 25); // Adjust perforation count based on height
          const spacing = stripHeight / perforationCount;

          for (let i = 0; i < perforationCount; i++) {
            const y = i * spacing;
            ctx.fillRect(x, y + 2, 4, 8); // Smaller perforations for compact design
          }
        };

        // Draw left and right perforations
        drawPerforations(stripX + 3); // Left perforations
        drawPerforations(stripX + stripWidth - 7); // Right perforations

        // Draw strip images - adjust spacing based on strip height
        const imageHeight = stripHeight / 5; // Divide strip height by number of images
        // Calculate width to maximize space but avoid overlapping with perforations
        const imageWidth = stripWidth - 14; // Leave space for perforations (reduced)
        const imageX = stripX + 7; // Center between perforations

        // Calculate aspect ratio for strip images (use 3:4 vertical ratio for Instagram style)
        const stripImageAspectRatio = 0.75; // 3:4 aspect ratio (width:height) - Instagram style
        // Make sure the height is consistent across all aspect ratios
        const adjustedImageHeight = Math.min(imageHeight - 12, stripHeight / 6); // Account for padding
        const adjustedImageWidth = adjustedImageHeight * stripImageAspectRatio;

        for (let i = 0; i < 5; i++) {
          const y = i * imageHeight + 6; // Reduced vertical padding

          // Draw image if available, otherwise draw placeholder
          if (i < stripImgs.length) {
            // Draw image with proper aspect ratio preservation and strict containment
            const img = stripImgs[i];
            const imgWidth = img.width;
            const imgHeight = img.height;
            const frameWidth = adjustedImageWidth;
            const frameHeight = adjustedImageHeight;

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
            ctx.fillRect(placeholderX, placeholderY, adjustedImageWidth, adjustedImageHeight);
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

      // Now draw the main image - calculate position to center it properly
      const mainImageHeight = getHeightForAspectRatio(mainImageWidth, aspectRatio);
      
      // Calculate the available space for the main image
      let availableWidth = canvas.width;
      let leftOffset = 0;
      
      if (stripPosition === 'left') {
        availableWidth -= stripWidth;
        leftOffset = stripWidth;
      } else if (stripPosition === 'right') {
        availableWidth -= stripWidth;
      } else if (stripPosition === 'both') {
        availableWidth -= stripWidth * 2;
        leftOffset = stripWidth;
      }
      
      // Center the main image in the available space
      const mainImageX = leftOffset + (availableWidth - mainImageWidth) / 2;
      const mainImageY = (canvas.height - mainImageHeight) / 2;

      // Save context state
      ctx.save();

      // Translate to the center of where we want the image
      ctx.translate(mainImageX + mainImageWidth / 2, mainImageY + mainImageHeight / 2);

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
