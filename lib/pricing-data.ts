import type { PricingTier } from "@/types/pricing";

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
    buttonText: "GET A CUSTOM QUOTE",
    features: [
      { text: "Multiple Custom Domains" },
      { text: "Priority Support" },
      { text: "Bespoke Support Packages tailored to your agency's needs" },
      { text: "Custom Integrations" },
    ],
  },
];
