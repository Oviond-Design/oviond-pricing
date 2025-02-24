import type { PricingTier, BillingCycle } from "@/types/pricing"
import { ANNUAL_DISCOUNT } from "./constants"

function calculateLinearPrice(clients: number, { minClients, maxClients, basePrice, maxPrice }: PricingTier): number {
  const clampedClients = Math.min(Math.max(clients, minClients), maxClients)
  const range = maxClients - minClients
  const priceRange = maxPrice - basePrice
  const clientsAboveMin = clampedClients - minClients
  return Math.round(basePrice + (priceRange * clientsAboveMin) / range)
}

export function calculatePrice(tier: PricingTier, clients: number, billingCycle: BillingCycle): number {
  if (tier.basePrice === 0) return 0 // Enterprise Plan has no pricing

  const monthlyPrice = calculateLinearPrice(clients, tier)
  return billingCycle === "yearly" ? Math.round(monthlyPrice * ANNUAL_DISCOUNT) : monthlyPrice
}

