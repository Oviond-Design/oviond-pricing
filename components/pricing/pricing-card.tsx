import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ClientSelector } from "./client-selector";
import { FeatureList } from "./feature-list";
import { calculatePrice } from "@/lib/calculate-price";
import { CONTACT_URL, SIGNUP_URL } from "@/lib/constants";
import type { PricingTier, BillingCycle } from "@/types/pricing";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  tier: PricingTier;
  billingCycle: BillingCycle;
  clientCount: number;
  onClientCountChange: (value: number) => void;
}

const PricingHeader = memo(function PricingHeader({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  return (
    <div>
      <h3 className="text-[28px] font-bold text-neutral-900 font-lexend tracking-tight leading-tight">
        {name}
      </h3>
      <p className="text-neutral-600 mt-2.5 font-inter text-base font-medium leading-normal max-w-[280px]">
        {description}
      </p>
    </div>
  );
});

const PricingAmount = memo(function PricingAmount({
  price,
  billingCycle,
}: {
  price: number;
  billingCycle: BillingCycle;
}) {
  const formattedPrice = new Intl.NumberFormat("en-US").format(price);
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-5xl font-extrabold text-neutral-900 font-lexend tracking-tight">
        ${formattedPrice}
      </span>
      <span className="text-sm font-medium text-neutral-500 font-lexend ml-0.5 mt-1.5 whitespace-nowrap">
        /Month {billingCycle === "yearly" ? "(Billed Annually)" : ""}
      </span>
    </div>
  );
});

const PricingCTA = memo(function PricingCTA({
  buttonText,
  highlighted,
  isEnterprise,
}: {
  buttonText: string;
  highlighted?: boolean;
  isEnterprise: boolean;
}) {
  return (
    <Button
      className={cn(
        "w-full font-lexend text-base font-bold shadow-sm transition-all",
        highlighted
          ? "bg-blue-700 hover:bg-blue-800 text-white font-medium"
          : "border-2 border-blue-700 bg-white text-blue-700 hover:bg-blue-50 font-medium",
      )}
      onClick={() =>
        window.open(
          isEnterprise ? CONTACT_URL : SIGNUP_URL,
          "_blank",
          "noopener,noreferrer",
        )
      }
    >
      {buttonText}
    </Button>
  );
});



const PricingFeatures = memo(function PricingFeatures({
  features,
  planName,
  clientCount,
  isEnterprise,
}: {
  features: Array<{ text: string }>;
  planName: string;
  clientCount: number;
  isEnterprise: boolean;
}) {
  const clientCountText = isEnterprise
    ? "Manage reporting for 100+ client accounts"
    : <span>Manage reporting for <span className="text-[17px] font-bold">{clientCount}</span> client{clientCount === 1 ? "" : "s"}</span>;

  const dynamicFeatures = [
    { text: clientCountText },
    ...features,
  ];

  return (
    <div className="flex-1">
      <p className="text-sm font-bold text-neutral-900 font-lexend mb-5">
        {planName === "Professional Plan"
          ? "Starter Plan features, plus:"
          : "What's Included"}
      </p>
      <FeatureList features={isEnterprise ? features : dynamicFeatures} />
    </div>
  );
});

export const PricingCard = memo(function PricingCard({
  tier,
  billingCycle,
  clientCount,
  onClientCountChange,
}: PricingCardProps) {
  const isEnterprise = tier.name === "Enterprise Plan";
  const price = calculatePrice(tier, clientCount, billingCycle);

  return (
    <Card
      className={cn(
        "relative overflow-hidden h-full transition-all duration-300",
        tier.highlighted
          ? "bg-blue-50/50 border-2 border-blue-200 z-10 shadow-[0_0_24px_-4px_rgba(59,130,246,0.15)] md:scale-[1.02]"
          : "bg-white border border-neutral-200 hover:border-neutral-300 hover:shadow-md",
      )}
    >
      <CardContent className="p-8 sm:p-10">
        <div className="flex flex-col min-h-[580px]">
          <div className="space-y-6">
            <PricingHeader name={tier.name} description={tier.description} />

            {!isEnterprise && (
              <div className="space-y-6">
                <ClientSelector
                  tier={tier}
                  clientCount={clientCount}
                  onClientCountChange={onClientCountChange}
                  highlighted={tier.highlighted}
                />
                <PricingAmount price={price} billingCycle={billingCycle} />
              </div>
            )}

            <div className="mt-6">
              <PricingCTA
                buttonText={tier.buttonText}
                highlighted={tier.highlighted}
                isEnterprise={isEnterprise}
              />
            </div>

            <div className="mt-8">
              <PricingFeatures
                features={tier.features}
                planName={tier.name}
                clientCount={clientCount}
                isEnterprise={isEnterprise}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
