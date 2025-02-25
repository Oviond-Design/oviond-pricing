"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & { highlighted?: boolean }
>(({ className, highlighted, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track 
      className={cn(
        "relative h-2 w-full grow overflow-hidden rounded-full",
        highlighted ? "bg-blue-100/50" : "bg-neutral-100"
      )}
    >
      <SliderPrimitive.Range 
        className={cn(
          "absolute h-full transition-colors",
          highlighted ? "bg-blue-700" : "bg-blue-600/90"
        )}
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb 
      className={cn(
        "block h-5 w-5 rounded-full border-2 shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 disabled:pointer-events-none disabled:opacity-50",
        highlighted 
          ? "bg-white border-blue-700 hover:border-blue-800 hover:scale-110" 
          : "bg-white border-blue-600 hover:border-blue-700 hover:scale-110"
      )} 
    />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
