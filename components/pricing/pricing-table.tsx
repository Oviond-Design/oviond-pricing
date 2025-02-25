"use client";

import { useState, useCallback, memo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PricingCard } from "./pricing-card";
import { pricingTiers } from "@/lib/calculate-price";
import type { BillingCycle } from "@/types/pricing";
import { cn } from "@/lib/utils";

const BillingTabs = memo(function BillingTabs() {
  return (
    <div className="flex justify-center mb-8">
      <TabsList className="inline-flex h-12 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
        <TabsTrigger
          value="monthly"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-5 py-2 text-[15px] font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:data-[state=active]:bg-background hover:data-[state=inactive]:bg-gray-100"
        >
          Monthly
        </TabsTrigger>
        <TabsTrigger
          value="yearly"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-5 py-2 text-[15px] font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:data-[state=active]:bg-background hover:data-[state=inactive]:bg-gray-100"
        >
          Save 20% Annually
        </TabsTrigger>
      </TabsList>
    </div>
  );
});

const PricingGrid = memo(function PricingGrid({
  billingCycle,
  clientCounts,
  onClientCountChange,
}: {
  billingCycle: BillingCycle;
  clientCounts: Record<string, number>;
  onClientCountChange: (tierName: string, value: number) => void;
}) {
  return (
    <div className="max-w-[1240px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {pricingTiers.map((tier, index) => (
          <div
            key={tier.name}
            className={cn(
              "md:col-span-4",
              index === 1 && "md:col-span-4 md:-mt-6 md:-mb-6 md:py-6",
            )}
          >
            <PricingCard
              tier={tier}
              billingCycle={billingCycle}
              clientCount={clientCounts[tier.name]}
              onClientCountChange={(value) =>
                onClientCountChange(tier.name, value)
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
});

export function PricingTable() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [clientCounts, setClientCounts] = useState(() =>
    Object.fromEntries(
      pricingTiers.map((tier) => [tier.name, tier.minClients]),
    ),
  );

  const handleClientCountChange = useCallback(
    (tierName: string, value: number) => {
      setClientCounts((prev) => ({
        ...prev,
        [tierName]: value,
      }));
    },
    [],
  );

  const handleBillingCycleChange = useCallback((value: string) => {
    setBillingCycle(value as BillingCycle);
  }, []);

  return (
    <div className="w-full bg-white">
      <Tabs
        value={billingCycle}
        defaultValue="monthly"
        className="w-full"
        onValueChange={handleBillingCycleChange}
      >
        <BillingTabs />
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
  );
}
