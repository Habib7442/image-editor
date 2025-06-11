import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Facebook, Instagram, Twitter, Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-purple-100 dark:border-purple-900/40 bg-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-400"></div>
      <div className="absolute bottom-40 left-10 w-64 h-64 bg-purple-400/5 dark:bg-purple-900/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute top-40 right-10 w-64 h-64 bg-pink-400/5 dark:bg-pink-900/10 rounded-full blur-3xl -z-10"></div>

      <div className="container px-4 md:px-6 py-16">
        {/* Newsletter section */}
        <div className="mb-16 p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40 border border-purple-100 dark:border-purple-900/40 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left space-y-2 max-w-md">
              <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-400 text-transparent bg-clip-text">Stay in the loop</h3>
              <p className="text-sm text-muted-foreground">
                Get the latest updates, tips, and exclusive offers from PixelPulse delivered to your inbox.
              </p>
            </div>
            <div className="flex w-full md:w-auto flex-col sm:flex-row gap-3">
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="min-w-[240px] pr-10 rounded-full border-purple-200 dark:border-purple-800 focus-visible:ring-purple-500"
                />
              </div>
              <Button className="rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-500 hover:from-purple-700 hover:via-pink-600 hover:to-indigo-600 shadow-md hover:shadow-lg transition-all duration-300">
                <span>Subscribe</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main footer content */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
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
            <p className="text-sm text-muted-foreground leading-relaxed">
              Transform your photos with AI magic. Enhance, stylize, and perfect your images instantly with our cutting-edge technology.
            </p>
            <div className="flex space-x-3 pt-2">
              <Link href="#" className="text-muted-foreground hover:text-purple-500 transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-pink-500 transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-indigo-500 transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">Github</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-blue-500 transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/features" className="text-sm text-muted-foreground hover:text-purple-500 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-muted-foreground hover:text-purple-500 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-purple-500 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-purple-500 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/changelog" className="text-sm text-muted-foreground hover:text-purple-500 transition-colors">
                  Changelog
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-purple-500 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-sm text-muted-foreground hover:text-purple-500 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-purple-500 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-purple-500 transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-purple-500 transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/documentation" className="text-sm text-muted-foreground hover:text-purple-500 transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/api" className="text-sm text-muted-foreground hover:text-purple-500 transition-colors">
                  API
                </Link>
              </li>
              <li>
                <Link href="/tutorials" className="text-sm text-muted-foreground hover:text-purple-500 transition-colors">
                  Tutorials
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-sm text-muted-foreground hover:text-purple-500 transition-colors">
                  Community
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-sm text-muted-foreground hover:text-purple-500 transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-purple-100 dark:border-purple-900/40 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} PixelPulse. All rights reserved.
          </p>
          <div className="flex items-center gap-6 mt-4 md:mt-0 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-purple-500 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-purple-500 transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:text-purple-500 transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}