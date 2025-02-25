import { PricingTable } from "@/components/pricing/pricing-table";

export const metadata = {
  title: "Pricing Plans",
  description: "Choose the perfect plan for your agency's needs",
};

export default function PricingPage() {
  return (
    <div className="w-full">
      <PricingTable />
    </div>
  );
}
