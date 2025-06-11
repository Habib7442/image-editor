"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const routes = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
    },
    {
      href: "/features",
      label: "Features",
      active: pathname === "/features",
    },
    {
      href: "/templates",
      label: "Templates",
      active: pathname === "/templates",
    },
    {
      href: "/pricing",
      label: "Pricing",
      active: pathname === "/pricing",
    },
    {
      href: "/blog",
      label: "Blog",
      active: pathname === "/blog",
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-100 dark:border-purple-900/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-1.5 shadow-md transition-transform duration-300 group-hover:scale-110">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-400 text-transparent bg-clip-text transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:via-pink-500 group-hover:to-purple-600">PixelPulse</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm font-medium relative transition-all duration-300 hover:text-primary",
                route.active
                  ? "text-foreground after:absolute after:bottom-[-4px] after:left-0 after:h-[3px] after:w-full after:rounded-full after:bg-gradient-to-r after:from-purple-500 after:to-pink-500"
                  : "text-muted-foreground hover:after:absolute hover:after:bottom-[-4px] hover:after:left-0 hover:after:h-[2px] hover:after:w-full hover:after:rounded-full hover:after:bg-gradient-to-r hover:after:from-purple-500/40 hover:after:to-pink-500/40"
              )}
            >
              {route.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {/* <ModeToggle /> */}
          <Button asChild variant="outline" size="sm" className="rounded-full border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all duration-300">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild size="sm" className="rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-500 hover:from-purple-700 hover:via-pink-600 hover:to-indigo-600 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-4">
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
            className="rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/30"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden p-6 border-t border-purple-100 dark:border-purple-900/40 bg-background/95 backdrop-blur-xl animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col gap-5">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm font-medium transition-all duration-300 hover:text-primary p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20",
                  route.active
                    ? "text-foreground bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 pl-3"
                    : "text-muted-foreground"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {route.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 mt-6">
              <Button asChild variant="outline" size="sm" className="rounded-full border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/30">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild size="sm" className="rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-500 hover:from-purple-700 hover:via-pink-600 hover:to-indigo-600 shadow-md">
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}