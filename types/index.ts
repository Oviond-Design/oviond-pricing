export interface PricingFeature {
  text: string;
}

export interface PricingTier {
  name: string;
  description: string;
  minClients: number;
  maxClients: number;
  basePrice: number;
  maxPrice: number;
  buttonText: string;
  highlighted?: boolean;
  features: PricingFeature[];
}

export type BillingCycle = "monthly" | "yearly";
