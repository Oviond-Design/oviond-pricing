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
  const findClosestStep = (val: number): number => {
    return CLIENT_STEPS.reduce((prev, curr) =>
      Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev
    );
  };

  // Get current index in CLIENT_STEPS
  const getCurrentIndex = (): number => {
    const index = CLIENT_STEPS.indexOf(numericValue as typeof CLIENT_STEPS[number]);
    return index >= 0 ? index : 0;
  };

  const handleIncrement = () => {
    const currentIndex = getCurrentIndex();
    if (currentIndex < CLIENT_STEPS.length - 1) {
      const newValue = CLIENT_STEPS[currentIndex + 1];
      setDisplayValue(String(newValue));
      setNumericValue(newValue);
      onChange({
        target: { value: String(newValue) }
      } as ChangeEvent<HTMLInputElement>);
    }
  };

  const handleDecrement = () => {
    const currentIndex = getCurrentIndex();
    if (currentIndex > 0) {
      const newValue = CLIENT_STEPS[currentIndex - 1];
      setDisplayValue(String(newValue));
      setNumericValue(newValue);
      onChange({
        target: { value: String(newValue) }
      } as ChangeEvent<HTMLInputElement>);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    // Allow typing any value, will be corrected on blur
    setDisplayValue(event.target.value);
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

  const currentIndex = getCurrentIndex();
  const canDecrement = currentIndex > 0;
  const canIncrement = currentIndex < CLIENT_STEPS.length - 1;

  return (
    <div className="flex items-center">
      <input
        id={id}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className={cn(
          "w-14 h-11 font-lexend text-center text-lg font-bold rounded-l-md border-y border-l transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600",
          highlighted
            ? "bg-white text-neutral-900 border-blue-200"
            : "border-neutral-200 text-neutral-900",
        )}
        aria-label={`Number of clients for ${name}`}
      />
      <div className="flex flex-col">
        <button
          type="button"
          onClick={handleIncrement}
          disabled={!canIncrement}
          className={cn(
            "w-7 h-[22px] flex items-center justify-center border-t border-r rounded-tr-md transition-colors",
            highlighted
              ? "border-blue-200 hover:bg-blue-50 disabled:hover:bg-white"
              : "border-neutral-200 hover:bg-neutral-50 disabled:hover:bg-white",
            "disabled:opacity-40 disabled:cursor-not-allowed"
          )}
          aria-label="Increase clients"
        >
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="text-neutral-600">
            <path d="M1 5L5 1L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          type="button"
          onClick={handleDecrement}
          disabled={!canDecrement}
          className={cn(
            "w-7 h-[22px] flex items-center justify-center border-b border-r border-t rounded-br-md transition-colors",
            highlighted
              ? "border-blue-200 hover:bg-blue-50 disabled:hover:bg-white"
              : "border-neutral-200 hover:bg-neutral-50 disabled:hover:bg-white",
            "disabled:opacity-40 disabled:cursor-not-allowed"
          )}
          aria-label="Decrease clients"
        >
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="text-neutral-600">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
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
