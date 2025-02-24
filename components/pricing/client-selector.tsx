"use client"

import type React from "react"

import { memo, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import type { PricingTier, BillingCycle } from "@/types/pricing"
import { cn } from "@/lib/utils"

interface ClientSelectorProps {
  tier: PricingTier
  clientCount: number
  onClientCountChange: (value: number) => void
  highlighted?: boolean
  billingCycle: BillingCycle
}

const NumberInput = memo(function NumberInput({
  id,
  value,
  onChange,
  min,
  max,
  highlighted,
  name,
}: {
  id: string
  value: number
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  min: number
  max: number
  highlighted?: boolean
  name: string
}) {
  return (
    <Input
      id={id}
      type="number"
      value={value}
      onChange={onChange}
      className={cn(
        "w-[4.5rem] h-11 font-inter text-center text-3xl font-bold rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 [&::-webkit-inner-spin-button]:opacity-100 [&::-webkit-outer-spin-button]:opacity-100 [&::-webkit-inner-spin-button]:ml-2 [&::-webkit-outer-spin-button]:ml-2",
        highlighted
          ? "bg-white text-blue-700 border-blue-200 hover:border-blue-300"
          : "border-neutral-200 text-neutral-700 hover:border-neutral-300"
      )}
      min={min}
      max={max}
      aria-label={`Number of clients for ${name}`}
    />
  )
})

const ClientLabel = memo(function ClientLabel({
  htmlFor,
  highlighted,
}: {
  htmlFor: string
  highlighted?: boolean
}) {
  return (
    <label 
      htmlFor={htmlFor} 
      className={cn(
        "text-sm font-medium font-inter block mb-3",
        highlighted ? "text-blue-700" : "text-neutral-700"
      )}
    >
      Select Number of Clients
    </label>
  )
})

export const ClientSelector = memo(function ClientSelector({
  tier,
  clientCount,
  onClientCountChange,
  highlighted,
  billingCycle,
}: ClientSelectorProps) {
  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(event.target.value, 10)
    if (!isNaN(value)) {
      const clampedValue = Math.min(Math.max(value, tier.minClients), tier.maxClients)
      onClientCountChange(clampedValue)
    }
  }, [tier.minClients, tier.maxClients, onClientCountChange])

  const handleSliderChange = useCallback((value: number[]) => {
    onClientCountChange(value[0])
  }, [onClientCountChange])

  const inputId = `clients-${tier.name}`

  return (
    <div>
      <ClientLabel htmlFor={inputId} highlighted={highlighted} />
      <div className="flex items-center gap-4">
        <NumberInput
          id={inputId}
          value={clientCount}
          onChange={handleInputChange}
          min={tier.minClients}
          max={tier.maxClients}
          highlighted={highlighted}
          name={tier.name}
        />
        <Slider
          value={[clientCount]}
          onValueChange={handleSliderChange}
          max={tier.maxClients}
          min={tier.minClients}
          step={1}
          className="flex-1"
          highlighted={highlighted}
          aria-label={`Slider for number of clients in ${tier.name}`}
        />
      </div>
    </div>
  )
})

