"use client";

import { ClockIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DecadesPhotoshootGenerator() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 pb-20">
      {/* Header */}
      <div className="relative overflow-hidden py-12 md:py-20 border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-teal-500/5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl"></div>
        
        <div className="container max-w-full px-4 md:px-8 relative">
          <Link href="/" className="inline-flex items-center gap-2 mb-8 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          
          <div className="flex flex-col space-y-4 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-teal-100 dark:from-blue-900/30 dark:to-teal-900/30 border border-blue-200/50 dark:border-blue-800/30 w-fit mx-auto">
              <ClockIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                Decades Photoshoot Generator
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-center">
              <span className="block bg-gradient-to-r from-blue-600 to-teal-600 text-transparent bg-clip-text mt-1">
                Coming Soon
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-center">
              We&apos;re working hard to bring you this exciting new feature. Transform your photos into different era styles - from vintage 1920s to futuristic looks.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-full px-4 md:px-8 py-24">
        <div className="max-w-xl mx-auto text-center space-y-8">
          <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto">
            <ClockIcon className="h-12 w-12 text-blue-600 dark:text-blue-400" />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Launching Soon</h2>
            <p className="text-muted-foreground">
              Transform your photos into various decade styles:
            </p>
            <ul className="space-y-2">
              <li className="text-sm">• Classic 1920s Black & White Film</li>
              <li className="text-sm">• Vibrant 1960s Psychedelic Style</li>
              <li className="text-sm">• Bold 1980s Neon Aesthetics</li>
              <li className="text-sm">• Nostalgic 2000s Digital Camera Look</li>
              <li className="text-sm">• Futuristic Sci-Fi Designs</li>
            </ul>
          </div>
          
          <Button asChild className="rounded-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-8">
            <Link href="/">
              Back to Mini Apps
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}