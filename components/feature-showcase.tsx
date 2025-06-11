"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FeatureItem {
  title: string;
  description: string;
  image: string;
}

interface FeatureShowcaseProps {
  features: FeatureItem[];
  color: string;
  darkColor: string;
}

export default function FeatureShowcase({ features, color, darkColor }: FeatureShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % features.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + features.length) % features.length);
  };

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-xl">
      {/* Main showcase image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            {/* Placeholder for the image - in a real app, you'd have actual images */}
            <div className="relative w-full h-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
              {/* This would be replaced with actual images */}
              <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${color} ${darkColor} opacity-20`}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Image placeholder for {features[currentIndex].title}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm hover:bg-white dark:hover:bg-black/70 text-gray-800 dark:text-gray-200 shadow-md"
          onClick={goToPrevious}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm hover:bg-white dark:hover:bg-black/70 text-gray-800 dark:text-gray-200 shadow-md"
          onClick={goToNext}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Feature title and description */}
      <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
        <h3 className="text-xl font-bold text-white mb-1">
          {features[currentIndex].title}
        </h3>
        <p className="text-white/80 text-sm">
          {features[currentIndex].description}
        </p>
      </div>

      {/* Thumbnail navigation */}
      <div className="absolute -bottom-12 inset-x-0 flex justify-center gap-2 mt-4">
        {features.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              currentIndex === index
                ? `bg-gradient-to-r ${color} shadow-md w-6`
                : "bg-gray-300 dark:bg-gray-700"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
