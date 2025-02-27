import type { PricingTier } from "@/types/pricing";

export const pricingTiers: PricingTier[] = [
  {
    name: "Starter Plan",
    description: "For small teams managing up to 19 clients. Streamline reporting with essential tools.",
    minClients: 1,
    maxClients: 19,
    basePrice: 15,
    maxPrice: 119,
    buttonText: "Start Your Free Trial",
    features: [
      // Team collaboration
      { text: "Collaborate with up to five team members" },
      // Dashboard capabilities
      { text: "Create unlimited custom dashboards for each client" },
      // Report capabilities
      { text: "Generate unlimited marketing reports" },
      // Data integration 
      { text: "Connect to all your data sources" },
      // AI capabilities
      { text: "Leverage AI for faster insights" },
      // Branding capabilities
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
      // Team collaboration - enhanced
      { text: "Unlimited team members for seamless collaboration" },
      // AI capabilities - enhanced
      { text: "Complete AI control with bring-your-own-key options" },
      // Branding capabilities - enhanced
      { text: "Advanced Theme Builder for full brand control per client" },
      { text: "Custom Domain for branded client experiences" },
      // Support capabilities - unique to Professional
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
