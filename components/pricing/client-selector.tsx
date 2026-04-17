"use client";

import { memo, useCallback, useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { Slider } from "@/components/ui/slider";
import type { PricingTier } from "@/types/pricing";
import { cn } from "@/lib/utils";
import { CLIENT_STEPS } from "@/lib/calculate-price";

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

  // Find the closest valid step from CLIENT_STEPS
  const findClosestStep = (value: number): number => {
    return CLIENT_STEPS.reduce((prev, curr) =>
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    );
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    const parsed = Number(newValue);
    
    // Only update if it's a valid number
    if (!isNaN(parsed)) {
      // Find closest valid step value
      const closestStep = findClosestStep(parsed);
      
      setDisplayValue(String(closestStep));
      setNumericValue(closestStep);
      onChange({
        target: { value: String(closestStep) }
      } as ChangeEvent<HTMLInputElement>);
    } else {
      // Allow typing non-numeric temporarily (will be fixed on blur)
      setDisplayValue(newValue);
    }
  };

  const handleBlur = () => {
    const parsed = Number(displayValue);
    
    // If not a valid number, revert to last valid value
    if (isNaN(parsed)) {
      setDisplayValue(String(numericValue));
      return;
    }

    // Find closest valid step value
    const closestStep = findClosestStep(parsed);
    
    // Update display and numeric values
    setDisplayValue(String(closestStep));
    setNumericValue(closestStep);

    // Notify parent if value changed
    if (closestStep !== numericValue) {
      onChange({
        target: { value: String(closestStep) }
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
      step={5}
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
  // Convert client count to step index for the slider
  const clientToIndex = (clients: number): number => {
    const index = CLIENT_STEPS.indexOf(clients as typeof CLIENT_STEPS[number]);
    return index >= 0 ? index : 0;
  };

  // Convert step index back to client count
  const indexToClient = (index: number): number => {
    return CLIENT_STEPS[index] ?? CLIENT_STEPS[0];
  };

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);
      
      // Only process valid numbers
      if (!isNaN(value)) {
        onClientCountChange(value);
      }
    },
    [onClientCountChange],
  );

  const handleSliderChange = useCallback(
    (value: number[]) => {
      // Convert index to actual client count
      const clientCount = indexToClient(value[0]);
      onClientCountChange(clientCount);
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
            value={[clientToIndex(clientCount)]}
            onValueChange={handleSliderChange}
            max={CLIENT_STEPS.length - 1}
            min={0}
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
