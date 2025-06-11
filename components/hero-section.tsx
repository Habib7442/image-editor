import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Camera, Wind, Layers } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 dark:bg-blue-700/30 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/20 dark:bg-purple-700/30 rounded-full blur-3xl -z-10"></div>

      <div className="container px-4 md:px-6 relative">
        <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-16 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/30 mb-2">
                <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-medium text-blue-800 dark:text-blue-300">
                  Photo Effects Creator
                </span>
              </div>

              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-7xl/none bg-gradient-to-br from-blue-600 via-purple-500 to-blue-400 text-transparent bg-clip-text animate-gradient">
                Transform Your Photos With Amazing Effects ✨
              </h1>

              <p className="max-w-[600px] text-muted-foreground md:text-xl leading-relaxed">
                Upload your photos and apply stunning visual effects like motion blur, film strips,
                polaroids, and more. Create beautiful images in seconds!
              </p>
            </div>

            <div className="flex flex-col gap-3 min-[400px]:flex-row pt-4">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-gradient-to-r from-blue-600 via-purple-500 to-blue-500 hover:from-blue-700 hover:via-purple-600 hover:to-blue-600 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 font-medium"
              >
                <Link href="/effects" className="flex items-center gap-2">
                  <span>Explore Effects</span>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-1"
                  >
                    <path
                      d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-4 pt-6">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 border-2 border-white dark:border-gray-900"
                  ></div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">10,000+</span>{" "}
                photos transformed with our effects
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-blue-100 dark:border-blue-900/40 bg-background shadow-xl">
              <div className="absolute -top-6 -left-6 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full"></div>
              <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full"></div>

              <div className="relative h-full w-full p-4">
                <div className="absolute top-0 right-0 left-0 flex items-center justify-between px-4 py-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                </div>

                <div className="absolute inset-0 mt-8 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4 p-4 w-full max-w-md">
                    {/* Motion Blur Effect */}
                    <div className="relative aspect-square overflow-hidden rounded-xl border border-blue-100 dark:border-blue-900/40 shadow-lg transition-transform hover:scale-105 duration-300 group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        <Wind className="h-12 w-12 text-white" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                        <span className="text-sm font-medium text-white bg-black/20 px-3 py-1 rounded-full shadow-md backdrop-blur-sm">
                          Motion Blur
                        </span>
                      </div>
                    </div>

                    {/* Film Strip Effect */}
                    <div className="relative aspect-square overflow-hidden rounded-xl border border-blue-100 dark:border-blue-900/40 shadow-lg transition-transform hover:scale-105 duration-300 group">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
                        <Camera className="h-12 w-12 text-white" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                        <span className="text-sm font-medium text-white bg-black/20 px-3 py-1 rounded-full shadow-md backdrop-blur-sm">
                          Film Strip
                        </span>
                      </div>
                    </div>

                    {/* Glamour Glow Effect */}
                    <div className="relative aspect-square overflow-hidden rounded-xl border border-blue-100 dark:border-blue-900/40 shadow-lg transition-transform hover:scale-105 duration-300 group">
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center">
                        <Sparkles className="h-12 w-12 text-white" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                        <span className="text-sm font-medium text-white bg-black/20 px-3 py-1 rounded-full shadow-md backdrop-blur-sm">
                          Glamour Glow
                        </span>
                      </div>
                    </div>

                    {/* Collages Effect */}
                    <div className="relative aspect-square overflow-hidden rounded-xl border border-blue-100 dark:border-blue-900/40 shadow-lg transition-transform hover:scale-105 duration-300 group">
                      <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center">
                        <Layers className="h-12 w-12 text-white" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                        <span className="text-sm font-medium text-white bg-black/20 px-3 py-1 rounded-full shadow-md backdrop-blur-sm">
                          Collages
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
