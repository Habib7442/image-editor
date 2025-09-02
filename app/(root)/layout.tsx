import { Metadata } from "next";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "PixelPulse - AI-Powered Image Generator",
  description:
    "Create amazing images with AI technology. Transform your ideas into stunning visuals with Google Gemini AI in seconds.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}