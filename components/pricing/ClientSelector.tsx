"use client"

import type React from "react"

import { memo, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import type { PricingTier } from "@/types/pricing"

interface ClientSelectorProps {
  tier: PricingTier
  clientCount: number
  onClientCountChange: (value: number) => void
  highlighted?: boolean
  billingCycle: "monthly" | "yearly"
}

export const ClientSelector = memo(function ClientSelector({
  tier,
  clientCount,
  onClientCountChange,
  highlighted,
  billingCycle,
}: ClientSelectorProps) {
  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number.parseInt(event.target.value, 10)
      if (!isNaN(value)) {
        onClientCountChange(value)
      }
    },
    [onClientCountChange],
  )

  const handleSliderChange = useCallback(
    (value: number[]) => {
      onClientCountChange(value[0])
    },
    [onClientCountChange],
  )

  return (
    <div className="mt-6">
      <label htmlFor={`clients-${tier.name}`} className="text-sm font-medium text-neutral-700 font-lexend">
        Select Number of Clients
      </label>
      <div className="flex items-center gap-4 mt-2">
        <Input
          id={`clients-${tier.name}`}
          type="number"
          value={clientCount}
          onChange={handleInputChange}
          className="w-20 border-neutral-200 focus:border-neutral-300 focus:ring-neutral-300 font-inter"
          min={tier.minClients}
          max={tier.maxClients}
          aria-label={`Number of clients for ${tier.name}`}
        />
        <Slider
          value={[clientCount]}
          onValueChange={handleSliderChange}
          max={tier.maxClients}
          min={tier.minClients}
          step={1}
          className={`flex-1 ${highlighted ? "bg-white shadow-sm" : ""}`}
          aria-label={`Slider for number of clients in ${tier.name}`}
        />
      </div>
    </div>
  )
})

