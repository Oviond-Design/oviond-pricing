import type { PricingTier, BillingCycle } from "@/types/pricing"
import { ANNUAL_DISCOUNT } from "./constants"

function calculateStarterPrice(clients: number): number {
  // Linear scaling from 1-19 clients
  // Starting at $9 for 1 client
  // Ending at $119 for 19 clients
  const minClients = 1;
  const maxClients = 19;
  const minPrice = 9;
  const maxPrice = 119;
  
  // Ensure clients is within bounds
  const clampedClients = Math.min(Math.max(clients, minClients), maxClients);
  
  // Calculate price using linear interpolation
  const range = maxClients - minClients;
  const priceRange = maxPrice - minPrice;
  const clientsAboveMin = clampedClients - minClients;
  
  return Math.round(minPrice + (priceRange * clientsAboveMin) / range);
}

function calculateLinearPrice(clients: number, tier: PricingTier): number {
  // Special handling for Starter Plan
  if (tier.name === "Starter Plan") {
    return calculateStarterPrice(clients);
  }
  
  // Regular linear pricing for other plans
  const clampedClients = Math.min(Math.max(clients, tier.minClients), tier.maxClients)
  const range = tier.maxClients - tier.minClients
  const priceRange = tier.maxPrice - tier.basePrice
  const clientsAboveMin = clampedClients - tier.minClients
  return Math.round(tier.basePrice + (priceRange * clientsAboveMin) / range)
}

export function calculatePrice(tier: PricingTier, clients: number, billingCycle: BillingCycle): number {
  if (tier.basePrice === 0) return 0 // Enterprise Plan has no pricing

  const monthlyPrice = calculateLinearPrice(clients, tier)
  
  if (billingCycle === "yearly") {
    // Apply 20% discount for annual billing
    return Math.round(monthlyPrice * ANNUAL_DISCOUNT)
  }
  
  return monthlyPrice
}

export const pricingTiers: PricingTier[] = [
  {
    name: "Starter Plan",
    description: "Perfect for small teams managing up to 19 clients.",
    minClients: 1,
    maxClients: 19,
    basePrice: 39,
    maxPrice: 119,
    buttonText: "TRY IT FREE",
    features: [
      { text: "User Limits: Up to 5 agency users" },
      { text: "Dashboards: Unlimited Custom Dashboards" },
      { text: "Reporting: Unlimited Reporting Projects" },
      { text: "Data Access: All Data Sources" },
      { text: "Oviond AI Assistant" },
      { text: "Design Tools: Basic Theme Builder" },
    ],
  },
  {
    name: "Professional Plan",
    description: "Ideal for growing teams managing up to 100 clients.",
    minClients: 20,
    maxClients: 100,
    basePrice: 129,
    maxPrice: 449,
    buttonText: "TRY IT FREE",
    highlighted: true,
    features: [
      { text: "User Limits: Unlimited agency users" },
      { text: "AI Assistance: Oviond AI Assistant Bring your Own API Key" },
      { text: "Design Tools: Advanced Theme Builder" },
      { text: "Branding: White Labeling & Custom Domain" },
      { text: "Support: Dedicated Onboarding Support" },
      { text: "Account Management: Dedicated Account Manager" },
    ],
  },
  {
    name: "Enterprise Plan",
    description: "Tailored for large agencies managing 100+ to thousands of clients.",
    minClients: 100,
    maxClients: 1000,
    basePrice: 0,
    maxPrice: 0,
    buttonText: "GET A CUSTOM QUOTE",
    features: [
      { text: "Multiple Custom Domains" },
      { text: "Priority Support" },
      { text: "Bespoke Support Packages tailored to your agency's needs" },
      { text: "Custom Integrations" },
    ],
  },
]

