"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isGenerating: boolean;
}

export default function PromptInput({
  value,
  onChange,
  onSubmit,
  isGenerating
}: PromptInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Submit on Ctrl+Enter or Cmd+Enter
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !isGenerating) {
        onSubmit();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSubmit, isGenerating]);

  return (
    <div className="w-full space-y-2">
      <div
        className={`relative border-2 rounded-xl transition-all duration-300 ${
          isFocused
            ? "border-purple-500 shadow-lg shadow-purple-100 dark:shadow-purple-900/20"
            : "border-gray-300 dark:border-gray-700"
        }`}
      >
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Describe what you want to create... e.g., 'Create a YouTube thumbnail with a chef cooking pasta' or 'Design a professional thumbnail for a tech tutorial video'"
          className="w-full h-32 p-4 bg-transparent resize-none focus:outline-none text-base"
          disabled={isGenerating}
        />
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`absolute bottom-3 right-3 rounded-full px-4 py-2 text-white font-medium flex items-center gap-2 ${
            isGenerating
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          }`}
          onClick={onSubmit}
          disabled={isGenerating}
        >
          <Sparkles className="w-4 h-4" />
          {isGenerating ? "Generating..." : "Generate"}
        </motion.button>
      </div>
      
      <div className="text-xs text-gray-500 dark:text-gray-400 px-2">
        <span className="font-medium">Pro tip:</span> Press Ctrl+Enter to generate
      </div>
    </div>
  );
}