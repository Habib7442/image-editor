import { Zap } from "lucide-react";
import PopularSection from "./popular-section";
import NewSection from "./new-section";

export default function FeaturesSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-pink-50/50 to-transparent dark:from-pink-950/30 dark:to-transparent -z-10"></div>
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-teal-50/50 to-transparent dark:from-teal-950/30 dark:to-transparent -z-10"></div>

      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-900/30 border border-pink-200 dark:border-pink-800/30 mb-4">
            <Zap className="h-4 w-4 text-pink-600 dark:text-pink-400" />
            <span className="text-xs font-medium text-pink-800 dark:text-pink-300">
              Viral Content Creation
            </span>
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-pink-600 via-teal-500 to-pink-400 text-transparent bg-clip-text">
              Premium Social Media Templates
            </h2>
            <p className="max-w-[800px] text-muted-foreground md:text-xl/relaxed">
              Create eye-catching social media content that boosts engagement
              and grows your following
            </p>
          </div>
        </div>

        <PopularSection />

        <NewSection />
      </div>
    </section>
  );
}
