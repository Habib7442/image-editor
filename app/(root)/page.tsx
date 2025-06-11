import { Metadata } from "next";

import HeroSection from "@/components/hero-section";
import AnimatedTemplatesShowcase from "@/components/animated-templates-showcase";
import EffectsSection from "@/components/effects-section";
import FaqSection from "@/components/faq-section";

export const metadata: Metadata = {
  title: "PhotoFX - Create Stunning Photo Effects",
  description:
    "Transform your photos with amazing effects like motion blur, film strips, polaroids, and more. Upload your photos and create stunning visuals instantly.",
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <HeroSection />
        <AnimatedTemplatesShowcase />
        <EffectsSection />
        <FaqSection />
      </main>
    </div>
  );
}
