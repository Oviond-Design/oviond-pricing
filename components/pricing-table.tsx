"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Input } from "./ui/input"
import { Slider } from "./ui/slider"
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs"
import { calculatePrice } from "../lib/calculate-price"
import { pricingTiers } from "../lib/pricing-data"

export default function PricingTable() {
  const [billingCycle, setBillingCycle] = React.useState<"monthly" | "yearly">("monthly")
  const [clientCounts, setClientCounts] = React.useState<Record<string, number>>(() =>
    pricingTiers.reduce((acc, tier) => ({ ...acc, [tier.name]: tier.minClients }), {}),
  )

  const handleClientCountChange = (tierName: string, value: number) => {
    setClientCounts((prev) => ({ ...prev, [tierName]: value }))
  }

  return (
    <div className="w-full bg-white">
      <Tabs
        defaultValue="monthly"
        className="w-full"
        onValueChange={(value) => setBillingCycle(value as "monthly" | "yearly")}
      >
        <div className="flex justify-center mb-8">
          <TabsList className="grid w-[240px] grid-cols-2">
            <TabsTrigger value="monthly" className="font-lexend">
              Monthly
            </TabsTrigger>
            <TabsTrigger value="yearly" className="font-lexend">
              Annually
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="max-w-[1140px] mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {pricingTiers.map((tier) => (
              <Card
                key={tier.name}
                className={`relative overflow-hidden border-neutral-200 ${
                  tier.highlighted ? "bg-blue-50 border-blue-200 shadow-md" : ""
                }`}
              >
                <CardContent className="p-6">
                  <div className="min-h-[580px] flex flex-col">
                    <h3 className="text-2xl font-semibold text-neutral-900 font-lexend">{tier.name}</h3>
                    <p className="text-neutral-500 mt-2 font-inter">{tier.description}</p>

                    {tier.basePrice > 0 && (
                      <div className="mt-6">
                        <label
                          htmlFor={`clients-${tier.name}`}
                          className="text-sm font-medium text-neutral-700 font-lexend"
                        >
                          Select Number of Clients
                        </label>
                        <div className="flex items-center gap-4 mt-2">
                          <Input
                            id={`clients-${tier.name}`}
                            type="number"
                            value={clientCounts[tier.name]}
                            onChange={(e) => {
                              const value = Math.min(
                                Math.max(Number(e.target.value) || tier.minClients, tier.minClients),
                                tier.maxClients,
                              )
                              handleClientCountChange(tier.name, value)
                            }}
                            className="w-20 border-neutral-200 focus:border-neutral-300 focus:ring-neutral-300 font-inter"
                            min={tier.minClients}
                            max={tier.maxClients}
                            aria-label={`Number of clients for ${tier.name}`}
                          />
                          <Slider
                            value={[clientCounts[tier.name]]}
                            onValueChange={(value) => handleClientCountChange(tier.name, value[0])}
                            max={tier.maxClients}
                            min={tier.minClients}
                            step={1}
                            className={`flex-1 ${tier.highlighted ? "bg-white shadow-sm" : ""}`}
                            aria-label={`Slider for number of clients in ${tier.name}`}
                          />
                        </div>
                        <div className="flex items-baseline gap-1 mt-4">
                          <span className="text-4xl font-bold text-neutral-900 font-lexend">
                            ${calculatePrice(tier, clientCounts[tier.name], billingCycle)}
                          </span>
                          <span className="text-neutral-500 font-inter">
                            /{billingCycle === "monthly" ? "Month" : "Month, billed yearly"}
                          </span>
                        </div>
                      </div>
                    )}

                    <a
                      href={
                        tier.name === "Enterprise Plan"
                          ? "https://www.oviond.com/contact/"
                          : "https://v2.oviond.com/signup"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-6 w-full font-lexend inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 ${
                        tier.highlighted
                          ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                          : "bg-neutral-100 hover:bg-neutral-200 text-neutral-900"
                      }`}
                    >
                      {tier.buttonText.toUpperCase()}
                    </a>

                    <div className="mt-6">
                      <p className="font-medium text-neutral-900 mb-4 font-lexend">
                        {tier.name === "Professional Plan"
                          ? "All Starter Plan Features, Plus:"
                          : tier.name === "Enterprise Plan"
                            ? "Professional Plan features, plus:"
                            : "What's Included"}
                      </p>
                      <ul className="space-y-3">
                        {tier.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Check className="h-5 w-5 flex-shrink-0 text-blue-600 stroke-2" aria-hidden="true" />
                            <span className="text-neutral-600 font-inter font-medium">{feature.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Tabs>
    </div>
  )
}

