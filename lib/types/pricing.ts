export type PricingTier = {
  name: string;
  description: string;
  minClients: number;
  maxClients: number;
  basePrice: number;
  maxPrice: number;
  buttonText: string;
  highlighted?: boolean;
  features: { text: string | JSX.Element }[];
};
