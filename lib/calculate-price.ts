  import type { PricingTier, BillingCycle } from "@/types/pricing";
import { ANNUAL_DISCOUNT } from "./constants";

function calculateProfessionalPrice(clients: number): number {
  // Clients come in increments of 5: 5, 10, 15, ... 100
  // Prices: 5 clients = $49, 100 clients = $490
  // Total of 20 steps (5 to 100), price increases linearly
  
  const minClients = 5;
  const maxClients = 100;
  const basePrice = 49;
  const maxPrice = 490;
  
  // Clamp clients to valid range
  const clampedClients = Math.min(Math.max(clients, minClients), maxClients);
  
  // Calculate price based on position in range
  // (clients - 5) / (100 - 5) = position ratio
  // price = 49 + (490 - 49) * ratio
  const ratio = (clampedClients - minClients) / (maxClients - minClients);
  return Math.round(basePrice + (maxPrice - basePrice) * ratio);
}

function calculateLinearPrice(clients: number, tier: PricingTier): number {
  // Special handling for Professional Plan with step-based pricing
  if (tier.name === "Professional Plan") {
    return calculateProfessionalPrice(clients);
  }

  // Regular linear pricing for other plans
  const clampedClients = Math.min(
    Math.max(clients, tier.minClients),
    tier.maxClients,
  );
  const range = tier.maxClients - tier.minClients;
  const priceRange = tier.maxPrice - tier.basePrice;
  const clientsAboveMin = clampedClients - tier.minClients;
  return Math.round(tier.basePrice + (priceRange * clientsAboveMin) / range);
}

export function calculatePrice(
  tier: PricingTier,
  clients: number,
  billingCycle: BillingCycle,
): number {
  if (tier.basePrice === 0) return 0; // Enterprise Plan has no pricing

  const monthlyPrice = calculateLinearPrice(clients, tier);

  if (billingCycle === "yearly") {
    // Apply 20% discount for annual billing
    return Math.round(monthlyPrice * ANNUAL_DISCOUNT);
  }

  return monthlyPrice;
}

export const pricingTiers: PricingTier[] = [
  {
    name: "Professional Plan",
    description: "For growing agencies with up to 100 clients. Advanced tools for reporting and branding.",
    minClients: 5,
    maxClients: 100,
    basePrice: 49,
    maxPrice: 490,
    buttonText: "Start Your Free Trial",
    highlighted: true,
    features: [
      { text: "Collaborate with unlimited team members" },
      { text: "Create unlimited custom dashboards for each client" },
      { text: "Generate unlimited marketing reports" },
      { text: "Connect to all your data sources" },
      { text: "Leverage AI for faster insights" },
      { text: "Complete AI control with bring-your-own-key options" },
      { text: "Advanced Theme Builder for full brand control per client" },
      { text: "Custom Domain for branded client experiences" },
      { text: "Dedicated onboarding support to accelerate setup" },
      { text: "Dedicated account expert to drive your agency's growth" },
    ],
  },
  {
    name: "Enterprise Plan",
    description:
      "For large agencies with 100+ clients. Custom solutions and support for seamless scaling.",
    minClients: 100,
    maxClients: 1000,
    basePrice: 0,
    maxPrice: 0,
    buttonText: "Get a Custom Quote",
    features: [
      { text: "Multiple custom domains for branded experiences" },
      { text: "Exclusive Premium Support, tailored to your agency's unique needs" },
      { text: "Custom integrations to fit your tech stack" },
    ],
  },
];
