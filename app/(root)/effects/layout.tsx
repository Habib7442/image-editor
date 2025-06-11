import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PixelWave - Effects",
  description: "Apply creative effects to your images with our AI-powered tools.",
};

export default function EffectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
