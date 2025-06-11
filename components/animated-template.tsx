"use client";

import { useEffect, useRef, useState } from "react";
import { ANIMATION_PRESETS } from "@/lib/animated-templates";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface AnimatedTemplateProps {
  id: string;
  name: string;
  animationType: keyof typeof ANIMATION_PRESETS;
  imageSrc: string;
  aspectRatio: string;
}

const AnimatedTemplate = ({
  id,
  name,
  animationType,
  imageSrc,
  aspectRatio,
}: AnimatedTemplateProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Determine aspect ratio class
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "9:16":
        return "aspect-[9/16]";
      case "16:9":
        return "aspect-[16/9]";
      case "4:5":
        return "aspect-[4/5]";
      case "1:1":
      default:
        return "aspect-square";
    }
  };
  
  useEffect(() => {
    let isMounted = true;
    
    // Import GSAP dynamically to avoid SSR issues
    const loadGSAP = async () => {
      try {
        // Only load GSAP once
        if (!isLoaded && containerRef.current) {
          const gsapModule = await import("gsap");
          const gsap = gsapModule.default;
          
          // Get the animation code from presets
          const animationCode = ANIMATION_PRESETS[animationType];
          
          // Create a function from the animation code string
          // This is a simplified approach - in production you'd want more safety checks
          try {
            // Create a function that has access to gsap and the container
            const animationFunction = new Function('gsap', 'container', `
              const timeline = ${animationCode};
              return timeline;
            `);
            
            // Execute the animation function with gsap and container
            if (containerRef.current && isMounted) {
              animationRef.current = animationFunction(gsap, containerRef.current);
              setIsLoaded(true);
            }
          } catch (error) {
            console.error("Error applying animation:", error);
          }
        }
      } catch (error) {
        console.error("Error loading GSAP:", error);
      }
    };
    
    loadGSAP();
    
    // Clean up on unmount
    return () => {
      isMounted = false;
      if (animationRef.current && animationRef.current.kill) {
        animationRef.current.kill();
        animationRef.current = null;
      }
    };
  }, [animationType, isLoaded]);
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div 
          ref={containerRef} 
          className={`relative ${getAspectRatioClass()} overflow-hidden bg-muted`}
          id={`animated-template-${id}`}
        >
          {/* Main image container */}
          <div className="image-container absolute inset-0">
            <Image
              src={imageSrc || "/placeholder.jpg"}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
          {/* Text overlay for animations that use it */}
          <div className="text-overlay absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
            <h3 className="text-lg font-bold">{name}</h3>
          </div>
          
          {/* Elements for specific animation types */}
          {animationType === "beat-match" && (
            <div className="beat-element absolute inset-0 border-4 border-white opacity-50"></div>
          )}
          
          {animationType === "glitch-transition" && (
            <>
              <div className="glitch-element absolute inset-0 bg-transparent"></div>
              <div className="rgb-split-r absolute inset-0 mix-blend-screen bg-red-500 opacity-30"></div>
              <div className="rgb-split-g absolute inset-0 mix-blend-screen bg-green-500 opacity-30"></div>
              <div className="rgb-split-b absolute inset-0 mix-blend-screen bg-blue-500 opacity-30"></div>
            </>
          )}
          
          {animationType === "kinetic-text" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-4xl font-bold">
                {name.split("").map((char, index) => (
                  <span key={index} className="kinetic-char inline-block">{char}</span>
                ))}
              </div>
            </div>
          )}
          
          {animationType === "parallax-scroll" && (
            <>
              <div className="parallax-layer-1 absolute inset-0 bg-gradient-to-b from-transparent to-purple-500/30"></div>
              <div className="parallax-layer-2 absolute inset-0 bg-gradient-to-t from-transparent to-pink-500/30"></div>
              <div className="parallax-layer-3 absolute inset-0 bg-gradient-to-r from-transparent to-blue-500/30"></div>
            </>
          )}
        </div>
        
        <div className="p-4">
          <Button className="w-full" variant="outline">
            Use Template
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnimatedTemplate;