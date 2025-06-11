import { Metadata } from "next";
import Link from "next/link";
import { 
  Wind, 
  Sparkles, 
  Camera, 
  LayoutGrid, 
  Zap, 
  ArrowRight, 
  Clapperboard
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import FeatureDetail from "@/components/feature-detail";

export const metadata: Metadata = {
  title: "PixelWave - Features",
  description: "Explore our powerful image editing features including motion blur, optical effects, polaroids, and collages.",
};

export default function FeaturesPage() {
  // Feature categories with their details
  const featureCategories = [
    {
      id: "motion-blur",
      title: "Motion Blur",
      description: "Add dynamic motion effects to your still images",
      icon: <Wind className="h-10 w-10" />,
      color: "from-purple-500 to-purple-600",
      darkColor: "dark:from-purple-600 dark:to-purple-800",
      textColor: "text-purple-50",
      features: [
        {
          title: "Directional Blur",
          description: "Apply blur in any direction to create a sense of movement",
          image: "/features/motion-blur-1.jpg"
        },
        {
          title: "Radial Blur",
          description: "Create a zoom effect with blur radiating from the center",
          image: "/features/motion-blur-2.jpg"
        },
        {
          title: "Spin Blur",
          description: "Add rotational blur for a spinning effect",
          image: "/features/motion-blur-3.jpg"
        }
      ]
    },
    {
      id: "optical-effects",
      title: "Optical Effects",
      description: "Apply stunning visual effects to transform your photos",
      icon: <Sparkles className="h-10 w-10" />,
      color: "from-pink-500 to-pink-600",
      darkColor: "dark:from-pink-600 dark:to-pink-800",
      textColor: "text-pink-50",
      features: [
        {
          title: "Chromatic Aberration",
          description: "Split RGB channels for a modern, glitchy look",
          image: "/features/optical-1.jpg"
        },
        {
          title: "Glitch Effect",
          description: "Add digital distortion for a cyberpunk aesthetic",
          image: "/features/optical-2.jpg"
        },
        {
          title: "Vignette",
          description: "Darken the edges to draw focus to the center",
          image: "/features/optical-3.jpg"
        }
      ]
    },
    {
      id: "polaroids",
      title: "Polaroids",
      description: "Transform photos into vintage polaroid-style images",
      icon: <Camera className="h-10 w-10" />,
      color: "from-indigo-500 to-indigo-600",
      darkColor: "dark:from-indigo-600 dark:to-indigo-800",
      textColor: "text-indigo-50",
      features: [
        {
          title: "Classic Frame",
          description: "Add the iconic white border with space for captions",
          image: "/features/polaroid-1.jpg"
        },
        {
          title: "Vintage Filter",
          description: "Apply retro color grading for an authentic look",
          image: "/features/polaroid-2.jpg"
        },
        {
          title: "Custom Captions",
          description: "Add personalized text to your polaroid memories",
          image: "/features/polaroid-3.jpg"
        }
      ]
    },
    {
      id: "collages",
      title: "Collages",
      description: "Create stunning photo arrangements with multiple images",
      icon: <LayoutGrid className="h-10 w-10" />,
      color: "from-amber-500 to-orange-600",
      darkColor: "dark:from-amber-600 dark:to-orange-800",
      textColor: "text-amber-50",
      features: [
        {
          title: "Grid Layouts",
          description: "Arrange photos in various grid patterns",
          image: "/features/collage-1.jpg"
        },
        {
          title: "Smart Positioning",
          description: "Face detection ensures subjects are perfectly framed",
          image: "/features/collage-2.jpg"
        },
        {
          title: "Custom Styling",
          description: "Adjust spacing, borders, and colors to match your style",
          image: "/features/collage-3.jpg"
        }
      ]
    },
    {
      id: "cinematics-effects",
      title: "Cinematics Effects",
      description: "Give your photos a professional cinematic look",
      icon: <Clapperboard className="h-10 w-10" />,
      color: "from-yellow-500 to-amber-600",
      darkColor: "dark:from-yellow-600 dark:to-amber-800",
      textColor: "text-yellow-50",
      features: [
        {
          title: "Film Grain",
          description: "Add authentic film grain for a classic cinema look",
          image: "/features/cinema-1.jpg"
        },
        {
          title: "Letterbox",
          description: "Create widescreen aspect ratios with black bars",
          image: "/features/cinema-2.jpg"
        },
        {
          title: "Color Grading",
          description: "Apply professional color palettes used in Hollywood films",
          image: "/features/cinema-3.jpg"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400/10 dark:bg-purple-900/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-pink-400/10 dark:bg-pink-900/20 rounded-full blur-3xl -z-10"></div>

        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800/30 mb-4">
              <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="text-xs font-medium text-purple-800 dark:text-purple-300">Powerful Editing Tools</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-400 text-transparent bg-clip-text">
              Transform Your Photos
            </h1>
            <p className="max-w-[800px] text-muted-foreground md:text-xl/relaxed">
              Discover our suite of powerful image editing features designed to help you create stunning visuals in seconds
            </p>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900/30">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featureCategories.map((category) => (
              <Link href={`#${category.id}`} key={category.id}>
                <Card className="group border-none rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                  <CardHeader className={`bg-gradient-to-br ${category.color} ${category.darkColor} p-6`}>
                    <div className="p-3 w-fit rounded-xl bg-white/20 backdrop-blur-sm mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <div className={`${category.textColor}`}>
                        {category.icon}
                      </div>
                    </div>
                    <CardTitle className={`${category.textColor} text-xl font-bold`}>{category.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <CardDescription className="text-base leading-relaxed">{category.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Feature Sections */}
      {featureCategories.map((category) => (
        <FeatureDetail 
          key={category.id}
          id={category.id}
          title={category.title}
          description={category.description}
          icon={category.icon}
          color={category.color}
          darkColor={category.darkColor}
          textColor={category.textColor}
          features={category.features}
        />
      ))}

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 -z-10"></div>
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ready to Transform Your Photos?
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
              Start creating stunning visuals with our powerful editing tools
            </p>
            <Button asChild size="lg" className="mt-6 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-500 hover:from-purple-700 hover:via-pink-600 hover:to-indigo-600 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Link href="/editor" className="px-8 py-6 text-base font-medium">
                Try PixelWave Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
