import { PricingTable } from "@/components/pricing/pricing-table";

export const metadata = {
  title: "Oviond Agency Pricing",
  description:
    "One simple Oviond plan for agency reporting. Use the pricing slider to see monthly and annual pricing by client count, with API and MCP access included.",
};

export default function PricingPage() {
  return (
    <main className="w-full">
      <PricingTable />
    </main>
  );
}
