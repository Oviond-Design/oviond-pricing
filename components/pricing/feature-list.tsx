import { memo } from "react"
import { Check } from "lucide-react"
interface FeatureListProps {
  features: Array<{ text: string }>
  planName: string
}

export const FeatureList = memo(function FeatureList({ features, planName }: FeatureListProps) {
  return (
    <div>
      <ul className="space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3 group">
            <Check 
              className="size-[18px] flex-shrink-0 text-blue-700 mt-0.5 transition-transform group-hover:scale-110" 
              aria-hidden="true" 
              strokeWidth={2.5}
            />
            <span className="text-sm text-neutral-600 font-inter leading-relaxed">{feature.text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
})

