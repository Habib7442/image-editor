"use client";

import { useEffect, useRef, useState } from "react";
import { ANIMATED_TEMPLATES } from "@/lib/animated-templates";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";

export default function AnimatedTemplatesShowcase() {
  // Get featured templates (those marked as new)
  const featuredTemplates = ANIMATED_TEMPLATES.filter(template => template.isNew).slice(0, 3);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  // Load GSAP dynamically on client side
  useEffect(() => {
    if (isVisible) {
      const loadGSAP = async () => {
        try {
          const gsapModule = await import("gsap");
          const gsap = gsapModule.default;
          
          // Simple animation for the section title
          gsap.from(".animated-title", {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
          });
          
          // Staggered animation for the template cards
          gsap.from(".template-card", {
            y: 100,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "back.out(1.7)"
          });
        } catch (error) {
          console.error("Error loading GSAP:", error);
        }
      };
      
      loadGSAP();
    }
  }, [isVisible]);

  return (
    <section ref={containerRef} className="py-24 relative overflow-hidden bg-gradient-to-br from-purple-50/50 via-white to-pink-50/50 dark:from-purple-950/30 dark:via-background dark:to-pink-950/30">
      {/* Decorative elements */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-white to-transparent dark:from-background dark:to-transparent -z-10"></div>
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-white to-transparent dark:from-background dark:to-transparent -z-10"></div>
      
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800/30 mb-4">
            <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-medium text-purple-800 dark:text-purple-300">
              New Feature
            </span>
          </div>
          <div className="space-y-3 animated-title">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-400 text-transparent bg-clip-text">
              Animated Templates
            </h2>
            <p className="max-w-[800px] text-muted-foreground md:text-xl/relaxed">
              Create viral content for Instagram and Snapchat with stunning animated templates
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {featuredTemplates.map((template, index) => (
            <div
              key={template.id}
              className={`template-card group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative aspect-[9/16] w-full overflow-hidden bg-muted">
                <Image
                  src={template.thumbnail}
                  alt={template.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                />
                
                {/* Overlay with gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80"></div>
                
                {/* Platform badge */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full capitalize">
                  {template.platform}
                </div>
                
                {/* New badge if applicable */}
                {template.isNew && (
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs px-2 py-1 rounded-full">
                    New
                  </div>
                )}
                
                {/* Template info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white text-left">
                  <h3 className="font-bold text-lg mb-1">{template.name}</h3>
                  <p className="text-sm text-white/80 line-clamp-2 mb-3">{template.description}</p>
                  <Button 
                    asChild 
                    size="sm" 
                    className="bg-white text-black hover:bg-white/90 transition-all duration-300"
                  >
                    <Link href={template.href || `/templates/editor/animated/${template.id}`}>
                      Try it now
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button 
            asChild 
            size="lg" 
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white group"
          >
            <Link href="/templates" className="flex items-center gap-2">
              Explore all templates
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}