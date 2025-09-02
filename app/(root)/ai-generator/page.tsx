"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AIGeneratorRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.push("/mini-apps/youtube-thumbnail");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-muted-foreground border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold mb-2">Redirecting...</h1>
        <p className="text-muted-foreground">Taking you to our new mini-apps!</p>
      </div>
    </div>
  );
}
