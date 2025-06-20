import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { 
  Wind, 
  Sparkles, 
  Camera, 
  Clapperboard, 
  Layers, 
  Image, 
  Type,
  Upload,
  ArrowRight,
  Play,
  Zap,
  Star
} from "lucide-react";

export const metadata: Metadata = {
  title: "PhotoFX - Transform Your Photos with Stunning Effects",
  description:
    "Create amazing photo effects instantly. Motion blur, film strips, polaroids, collages, and more. Transform your photos with professional-grade effects in seconds.",
};

const effectCategories = [
  {
    id: "motion-blur",
    title: "Motion Blur",
    description: "Add dynamic movement and energy to your photos",
    icon: <Wind className="h-8 w-8" />,
    gradient: "from-blue-500 via-cyan-500 to-blue-600",
    href: "/effects/motion-blur",
    preview: "🌊",
    tag: "Popular"
  },
  {
    id: "text-behind-image",
    title: "Text Behind Image",
    description: "AI-powered text layering for creative designs",
    icon: <Type className="h-8 w-8" />,
    gradient: "from-indigo-500 via-purple-500 to-indigo-600",
    href: "/effects/text-behind-image",
    preview: "✨",
    tag: "AI Powered"
  },
  {
    id: "film-strip",
    title: "Film Strip",
    description: "Create nostalgic cinema-style photo strips",
    icon: <Camera className="h-8 w-8" />,
    gradient: "from-green-500 via-emerald-500 to-green-600",
    href: "/effects/film-strip",
    preview: "🎬",
    tag: "Classic"
  },
  {
    id: "optical-effects",
    title: "Optical Effects",
    description: "Glitch, chromatic aberration, and visual distortions",
    icon: <Sparkles className="h-8 w-8" />,
    gradient: "from-pink-500 via-rose-500 to-pink-600",
    href: "/effects/optical-effects",
    preview: "🔮",
    tag: "Creative"
  },
  {
    id: "polaroids",
    title: "Polaroid Frames",
    description: "Vintage instant camera photo styling",
    icon: <Image className="h-8 w-8" />,
    gradient: "from-orange-500 via-amber-500 to-orange-600",
    href: "/effects/polaroids",
    preview: "📸",
    tag: "Vintage"
  },
  {
    id: "collages",
    title: "Photo Collages",
    description: "Combine multiple photos into stunning layouts",
    icon: <Layers className="h-8 w-8" />,
    gradient: "from-teal-500 via-cyan-500 to-teal-600",
    href: "/effects/collages",
    preview: "🖼️",
    tag: "Multi-Photo"
  },
  {
    id: "cinematics-effects",
    title: "Cinematic Effects",
    description: "Professional color grading and film looks",
    icon: <Clapperboard className="h-8 w-8" />,
    gradient: "from-purple-500 via-violet-500 to-purple-600",
    href: "/effects/cinematics-effects",
    preview: "🎭",
    tag: "Pro"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-pink-950/20"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl"></div>
        
        <div className="container relative px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200/50 dark:border-blue-800/30">
              <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                ⚡ Instant Photo Effects
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
                  Transform Photos
                </span>
                <br />
                <span className="text-foreground">
                  With Amazing Effects
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Create stunning visual effects in seconds. Motion blur, AI text layering, 
                vintage frames, and more. No design skills required.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-medium px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Link href="/effects" className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Start Creating
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                asChild
                className="rounded-full border-2 font-medium px-8 py-6 text-lg hover:bg-muted/50 transition-all duration-300"
              >
                <Link href="#effects" className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Explore Effects
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">10K+</div>
                <div className="text-sm text-muted-foreground">Photos Enhanced</div>
              </div>
              <div className="w-px h-8 bg-border"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">7</div>
                <div className="text-sm text-muted-foreground">Effect Types</div>
              </div>
              <div className="w-px h-8 bg-border"></div>
              <div className="text-center">
                <div className="flex items-center gap-1 justify-center">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">User Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Effects Grid Section */}
      <section id="effects" className="py-24 relative">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-transparent bg-clip-text">
                Choose Your Effect
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Click any effect below to start transforming your photos instantly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {effectCategories.map((effect) => (
              <div
                key={effect.id}
                className="group hover:-translate-y-2 transition-all duration-300"
              >
                <Link href={effect.href}>
                  <Card className="h-full border-2 border-border/50 hover:border-border transition-all duration-300 hover:shadow-2xl bg-gradient-to-br from-background to-muted/20 overflow-hidden">
                    <CardContent className="p-0">
                      {/* Effect Preview */}
                      <div className={`relative h-32 bg-gradient-to-br ${effect.gradient} flex items-center justify-center overflow-hidden`}>
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="relative z-10 text-white">
                          {effect.icon}
                        </div>
                        <div className="absolute top-3 right-3">
                          <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white">
                            {effect.tag}
                          </span>
                        </div>
                        <div className="absolute -bottom-4 -right-4 text-6xl opacity-20">
                          {effect.preview}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-purple-600 transition-colors">
                          {effect.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                          {effect.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Zap className="h-4 w-4" />
                            <span>Instant</span>
                          </div>
                          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            ))}
          </div>

          {/* Quick Start CTA */}
          <div className="text-center mt-16">
            <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-2 border-dashed border-purple-200 dark:border-purple-800/30">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="text-4xl">🚀</div>
                  <h3 className="text-2xl font-bold">Ready to Transform Your Photos?</h3>
                  <p className="text-muted-foreground">
                    Upload an image and watch the magic happen in seconds
                  </p>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full px-8 py-6 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <Link href="/effects" className="flex items-center gap-2">
                      <Upload className="h-5 w-5" />
                      Start Now - It&apos;s Free
                      <Sparkles className="h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Why Choose PhotoFX?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional-grade effects made simple for everyone
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="h-8 w-8 text-yellow-500" />,
                title: "Lightning Fast",
                description: "Process photos in seconds, not minutes. Our optimized algorithms ensure quick results."
              },
              {
                icon: <Sparkles className="h-8 w-8 text-purple-500" />,
                title: "AI-Powered",
                description: "Advanced AI technology for intelligent background removal and text placement."
              },
              {
                icon: <Star className="h-8 w-8 text-orange-500" />,
                title: "Professional Quality",
                description: "Get results that look like they were made by professional designers."
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center space-y-4"
              >
                <div className="mx-auto w-16 h-16 bg-background rounded-2xl shadow-lg flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
