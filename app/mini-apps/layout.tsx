import { Metadata } from "next";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "PixelPulse - Mini Apps",
  description: "Specialized AI-powered creative tools for specific needs.",
};

export default function MiniAppsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-background">
      <Navbar />
      <main className="w-full">{children}</main>
    </div>
  );
}