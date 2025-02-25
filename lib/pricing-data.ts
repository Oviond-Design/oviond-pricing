import type { PricingTier } from "@/types/pricing";

export const pricingTiers: PricingTier[] = [
  {
    name: "Starter Plan",
    description: "Perfect for small teams managing up to 19 clients.",
    minClients: 3,
    maxClients: 19,
    basePrice: 39,
    maxPrice: 119,
    buttonText: "TRY IT FREE",
    features: [
      { text: "User Limits: Up to 5 agency users" },
      { text: "Oviond AI Assistant" },
      { text: "Design Tools: Basic Theme Builder" },
      { text: "Dashboards: Unlimited Custom Dashboards" },
      { text: "Reporting: Unlimited Reporting Projects" },
      { text: "Data Access: All Data Sources" },
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
      { text: "Starter Plan features, plus:" },
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
    description:
      "Tailored for large agencies managing 100+ to thousands of clients.",
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
