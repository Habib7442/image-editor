import { Wind, Sparkles, Camera, Clapperboard, Layers, Image } from "lucide-react";
import Link from "next/link";

interface EffectCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  href: string;
}

const effects: EffectCard[] = [
  {
    id: "animated-templates",
    title: "Animated Templates",
    description: "Create viral content with stunning animated templates for Instagram and Snapchat",
    icon: <Sparkles className="h-6 w-6" />,
    gradient: "from-purple-500 to-pink-500",
    href: "/templates"
  },
  {
    id: "motion-blur",
    title: "Motion Blur",
    description: "Add dynamic motion effects to make your photos come alive with movement",
    icon: <Wind className="h-6 w-6" />,
    gradient: "from-blue-500 to-purple-500",
    href: "/effects/motion-blur"
  },
  {
    id: "polaroids",
    title: "Polaroids",
    description: "Create vintage polaroid-style photos with custom captions",
    icon: <Image className="h-6 w-6" />,
    gradient: "from-pink-500 to-rose-500",
    href: "/effects/polaroids"
  },
  {
    id: "optical-effects",
    title: "Optical Effects",
    description: "Apply stunning visual effects like chromatic aberration, glitch, and more",
    icon: <Sparkles className="h-6 w-6" />,
    gradient: "from-pink-500 to-orange-500",
    href: "/effects/optical-effects"
  },
  {
    id: "film-strip",
    title: "Film Strip",
    description: "Create nostalgic film strip layouts with your photos",
    icon: <Camera className="h-6 w-6" />,
    gradient: "from-green-500 to-teal-500",
    href: "/effects/film-strip"
  },
  {
    id: "cinematics-effects",
    title: "Cinematic Effects",
    description: "Transform your photos with professional cinematic color grading",
    icon: <Clapperboard className="h-6 w-6" />,
    gradient: "from-amber-500 to-red-500",
    href: "/effects/cinematics-effects"
  },
  {
    id: "collages",
    title: "Collages",
    description: "Create beautiful photo collages with multiple images",
    icon: <Layers className="h-6 w-6" />,
    gradient: "from-teal-500 to-blue-500",
    href: "/effects/collages"
  }
];

export default function EffectsSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-teal-50/50 to-transparent dark:from-teal-950/30 dark:to-transparent -z-10"></div>
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-pink-50/50 to-transparent dark:from-pink-950/30 dark:to-transparent -z-10"></div>

      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800/30 mb-4">
            <Sparkles className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            <span className="text-xs font-medium text-teal-800 dark:text-teal-300">
              Creative Effects
            </span>
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-teal-600 via-pink-500 to-teal-400 text-transparent bg-clip-text">
              Transform Your Photos
            </h2>
            <p className="max-w-[800px] text-muted-foreground md:text-xl/relaxed">
              Apply stunning visual effects to make your content stand out
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {effects.map((effect, index) => (
            <div
              key={effect.id}
              className="group"
            >
              <Link href={effect.href} className="block h-full">
                <div className="relative h-full overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300 hover:shadow-md group-hover:translate-y-[-5px]">
                  <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${effect.gradient}`}></div>
                  <div className="p-6">
                    <div className={`inline-flex items-center justify-center p-3 rounded-full bg-gradient-to-br ${effect.gradient} text-white mb-4`}>
                      {effect.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{effect.title}</h3>
                    <p className="text-muted-foreground">{effect.description}</p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent"></div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Link
            href="/effects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-teal-600 to-pink-500 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <span>Explore All Effects</span>
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
            >
              <path
                d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
