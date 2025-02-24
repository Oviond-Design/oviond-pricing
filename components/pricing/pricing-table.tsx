"use client"

import { useState, useCallback, memo } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { PricingCard } from "./pricing-card"
import { pricingTiers } from "@/lib/calculate-price"
import type { BillingCycle } from "@/types/pricing"
import { cn } from "@/lib/utils"

const BillingTabs = memo(function BillingTabs({ 
  onValueChange 
}: { 
  onValueChange: (value: string) => void 
}) {
  return (
    <div className="flex justify-center mb-16">
      <TabsList className="w-[400px]">
        <TabsTrigger value="monthly" className="flex-1 font-lexend">
          Monthly
        </TabsTrigger>
        <TabsTrigger value="yearly" className="flex-1 font-lexend">
          Annually (-20%)
        </TabsTrigger>
      </TabsList>
    </div>
  )
})

const PricingGrid = memo(function PricingGrid({
  billingCycle,
  clientCounts,
  onClientCountChange,
}: {
  billingCycle: BillingCycle
  clientCounts: Record<string, number>
  onClientCountChange: (tierName: string, value: number) => void
}) {
  return (
    <div className="max-w-[1240px] mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {pricingTiers.map((tier, index) => (
          <div 
            key={tier.name} 
            className={cn(
              "md:col-span-4",
              index === 1 && "md:col-span-4 md:-mt-6 md:-mb-6 md:py-6"
            )}
          >
            <PricingCard
              tier={tier}
              billingCycle={billingCycle}
              clientCount={clientCounts[tier.name]}
              onClientCountChange={(value) => onClientCountChange(tier.name, value)}
            />
          </div>
        ))}
      </div>
    </div>
  )
})

export function PricingTable() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly")
  const [clientCounts, setClientCounts] = useState(() =>
    Object.fromEntries(pricingTiers.map((tier) => [tier.name, tier.minClients])),
  )

  const handleClientCountChange = useCallback((tierName: string, value: number) => {
    setClientCounts((prev) => ({
      ...prev,
      [tierName]: value,
    }))
  }, [])

  const handleBillingCycleChange = useCallback((value: string) => {
    setBillingCycle(value as BillingCycle)
  }, [])

  return (
    <div className="w-full bg-white py-12">
      <Tabs 
        value={billingCycle}
        defaultValue="monthly" 
        className="w-full" 
        onValueChange={handleBillingCycleChange}
      >
        <BillingTabs 
          onValueChange={handleBillingCycleChange} 
        />
        <TabsContent value="monthly">
          <PricingGrid
            billingCycle="monthly"
            clientCounts={clientCounts}
            onClientCountChange={handleClientCountChange}
          />
        </TabsContent>
        <TabsContent value="yearly">
          <PricingGrid
            billingCycle="yearly"
            clientCounts={clientCounts}
            onClientCountChange={handleClientCountChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

