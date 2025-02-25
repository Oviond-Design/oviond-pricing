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
      "relative flex w-full touch-none select-none items-center",
      className,
    )}
    {...props}
  >
    <SliderPrimitive.Track
      className={cn(
        "relative h-3 w-full grow overflow-hidden rounded-full",
        highlighted ? "bg-white/80" : "bg-neutral-100",
      )}
    >
      <SliderPrimitive.Range
        className={cn(
          "absolute h-full transition-colors",
          "bg-[#2f45ff]"
        )}
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className={cn(
        "block h-6 w-6 rounded-full border-[3px] shadow-md transition-all outline-none disabled:pointer-events-none disabled:opacity-50",
        highlighted
          ? "bg-white border-[#0c0eff] hover:border-opacity-90 hover:scale-110 animate-constant-pulse ring-2 ring-offset-2 ring-[#0c0eff]"
          : "bg-white border-[#0c0eff] hover:border-opacity-90 hover:scale-110 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0c0eff] focus-visible:animate-focus-pulse",
      )}
    />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
