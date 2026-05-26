"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    highlighted?: boolean;
  }
>(({ className, highlighted, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex min-h-11 w-full touch-none select-none items-center",
      className,
    )}
    {...props}
  >
    <SliderPrimitive.Track
      className={cn(
        "relative h-2 w-full grow overflow-hidden rounded-full",
        highlighted ? "bg-blue-100" : "bg-neutral-100",
      )}
    >
      <SliderPrimitive.Range
        className={cn("absolute h-full transition-colors", "bg-blue-700")}
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className={cn(
        "block rounded-full border-blue-700 bg-white shadow-sm outline-none transition-transform disabled:pointer-events-none disabled:opacity-50",
        highlighted
          ? "size-6 border-[3px] ring-2 ring-blue-700 ring-offset-2 animate-constant-pulse hover:scale-110 focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
          : "size-5 border-2 hover:scale-105 focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2",
      )}
    />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
