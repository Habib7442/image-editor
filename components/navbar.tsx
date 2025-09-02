"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Menu, ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      href: "#",
      label: "Mini Apps",
      active: pathname.includes('/mini-apps'),
      dropdown: true,
      items: [
        {
          href: "/mini-apps/youtube-thumbnail",
          label: "YouTube Thumbnail Generator",
          active: pathname === "/mini-apps/youtube-thumbnail",
        },
        {
          href: "/mini-apps/decades-photoshoot",
          label: "Decades Photoshoot",
          active: pathname === "/mini-apps/decades-photoshoot",
          comingSoon: true,
        }
      ]
    }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-100 dark:border-purple-900/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container max-w-full px-4 md:px-8 flex h-16 items-center justify-between">
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
          {routes.map((route) => 
            route.dropdown ? (
              <DropdownMenu key={route.label}>
                <DropdownMenuTrigger asChild>
                  <button className={cn(
                    "text-sm font-medium relative transition-all duration-300 hover:text-primary flex items-center gap-1",
                    route.active
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}>
                    {route.label} <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {route.items?.map((item) => (
                    <DropdownMenuItem key={item.href} asChild disabled={item.comingSoon}>
                      <Link 
                        href={item.href}
                        className="flex justify-between items-center"
                      >
                        {item.label}
                        {item.comingSoon && (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300">
                            Soon
                          </span>
                        )}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
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
            )
          )}
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
            {routes.map((route) => 
              route.dropdown ? (
                <div key={route.label} className="flex flex-col gap-2">
                  <div className="text-sm font-medium text-foreground">{route.label}</div>
                  <div className="pl-4 border-l-2 border-purple-200 dark:border-purple-800 flex flex-col gap-3">
                    {route.items?.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "text-sm font-medium transition-all duration-300 hover:text-primary p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 flex justify-between items-center",
                          item.active
                            ? "text-foreground bg-purple-50 dark:bg-purple-900/20"
                            : "text-muted-foreground",
                          item.comingSoon && "opacity-70"
                        )}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                        {item.comingSoon && (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300">
                            Soon
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
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
              )
            )}
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