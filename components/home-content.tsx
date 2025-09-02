"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight,
  Zap,
  Star,
  LayoutGrid,
  Camera
} from "lucide-react";
import { motion } from "framer-motion";

interface MiniApp {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
  href: string;
  color: string;
  comingSoon?: boolean;
}

const miniApps: MiniApp[] = [
  {
    id: "ai-yearbook-generator",
    title: "AI Yearbook Generator",
    description: "Transform photos into vintage yearbook-style portraits from any decade.",
    icon: <Camera className="h-6 w-6" />,
    image: "/mini-apps/ai-yearbook.jpg",
    href: "/mini-apps/ai-yearbook-generator",
    color: "from-blue-500 to-teal-500",
  },
  {
    id: "ai-mockup-studio",
    title: "AI Mockup Studio",
    description: "Place your images into realistic mockups using text-to-image or image-to-image workflows.",
    icon: <LayoutGrid className="h-6 w-6" />,
    image: "/mini-apps/ai-mockup.jpg",
    href: "/mini-apps/ai-mockup-studio",
    color: "from-purple-500 to-pink-500",
  }
];

export default function HomeContent() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-pink-950/20"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl"></div>
        
        <div className="container max-w-full px-4 md:px-8 relative">
          <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200/50 dark:border-blue-800/30">
              <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                ⚡ Powered by Google Gemini AI
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
                  Creative Tools
                </span>
                <br />
                <span className="text-foreground">
                  Powered by AI
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                A suite of specialized mini-apps to solve your creative needs. Generate beautiful visuals for any purpose in seconds.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-medium px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <a href="#mini-apps" className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Explore Mini Apps
                  <ArrowRight className="h-5 w-5" />
                </a>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">2</div>
                <div className="text-sm text-muted-foreground">Mini Apps</div>
              </div>
              <div className="w-px h-8 bg-border"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">Flash</div>
                <div className="text-sm text-muted-foreground">Gemini AI</div>
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

      {/* Mini Apps Section */}
      <section id="mini-apps" className="py-24 bg-muted/30">
        <div className="container max-w-full px-4 md:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-transparent bg-clip-text">
                Mini Apps Marketplace
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Specialized tools for specific creative needs. Choose the app that fits your project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {miniApps.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <Card className="overflow-hidden h-full border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
                  <div className="relative h-48 w-full overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${app.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
                    {app.comingSoon && (
                      <div className="absolute top-4 right-4 z-10">
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-black/70 text-white">
                          COMING SOON
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`p-6 rounded-full bg-gradient-to-r ${app.color} text-white`}>
                        {app.icon}
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold mb-2">{app.title}</h3>
                    <p className="text-muted-foreground">{app.description}</p>
                  </CardContent>
                  <CardFooter className="px-6 pb-6 pt-0">
                    <Button 
                      asChild 
                      className={`w-full rounded-full bg-gradient-to-r ${app.color} text-white hover:shadow-lg transition-all duration-300`}
                      disabled={app.comingSoon}
                    >
                      <Link href={app.href} className="flex items-center justify-center gap-2">
                        {app.comingSoon ? 'Coming Soon' : 'Get Started'}
                        {!app.comingSoon && <ArrowRight className="h-4 w-4" />}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container max-w-full px-4 md:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Platform Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful tools and features that make PixelPulse stand out
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <Zap className="h-8 w-8 text-blue-500" />,
                title: "Fast Generation",
                description: "Optimized with Google Gemini Flash for quick results in seconds, not minutes."
              },
              {
                icon: <Sparkles className="h-8 w-8 text-purple-500" />,
                title: "High Quality Results",
                description: "AI-powered generation creates professional-looking assets every time."
              },
              {
                icon: <LayoutGrid className="h-8 w-8 text-pink-500" />,
                title: "Specialized Mini-Apps",
                description: "Focused tools for specific needs rather than one-size-fits-all solutions."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center space-y-4"
              >
                <div className="mx-auto w-16 h-16 bg-background rounded-2xl shadow-lg flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-muted/30">
        <div className="container max-w-full px-4 md:px-8">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-2 border-dashed border-purple-200 dark:border-purple-800/30">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="text-4xl">✨</div>
                <h3 className="text-3xl font-bold">Ready to Create Amazing Content?</h3>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Start with our AI Yearbook Generator and transform your photos into vintage portraits
                </p>
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white rounded-full px-8 py-6 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Link href="/mini-apps/ai-yearbook-generator" className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Try AI Yearbook Generator
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}