import { memo } from "react";
import { Check } from "lucide-react";
import type { PricingFeature } from "@/types/pricing";

interface FeatureListProps {
  features: PricingFeature[];
  planName: string;
}

export const FeatureList = memo(function FeatureList({
  features,
  planName,
}: FeatureListProps) {
  return (
    <div className="mt-6">
      <p className="font-medium text-neutral-900 mb-4 font-lexend">
        {planName === "Professional Plan"
          ? "All Starter Plan Features, Plus:"
          : planName === "Enterprise Plan"
            ? "Professional Plan features, plus:"
            : "What's Included"}
      </p>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <Check
              className="h-5 w-5 flex-shrink-0 text-blue-600 stroke-2"
              aria-hidden="true"
            />
            <span className="text-neutral-600 font-inter font-medium">
              {feature.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
});
