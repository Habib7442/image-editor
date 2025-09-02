import { Metadata } from "next";
import HomeContent from "@/components/home-content";

export const metadata: Metadata = {
  title: "PixelPulse - AI-Powered Creative Tools",
  description:
    "Transform your ideas into stunning visuals with our AI-powered creative tools. Multiple mini-apps for specific creative needs, powered by Google Gemini AI.",
};

export default function Home() {
  return (
    <HomeContent />
  );
}