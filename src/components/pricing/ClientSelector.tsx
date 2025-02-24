import { memo, type ChangeEvent } from "react"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import type { PricingTier } from "@/types/pricing"

interface ClientSelectorProps {
  tier: PricingTier
  clientCount: number
  onClientCountChange: (value: number) => void
  highlighted?: boolean
}

export const ClientSelector = memo(function ClientSelector({
  tier,
  clientCount,
  onClientCountChange,
  highlighted,
}: ClientSelectorProps) {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const numValue = Number.parseInt(value, 10)
    if (!isNaN(numValue)) {
      const clampedValue = Math.min(Math.max(numValue, tier.minClients), tier.maxClients)
      onClientCountChange(clampedValue)
    }
  }

  const handleSliderChange = (value: number[]) => {
    onClientCountChange(value[0])
  }

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

