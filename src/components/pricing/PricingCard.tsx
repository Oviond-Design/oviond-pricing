import { memo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ClientSelector } from "./ClientSelector"
import { FeatureList } from "./FeatureList"
import { calculatePrice } from "@/lib/calculate-price"
import { CONTACT_URL, SIGNUP_URL } from "@/lib/constants"
import type { PricingTier, BillingCycle } from "@/types/pricing"

interface PricingCardProps {
  tier: PricingTier
  billingCycle: BillingCycle
  clientCount: number
  onClientCountChange: (value: number) => void
}

export const PricingCard = memo(function PricingCard({
  tier,
  billingCycle,
  clientCount,
  onClientCountChange,
}: PricingCardProps) {
  const isEnterprise = tier.name === "Enterprise Plan"
  const price = calculatePrice(tier, clientCount, billingCycle)

  return (
    <Card
      className={`relative overflow-hidden border-neutral-200 ${
        tier.highlighted ? "bg-blue-50 border-blue-200 shadow-md" : ""
      }`}
    >
      <CardContent className="p-6">
        <div className="min-h-[580px] flex flex-col">
          <h3 className="text-2xl font-semibold text-neutral-900 font-lexend">{tier.name}</h3>
          <p className="text-neutral-500 mt-2 font-inter">{tier.description}</p>

          {!isEnterprise && (
            <>
              <ClientSelector
                tier={tier}
                clientCount={clientCount}
                onClientCountChange={onClientCountChange}
                highlighted={tier.highlighted}
              />
              <div className="flex items-baseline gap-1 mt-4">
                <span className="text-4xl font-bold text-neutral-900 font-lexend">${price}</span>
                <span className="text-neutral-500 font-inter">
                  /{billingCycle === "monthly" ? "Month" : "Month, billed yearly"}
                </span>
              </div>
            </>
          )}

          <Button
            className={`mt-6 w-full font-lexend ${
              tier.highlighted
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                : "bg-neutral-100 hover:bg-neutral-200 text-neutral-900"
            }`}
            asChild
          >
            <a href={isEnterprise ? CONTACT_URL : SIGNUP_URL} target="_blank" rel="noopener noreferrer">
              {tier.buttonText}
            </a>
          </Button>

          <FeatureList features={tier.features} planName={tier.name} />
        </div>
      </CardContent>
    </Card>
  )
})

