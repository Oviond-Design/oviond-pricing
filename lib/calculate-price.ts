  import type { PricingTier, BillingCycle } from "@/types/pricing";
import { ANNUAL_DISCOUNT } from "./constants";

// Fixed pricing tiers - discrete steps with exact prices
export const CLIENT_STEPS = [5, 10, 15, 20, 25, 30, 40, 50, 75, 100] as const;

const PRICE_MAP: Record<number, number> = {
  5: 59,
  10: 99,
  15: 139,
  20: 179,
  25: 219,
  30: 259,
  40: 339,
  50: 419,
  75: 599,
  100: 749,
};

function calculateProfessionalPrice(clients: number): number {
  // Look up the exact price from the price map
  if (clients in PRICE_MAP) {
    return PRICE_MAP[clients];
  }
  
  // Fallback: find the closest valid step and return its price
  const closestStep = CLIENT_STEPS.reduce((prev, curr) =>
    Math.abs(curr - clients) < Math.abs(prev - clients) ? curr : prev
  );
  return PRICE_MAP[closestStep];
}

function calculateLinearPrice(clients: number, tier: PricingTier): number {
  // Special handling for Agency Plan with step-based pricing
  if (tier.name === "Agency Plan") {
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
    name: "Agency Plan",
    description: "For growing agencies with up to 100 clients. Advanced tools for reporting and branding.",
    minClients: 5,
    maxClients: 100,
    basePrice: 59,
    maxPrice: 749,
    buttonText: "Start Your Free Trial",
    highlighted: true,
    features: [
      { text: "Collaborate with unlimited team members" },
      { text: "Create unlimited custom dashboards for each client" },
      { text: "Generate unlimited marketing reports" },
      { text: "Connect to all your data sources" },
      { text: "Advanced Theme Builder for full brand control per client" },
      { text: "Custom Domain for branded client experiences" },
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
      { text: "Dedicated onboarding support to accelerate setup" },
      { text: "Dedicated account expert to drive your agency's growth" },
      { text: "Exclusive Premium Support, tailored to your agency's unique needs" },
      { text: "Custom integrations to fit your tech stack" },
    ],
  },
];
