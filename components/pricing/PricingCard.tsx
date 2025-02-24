import { memo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ClientSelector } from "./ClientSelector"
import { FeatureList } from "./FeatureList"
import { calculatePrice } from "@/lib/calculate-price"
import { CONTACT_URL, SIGNUP_URL } from "@/lib/constants"
import type { PricingTier, BillingCycle } from "@/types/pricing"
import { cn } from "@/lib/utils"

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
      className={cn(
        "relative overflow-hidden border-neutral-200",
        tier.highlighted
          ? [
              "bg-blue-50",
              "border-blue-200",
              "border-2",
              "shadow-lg",
              "hover:shadow-xl",
              "transition-all",
              "duration-300",
              "scale-[1.02]",
              "z-10",
            ]
          : "shadow-sm hover:shadow-md transition-shadow",
      )}
    >
      <CardContent className="p-6">
        <div className="flex flex-col min-h-[580px]">
          {/* Header Section - Fixed Height */}
          <div className="h-[100px]">
            <h3 className="text-2xl font-semibold text-neutral-900 font-lexend">{tier.name}</h3>
            <p className="text-neutral-500 mt-2 font-inter">{tier.description}</p>
          </div>

          {/* Pricing Section - Fixed Height */}
          <div className="h-[160px]">
            {!isEnterprise && (
              <>
                <ClientSelector
                  tier={tier}
                  clientCount={clientCount}
                  onClientCountChange={onClientCountChange}
                  highlighted={tier.highlighted}
                  billingCycle={billingCycle}
                />
                <div className="flex items-baseline gap-1 mt-4">
                  <span className="text-4xl font-bold text-neutral-900 font-lexend">${price}</span>
                  <span className="text-neutral-500 font-inter">
                    /{billingCycle === "monthly" ? "Month" : "Month, billed yearly"}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Button Section - Fixed Position */}
          <div className="my-6">
            <Button
              className={`w-full font-lexend ${
                tier.highlighted
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                  : "bg-neutral-100 hover:bg-neutral-200 text-neutral-900"
              }`}
              onClick={() => window.open(isEnterprise ? CONTACT_URL : SIGNUP_URL, "_blank", "noopener,noreferrer")}
            >
              {tier.buttonText}
            </Button>
          </div>

          {/* Features Section - Flexible Height */}
          <div className="flex-1">
            <FeatureList features={tier.features} planName={tier.name} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

