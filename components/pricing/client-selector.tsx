"use client";

import { memo, useCallback, useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { Slider } from "@/components/ui/slider";
import type { PricingTier } from "@/types/pricing";
import { cn } from "@/lib/utils";

interface ClientSelectorProps {
  tier: PricingTier;
  clientCount: number;
  onClientCountChange: (value: number) => void;
  highlighted?: boolean;
}

const NumberInput = memo(function NumberInput({
  id,
  value,
  onChange,
  min,
  max,
  highlighted,
  name,
}: {
  id: string;
  value: number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  min: number;
  max: number;
  highlighted?: boolean;
  name: string;
}) {
  // Track both the display value (string) and numeric value separately
  const [displayValue, setDisplayValue] = useState(String(value));
  const [numericValue, setNumericValue] = useState(value);

  // Update local state when parent value changes
  useEffect(() => {
    setDisplayValue(String(value));
    setNumericValue(value);
  }, [value]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setDisplayValue(newValue);

    // Only update numeric value and notify parent if it's a valid number
    const parsed = Number(newValue);
    if (!isNaN(parsed)) {
      setNumericValue(parsed);
      onChange(event);
    }
  };

  const handleBlur = () => {
    const parsed = Number(displayValue);
    
    // If not a valid number, revert to last valid value
    if (isNaN(parsed)) {
      setDisplayValue(String(numericValue));
      return;
    }

    // Clamp value if outside bounds
    const clampedValue = Math.min(Math.max(parsed, min), max);
    
    // Update display and numeric values
    setDisplayValue(String(clampedValue));
    setNumericValue(clampedValue);

    // Notify parent if value changed
    if (clampedValue !== parsed) {
      onChange({
        target: { value: String(clampedValue) }
      } as ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <input
      id={id}
      type="number"
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      className={cn(
        "w-[5.25rem] h-11 font-lexend text-center text-lg font-bold rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 [&::-webkit-inner-spin-button]:opacity-100 [&::-webkit-outer-spin-button]:opacity-100 [&::-webkit-inner-spin-button]:ml-1.5 [&::-webkit-outer-spin-button]:ml-1.5 px-3",
        highlighted
          ? "bg-white text-neutral-900 border-blue-200 hover:border-blue-300"
          : "border-neutral-200 text-neutral-900 hover:border-neutral-300",
      )}
      min={min}
      max={max}
      aria-label={`Number of clients for ${name}`}
    />
  );
});



const ClientLabel = memo(function ClientLabel({
  htmlFor,
  highlighted,
}: {
  htmlFor: string;
  highlighted?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "text-base font-semibold font-lexend block mb-3",
        highlighted ? "text-blue-700" : "text-neutral-700",
      )}
    >
      Select Number of Clients
    </label>
  );
});

export const ClientSelector = memo(function ClientSelector({
  tier,
  clientCount,
  onClientCountChange,
  highlighted,
}: ClientSelectorProps) {
  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);
      
      // Only process valid numbers
      if (!isNaN(value)) {
        // Let the NumberInput component handle the display value
        // We only update the actual state when the value is valid
        onClientCountChange(value);
      }
    },
    [onClientCountChange],
  );

  const handleSliderChange = useCallback(
    (value: number[]) => {
      onClientCountChange(value[0]);
    },
    [onClientCountChange],
  );

  const inputId = `clients-${tier.name}`;

  const isEnterprise = tier.name === "Enterprise Plan";

  return (
    <div>
      {!isEnterprise && <ClientLabel htmlFor={inputId} highlighted={highlighted} />}
      {!isEnterprise && (
        <div className="flex items-center gap-4">
          <NumberInput
            id={inputId}
            value={clientCount}
            onChange={handleInputChange}
            min={tier.minClients}
            max={tier.maxClients}
            highlighted={highlighted}
            name={tier.name}
          />
          <Slider
            value={[clientCount]}
            onValueChange={handleSliderChange}
            max={tier.maxClients}
            min={tier.minClients}
            step={1}
            className="flex-1"
            highlighted={highlighted}
            aria-label={`Slider for number of clients in ${tier.name}`}
          />
        </div>
      )}

    </div>
  );
});
