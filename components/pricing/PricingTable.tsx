"use client"

import { useState, useCallback } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PricingCard } from "./PricingCard"
import { pricingTiers } from "@/lib/pricing-data"
import type { BillingCycle } from "@/types/pricing"

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

  return (
    <div className="w-full bg-white">
      <Tabs defaultValue="monthly" className="w-full" onValueChange={(value) => setBillingCycle(value as BillingCycle)}>
        <div className="flex justify-center mb-8">
          <TabsList className="grid w-[320px] grid-cols-2">
            <TabsTrigger value="monthly" className="font-lexend">
              Monthly
            </TabsTrigger>
            <TabsTrigger value="yearly" className="font-lexend">
              Save 20% Annually
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="max-w-[1140px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingTiers.map((tier) => (
              <PricingCard
                key={tier.name}
                tier={tier}
                billingCycle={billingCycle}
                clientCount={clientCounts[tier.name]}
                onClientCountChange={(value) => handleClientCountChange(tier.name, value)}
              />
            ))}
          </div>
        </div>
      </Tabs>
    </div>
  )
}

