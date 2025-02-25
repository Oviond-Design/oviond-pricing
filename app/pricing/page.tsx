import { PricingTable } from "@/components/pricing/pricing-table";

export const metadata = {
  title: "Pricing Plans",
  description: "Choose the perfect plan for your agency's needs",
};

export default function PricingPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold text-center mb-8 font-lexend">
        Our Pricing Plans
      </h1>
      <PricingTable />
    </div>
  );
}
