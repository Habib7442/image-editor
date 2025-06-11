"use client";

import { useRef } from "react";
import { Plus } from "lucide-react";
import { FilmStripTemplate, AspectRatio } from "@/lib/film-strip-templates";

interface FilmStripProps {
  mainImage: string | null;
  stripImages: string[];
  rotation: number;
  template: FilmStripTemplate;
  aspectRatio: AspectRatio;
  onMainImageClick: () => void;
  onStripImageClick: () => void;
}

export function FilmStrip({
  mainImage,
  stripImages,
  rotation,
  template,
  aspectRatio,
  onMainImageClick,
  onStripImageClick,
}: FilmStripProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Determine strip position based on template
  const stripPosition = template.stripPosition;
  const stripColor = template.stripColor;
  const backgroundColor = template.backgroundColor;
  const mainImageBorderColor = template.mainImageBorderColor;
  const mainImageBorderWidth = template.mainImageBorderWidth;

  // Function to calculate height based on aspect ratio
  const getHeightForAspectRatio = (width: number, aspectRatio: AspectRatio): string => {
    switch (aspectRatio) {
      case "1:1":
        return `${width}px`; // Square
      case "4:5":
        return `${width * 1.25}px`; // 4:5 ratio (portrait)
      default:
        return `${width}px`; // Default to square
    }
  };

  // Get container dimensions based on aspect ratio
  const getContainerDimensions = (aspectRatio: AspectRatio) => {
    // Base width remains constant
    const baseWidth = 700;

    switch (aspectRatio) {
      case "1:1":
        return { width: baseWidth, height: baseWidth }; // Square
      case "4:5":
        return { width: baseWidth, height: baseWidth * 1.25 }; // 4:5 ratio
      default:
        return { width: baseWidth, height: baseWidth }; // Default to square
    }
  };

  const { width, height } = getContainerDimensions(aspectRatio);

  // Render the film strip component
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden"
        style={{
          backgroundColor,
          maxWidth: `${width}px`,
          height: `${height}px`
        }}
      >
        <div className="relative h-full">
          {/* Left Film Strip - conditionally rendered */}
          {(stripPosition === "left" || stripPosition === "both") && (
            <div className="absolute left-0 top-0 bottom-0 w-48" style={{ backgroundColor: stripColor, height: '100%' }}>
              {/* Left Perforations */}
              <div className="absolute inset-y-0 left-1 w-2 flex flex-col items-center justify-between pt-2 pb-2">
                {[...Array(20)].map((_, i) => (
                  <div key={`left-perf-${i}`} className="perforation"></div>
                ))}
              </div>

              {/* Right Perforations */}
              <div className="absolute inset-y-0 right-1 w-2 flex flex-col items-center justify-between pt-2 pb-2">
                {[...Array(20)].map((_, i) => (
                  <div key={`right-perf-${i}`} className="perforation"></div>
                ))}
              </div>

              {/* Images in the left film strip */}
              <div className="absolute inset-y-0 left-[10px] right-[10px] flex flex-col justify-between py-6 space-y-2">
                {[...Array(5)].map((_, index) => (
                  <div
                    key={`left-strip-img-${index}`}
                    className="w-full relative group aspect-[5/6] mx-auto" // Wider aspect ratio for strip images, centered
                    style={{ backgroundColor: stripColor }}
                    onClick={onStripImageClick}
                  >
                    {stripImages[index] ? (
                      <div className="w-full h-full overflow-hidden">
                        <img
                          src={stripImages[index]}
                          alt={`Film strip image ${index + 1}`}
                          className="w-full h-full object-cover"
                          style={{ objectPosition: 'center' }}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: stripColor }}>
                        <Plus className="h-8 w-8 text-gray-400" />
                      </div>
                    )}

                    {/* Overlay with + sign on hover */}
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <Plus className="h-8 w-8 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Right Film Strip - conditionally rendered */}
          {(stripPosition === "right" || stripPosition === "both") && (
            <div className="absolute right-0 top-0 bottom-0 w-48" style={{ backgroundColor: stripColor, height: '100%' }}>
              {/* Left Perforations */}
              <div className="absolute inset-y-0 left-1 w-2 flex flex-col items-center justify-between pt-2 pb-2">
                {[...Array(20)].map((_, i) => (
                  <div key={`right-strip-left-perf-${i}`} className="perforation"></div>
                ))}
              </div>

              {/* Right Perforations */}
              <div className="absolute inset-y-0 right-1 w-2 flex flex-col items-center justify-between pt-2 pb-2">
                {[...Array(20)].map((_, i) => (
                  <div key={`right-strip-right-perf-${i}`} className="perforation"></div>
                ))}
              </div>

              {/* Images in the right film strip */}
              <div className="absolute inset-y-0 left-[10px] right-[10px] flex flex-col justify-between py-6 space-y-2">
                {[...Array(5)].map((_, index) => (
                  <div
                    key={`right-strip-img-${index}`}
                    className="w-full relative group aspect-[5/6] mx-auto" // Wider aspect ratio for strip images, centered
                    style={{ backgroundColor: stripColor }}
                    onClick={onStripImageClick}
                  >
                    {stripImages[index] ? (
                      <div className="w-full h-full overflow-hidden">
                        <img
                          src={stripImages[index]}
                          alt={`Film strip image ${index + 1}`}
                          className="w-full h-full object-cover"
                          style={{ objectPosition: 'center' }}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: stripColor }}>
                        <Plus className="h-8 w-8 text-gray-400" />
                      </div>
                    )}

                    {/* Overlay with + sign on hover */}
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <Plus className="h-8 w-8 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Large Image - positioned in the foreground with higher z-index */}
          <div className={`absolute inset-0 flex items-center justify-center z-10 ${stripPosition === "right" ? "mr-12" : stripPosition === "both" ? "" : "ml-12"}`}
               style={{ height: '100%' }}>
            <div
              className="relative shadow-lg overflow-hidden group"
              style={{
                transform: `rotate(${rotation}deg)`,
                transformOrigin: 'center center',
                borderWidth: mainImageBorderWidth,
                borderStyle: 'solid',
                borderColor: mainImageBorderColor,
                width: '384px', // Base size (w-96)
                height: getHeightForAspectRatio(384, aspectRatio)
              }}
              onClick={onMainImageClick}
            >
              {mainImage ? (
                <div className="w-full h-full overflow-hidden">
                  <img
                    src={mainImage}
                    alt="Large image"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: 'center' }}
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-black">
                  <Plus className="h-16 w-16 text-gray-400" />
                </div>
              )}

              {/* Overlay with + sign on hover */}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <Plus className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
