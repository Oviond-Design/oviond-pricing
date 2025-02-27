  import type { PricingTier, BillingCycle } from "@/types/pricing";
import { ANNUAL_DISCOUNT } from "./constants";

function calculateStarterPrice(clients: number): number {
  // Ensure clients is within bounds
  const n = Math.min(Math.max(clients, 1), 19);

  // Fixed price tiers for 1-3 clients
  if (n === 1) return 15;
  if (n === 2) return 27;
  if (n === 3) return 39;

  // For 4 to 19 clients: Price = $39 + $5 × (n - 3)
  return 39 + (5 * (n - 3));
}

function calculateLinearPrice(clients: number, tier: PricingTier): number {
  // Special handling for Starter Plan
  if (tier.name === "Starter Plan") {
    return calculateStarterPrice(clients);
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
    name: "Starter Plan",
    description: "For small teams managing up to 19 clients. Streamline reporting with essential tools.",
    minClients: 1,
    maxClients: 19,
    basePrice: 15, // Starting price for 1 client
    maxPrice: 119,
    buttonText: "Start Your Free Trial",
    features: [
      { text: "Collaborate with up to five team members" },
      { text: "Create unlimited custom dashboards for each client" },
      { text: "Generate unlimited marketing reports" },
      { text: "Connect to all your data sources" },
      { text: "Leverage AI for faster insights" },
      { text: "Customize reports with basic brand tools" },
    ],
  },
  {
    name: "Professional Plan",
    description: "For growing agencies with up to 100 clients. Advanced tools for reporting and branding.",
    minClients: 20,
    maxClients: 100,
    basePrice: 129,
    maxPrice: 449,
    buttonText: "Start Your Free Trial",
    highlighted: true,
    features: [
      { text: "Unlimited team members for seamless collaboration" },
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
