import type { PricingTier } from "@/types";

export const ANNUAL_DISCOUNT = 0.8; // 20% discount
export const CONTACT_URL = "https://www.oviond.com/contact/";
export const SIGNUP_URL = "https://v2.oviond.com/signup";

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
