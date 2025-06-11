"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const SmoothSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-800">
      <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-purple-600 to-pink-500" />
    </SliderPrimitive.Track>
    {props.value?.map((_, i) => (
      <motion.div
        key={i}
        initial={false}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <SliderPrimitive.Thumb
          className="block h-5 w-5 rounded-full border-2 border-purple-500 bg-background shadow-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          aria-label={`Thumb ${i + 1}`}
        />
      </motion.div>
    ))}
  </SliderPrimitive.Root>
));

SmoothSlider.displayName = "SmoothSlider";

export { SmoothSlider };
