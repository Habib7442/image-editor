"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { 
  Wind, 
  Sparkles, 
  Camera, 
  Film,
  Clapperboard,
  LayoutGrid,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function EffectsPage() {
  // Effects categories with their details
  const effectsCategories = [
    {
      id: "motion-blur",
      title: "Motion Blur",
      description: "Add dynamic motion effects to your still images",
      icon: <Wind className="h-10 w-10" />,
      color: "from-purple-500 to-purple-600",
      darkColor: "dark:from-purple-600 dark:to-purple-800",
      textColor: "text-purple-50",
      href: "/effects/motion-blur"
    },
    {
      id: "optical-effects",
      title: "Optical Effects",
      description: "Apply stunning optical effects like chromatic aberration and glitch",
      icon: <Sparkles className="h-10 w-10" />,
      color: "from-indigo-500 to-indigo-600",
      darkColor: "dark:from-indigo-600 dark:to-indigo-800",
      textColor: "text-indigo-50",
      href: "/effects/optical-effects"
    },
    {
      id: "cinematics-effects",
      title: "Cinematics Effects",
      description: "Give your photos a professional cinematic look",
      icon: <Clapperboard className="h-10 w-10" />,
      color: "from-yellow-500 to-amber-600",
      darkColor: "dark:from-yellow-600 dark:to-amber-800",
      textColor: "text-yellow-50",
      href: "/effects/cinematics-effects"
    },
    {
      id: "polaroids",
      title: "Polaroids",
      description: "Create vintage polaroid-style photos with custom captions",
      icon: <Camera className="h-10 w-10" />,
      color: "from-pink-500 to-rose-600",
      darkColor: "dark:from-pink-600 dark:to-rose-800",
      textColor: "text-pink-50",
      href: "/effects/polaroids"
    },
    {
      id: "collages",
      title: "Collages",
      description: "Combine multiple photos into beautiful collage layouts",
      icon: <LayoutGrid className="h-10 w-10" />,
      color: "from-emerald-500 to-teal-600",
      darkColor: "dark:from-emerald-600 dark:to-teal-800",
      textColor: "text-emerald-50",
      href: "/effects/collages"
    },
    {
      id: "film-strip",
      title: "Film Strip",
      description: "Create vintage film strip layouts with your photos",
      icon: <Film className="h-10 w-10" />,
      color: "from-blue-500 to-indigo-600",
      darkColor: "dark:from-blue-600 dark:to-indigo-800",
      textColor: "text-blue-50",
      href: "/effects/film-strip"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center gap-2 p-6 border-b border-gray-800">
        <Button variant="ghost" size="icon" asChild className="rounded-full text-gray-400 hover:text-white hover:bg-gray-800">
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-transparent bg-clip-text">
          Photo Effects
        </h1>
      </div>

      {/* Main Content */}
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-2">Transform Your Photos</h2>
            <p className="text-gray-400 mb-12">
              Choose from our collection of professional effects to enhance your images
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {effectsCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={category.href}>
                  <Card className="group border-none rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full bg-gray-900 border border-gray-800">
                    <CardHeader className={`bg-gradient-to-br ${category.color} ${category.darkColor} p-6`}>
                      <div className="p-3 w-fit rounded-xl bg-white/20 backdrop-blur-sm mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                        <div className={`${category.textColor}`}>
                          {category.icon}
                        </div>
                      </div>
                      <CardTitle className={`${category.textColor} text-xl font-bold`}>{category.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <CardDescription className="text-base leading-relaxed text-gray-300">{category.description}</CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
