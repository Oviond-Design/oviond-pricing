"use client";

import { Check, Minus, Plus } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  agencyPricingTable,
  calculateAgencyEffectivePrice,
  calculateAgencyPrice,
  getAgencyPricingPoint,
} from "@/lib/calculate-price";
import {
  CONTACT_URL,
  GLEAP_APP_ID,
  GLEAP_CONTACT_SALES_BOT_ID,
  SIGNUP_URL,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { BillingCycle } from "@/types/pricing";

type IncludedFeatureItem = {
  title: string;
  description?: string;
};

const includedFeatures: IncludedFeatureItem[] = [
  {
    title: "White-label reporting",
    description: "Deliver reports under your agency brand, not ours.",
  },
  {
    title: "Unlimited reports",
    description: "Create as many client reports as your team needs.",
  },
  {
    title: "Unlimited dashboards",
    description:
      "Build live dashboards for different clients, teams, and use cases.",
  },
  {
    title: "Scheduled reports",
    description:
      "Send recurring reports automatically without rebuilding them every month.",
  },
  {
    title: "Report email delivery",
    description:
      "Deliver client-ready reports straight to inboxes on schedule.",
  },
  {
    title: "Custom domains",
    description:
      "Use your own branded reporting domain for a cleaner client experience.",
  },
  {
    title: "Report templates",
    description:
      "Start faster with reusable layouts built for agency reporting.",
  },
  {
    title: "50+ marketing integrations",
    description:
      "Connect the marketing, ads, analytics, SEO, and social data your clients care about.",
  },
  {
    title: "Custom data import",
    description:
      "Bring in data from sources outside the standard integrations.",
  },
  {
    title: "Automations",
    description:
      "Reduce repetitive reporting tasks and keep delivery running in the background.",
  },
  {
    title: "Unlimited team users",
    description: "Invite your team without paying per seat.",
  },
  {
    title: "Full API access",
    description:
      "Build internal tools, workflows, and custom reporting experiences on top of Oviond.",
  },
  {
    title: "Oviond MCP server",
    description:
      "Work with Oviond reporting data from Claude, ChatGPT, Codex, and other MCP-compatible tools.",
  },
  {
    title: "Support included",
    description:
      "Get help when your team needs it, without buying a higher plan.",
  },
];

const wholeCurrencyFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
  style: "currency",
  currency: "USD",
});

const centsCurrencyFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  style: "currency",
  currency: "USD",
});

const perClientFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  style: "currency",
  currency: "USD",
});

const pricingUi = {
  accentText: "text-blue-700",
  cardSurface: "border border-slate-200 bg-white shadow-sm",
  mutedSurface: "bg-slate-50",
  primaryButton:
    "h-12 w-full rounded-md bg-blue-700 text-base font-bold text-white shadow-sm hover:bg-blue-800",
  secondaryButton:
    "h-11 rounded-md border border-blue-700 bg-white px-5 text-sm font-bold text-blue-700 hover:bg-blue-50 hover:text-blue-800",
};

const maxSliderClients = 500;
const maxSliderIndex = agencyPricingTable.findIndex(
  (point) => point.clients === maxSliderClients,
);

function formatCurrency(value: number): string {
  return Number.isInteger(value)
    ? wholeCurrencyFormatter.format(value)
    : centsCurrencyFormatter.format(value);
}

function openSignup() {
  window.open(SIGNUP_URL, "_blank", "noopener,noreferrer");
}

type GleapApi = {
  initialize: (appId: string) => void;
  startBot: (botId: string) => void;
};

type GleapStub = unknown[] &
  Partial<GleapApi> & {
    invoked?: boolean;
    load?: () => void;
    methods?: string[];
    f?: (method: string) => (...args: unknown[]) => void;
  };

declare global {
  interface Window {
    Gleap?: GleapStub;
    GleapActions?: Array<{ e: string; a: unknown[] }>;
  }
}

let gleapScriptLoadPromise: Promise<void> | null = null;

function initializeGleapWidget() {
  if (typeof window === "undefined") {
    return;
  }

  const gleap = (window.Gleap = window.Gleap || ([] as GleapStub));

  if (gleap.invoked) {
    return;
  }

  window.GleapActions = [];
  gleap.invoked = true;
  gleap.methods = [
    "identify",
    "clearIdentity",
    "attachCustomData",
    "setCustomData",
    "removeCustomData",
    "clearCustomData",
    "registerCustomAction",
    "logEvent",
    "sendSilentCrashReport",
    "startFeedbackFlow",
    "startBot",
    "setAppBuildNumber",
    "setAppVersionCode",
    "preFillForm",
    "setApiUrl",
    "setFrameUrl",
    "isOpened",
    "open",
    "close",
    "on",
    "setLanguage",
    "setOfflineMode",
    "initialize",
  ];
  gleap.f = (method: string) => {
    return (...args: unknown[]) => {
      window.GleapActions?.push({ e: method, a: args });
    };
  };

  for (const method of gleap.methods) {
    gleap[method as keyof GleapApi] = gleap.f(method) as never;
  }

  gleap.load = () => {
    if (
      document.querySelector<HTMLScriptElement>(
        'script[src="https://sdk.gleap.io/latest/index.js"]',
      )
    ) {
      return;
    }

    gleapScriptLoadPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.src = "https://sdk.gleap.io/latest/index.js";
      script.addEventListener("load", () => resolve(), { once: true });
      script.addEventListener(
        "error",
        () => reject(new Error("Gleap SDK failed to load.")),
        { once: true },
      );
      document.head.appendChild(script);
    });
  };

  gleap.load();
  gleap.initialize?.(GLEAP_APP_ID);
}

function openContactSalesBot() {
  initializeGleapWidget();

  if (!window.Gleap?.startBot) {
    gleapScriptLoadPromise?.catch(() => {
      window.open(CONTACT_URL, "_blank", "noopener,noreferrer");
    });
    return;
  }

  window.Gleap.startBot(GLEAP_CONTACT_SALES_BOT_ID);
}

const BillingTabs = memo(function BillingTabs({
  billingCycle,
  onBillingCycleChange,
}: {
  billingCycle: BillingCycle;
  onBillingCycleChange: (value: string) => void;
}) {
  return (
    <Tabs
      value={billingCycle}
      onValueChange={onBillingCycleChange}
      className="w-full"
    >
      <TabsList className="mx-auto grid h-auto w-full max-w-[400px] grid-cols-2 rounded-md border border-slate-200 bg-slate-100 p-1 shadow-none">
        <TabsTrigger
          value="monthly"
          className="h-11 rounded-[5px] text-sm font-bold"
        >
          Monthly
        </TabsTrigger>
        <TabsTrigger
          value="yearly"
          className="h-11 rounded-[5px] text-sm font-bold"
        >
          Annual, save 20%
        </TabsTrigger>
      </TabsList>
      <TabsContent value="monthly" className="hidden" />
      <TabsContent value="yearly" className="hidden" />
    </Tabs>
  );
});

const Stepper = memo(function Stepper({
  value,
  canDecrease,
  canIncrease,
  onDecrease,
  onIncrease,
}: {
  value: number;
  canDecrease: boolean;
  canIncrease: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <div className="grid h-12 w-full max-w-[300px] grid-cols-[1fr_1.35fr_1fr] overflow-hidden rounded-md border border-slate-300 bg-white sm:h-14">
      <button
        type="button"
        onClick={onDecrease}
        disabled={!canDecrease}
        aria-label="Decrease client count"
        className="grid place-items-center border-r border-slate-300 text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-white"
      >
        <Minus className="size-5 sm:size-6" strokeWidth={3} />
      </button>
      <output
        aria-label="Selected clients"
        className="grid place-items-center text-2xl font-extrabold text-slate-950 sm:text-3xl"
      >
        {value}
      </output>
      <button
        type="button"
        onClick={onIncrease}
        disabled={!canIncrease}
        aria-label="Increase client count"
        className="grid place-items-center border-l border-slate-300 text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-white"
      >
        <Plus className="size-5 sm:size-6" strokeWidth={3} />
      </button>
    </div>
  );
});

const PriceSummary = memo(function PriceSummary({
  billingCycle,
  clientCount,
  currentMonthlyPrice,
  standardMonthlyPrice,
  effectivePrice,
  annualYearlyTotal,
  annualSavings,
}: {
  billingCycle: BillingCycle;
  clientCount: number;
  currentMonthlyPrice: number;
  standardMonthlyPrice: number;
  effectivePrice: number;
  annualYearlyTotal: number;
  annualSavings: number;
}) {
  return (
    <aside
      className={cn(
        "flex flex-col justify-between rounded-lg p-5 sm:p-6 lg:self-start lg:p-7",
        pricingUi.mutedSurface,
      )}
    >
      <div className="space-y-6">
        <p className={cn("text-[15px] font-bold", pricingUi.accentText)}>
          {clientCount} clients included
        </p>

        <div className="space-y-2">
          {billingCycle === "yearly" ? (
            <p className="text-sm font-bold text-slate-500">
              <span className="line-through">
                {formatCurrency(standardMonthlyPrice)}/month monthly
              </span>
            </p>
          ) : null}
          <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
            <span className="font-lexend text-5xl font-extrabold tracking-normal text-slate-950 sm:text-[3.5rem] sm:leading-none">
              {formatCurrency(currentMonthlyPrice)}
            </span>
            <span className="pb-1.5 text-base font-bold text-slate-600 sm:text-lg">
              /month
            </span>
          </div>
        </div>

        <div className="max-w-[460px] text-base font-medium leading-7 text-slate-600">
          <p>
            {billingCycle === "yearly"
              ? `Billed annually at ${formatCurrency(annualYearlyTotal)} per year. You save ${formatCurrency(annualSavings)}.`
              : "Billed monthly. Change client count anytime."}
          </p>
        </div>

        <p className="text-base font-bold text-slate-500">
          {perClientFormatter.format(effectivePrice)} per client/month
        </p>

        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-800 sm:text-sm">
          <span className="size-2 rounded-full bg-emerald-500" />
          API + MCP included
        </div>
      </div>

      <div className="mt-8">
        <Button
          size="lg"
          onClick={openSignup}
          className={pricingUi.primaryButton}
        >
          Start Free Trial
        </Button>

        <p className="mt-3 text-center text-sm font-semibold text-slate-500">
          Features stay included when your client count changes.
        </p>
      </div>
    </aside>
  );
});

const IncludedFeature = memo(function IncludedFeature({
  feature,
  highlighted,
}: {
  feature: IncludedFeatureItem;
  highlighted?: boolean;
}) {
  return (
    <li className="flex min-h-[72px] items-start gap-4 rounded-md border border-slate-200 bg-white p-4">
      <span
        className={cn(
          "mt-0.5 grid size-9 shrink-0 place-items-center rounded-full",
          highlighted
            ? "bg-blue-700 text-white"
            : "bg-slate-100 text-slate-950",
        )}
      >
        <Check className="size-5" strokeWidth={2.75} aria-hidden="true" />
      </span>
      <span className="space-y-1">
        <span className="block text-[15px] font-bold leading-snug text-slate-950">
          {feature.title}
        </span>
        {feature.description ? (
          <span className="block text-sm font-medium leading-5 text-slate-600">
            {feature.description}
          </span>
        ) : null}
      </span>
    </li>
  );
});

export function PricingTable() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [priceIndex, setPriceIndex] = useState(0);

  useEffect(() => {
    initializeGleapWidget();
  }, []);

  const selectedPoint = getAgencyPricingPoint(priceIndex);
  const currentMonthlyPrice = calculateAgencyPrice(selectedPoint, billingCycle);
  const effectivePrice = calculateAgencyEffectivePrice(
    selectedPoint,
    billingCycle,
  );

  const maxIndex =
    maxSliderIndex >= 0 ? maxSliderIndex : agencyPricingTable.length - 1;

  const handleBillingCycleChange = useCallback((value: string) => {
    setBillingCycle(value as BillingCycle);
  }, []);

  const handleSliderChange = useCallback((value: number[]) => {
    setPriceIndex(Math.min(value[0], maxIndex));
  }, [maxIndex]);

  const decreaseClients = useCallback(() => {
    setPriceIndex((currentIndex) => Math.max(currentIndex - 1, 0));
  }, []);

  const increaseClients = useCallback(() => {
    setPriceIndex((currentIndex) => Math.min(currentIndex + 1, maxIndex));
  }, [maxIndex]);

  const sliderLabel = useMemo(
    () =>
      `${selectedPoint.clients} clients for ${formatCurrency(currentMonthlyPrice)} per month`,
    [currentMonthlyPrice, selectedPoint.clients],
  );

  return (
    <section className="w-full bg-white px-4 py-5 font-inter text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1280px]">
        <BillingTabs
          billingCycle={billingCycle}
          onBillingCycleChange={handleBillingCycleChange}
        />

        <div
          className={cn(
            "mt-6 overflow-hidden rounded-lg sm:mt-8",
            pricingUi.cardSurface,
          )}
        >
          <div className="grid gap-8 p-5 sm:p-7 lg:grid-cols-[1.28fr_0.92fr] lg:p-8 xl:gap-10 xl:p-10">
            <div className="flex flex-col justify-between gap-9">
              <div className="max-w-[760px] space-y-5">
                <p
                  className={cn(
                    "text-xs font-extrabold tracking-normal sm:text-sm",
                    pricingUi.accentText,
                  )}
                >
                  One agency plan
                </p>
                <h2 className="font-lexend text-3xl font-extrabold leading-[1.08] tracking-normal text-slate-950 sm:text-[2.25rem] lg:text-[2.875rem]">
                  Pricing that scales with your agency
                </h2>
                <p className="max-w-[690px] text-base font-medium leading-7 text-slate-600 sm:text-lg sm:leading-8">
                  Start at $49/month for 5 clients. Every core feature stays
                  included as you grow.
                </p>
              </div>

              <div className="space-y-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <label
                      htmlFor="agency-client-slider"
                      className="block text-base font-bold text-slate-950"
                    >
                      Clients you report for
                    </label>
                    <p className="mt-2 max-w-[360px] text-sm font-medium leading-6 text-slate-500">
                      Choose your client count. Your price updates instantly.
                    </p>
                  </div>

                  <Stepper
                    value={selectedPoint.clients}
                    canDecrease={priceIndex > 0}
                    canIncrease={priceIndex < maxIndex}
                    onDecrease={decreaseClients}
                    onIncrease={increaseClients}
                  />
                </div>

                <div className="space-y-3">
                  <Slider
                    id="agency-client-slider"
                    value={[priceIndex]}
                    min={0}
                    max={maxIndex}
                    step={1}
                    onValueChange={handleSliderChange}
                    aria-label={sliderLabel}
                    className="w-full"
                    highlighted
                  />
                  <div className="flex items-start justify-between text-sm font-bold text-slate-500">
                    <span>5</span>
                    <span>{maxSliderClients}</span>
                  </div>
                  <p className="max-w-[640px] text-xs font-semibold leading-5 text-slate-500 sm:text-sm">
                    A client is one reporting profile, brand, store, branch, or
                    business you report for.
                  </p>
                </div>

                <div className="flex flex-col gap-4 rounded-md border border-blue-100 bg-blue-50/60 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm font-semibold leading-6 text-slate-700">
                    <p className="font-extrabold text-slate-950">
                      Need volume pricing or a custom plan?
                    </p>
                    <p>
                      Built for agencies with unique onboarding, integration, or
                      security needs.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={openContactSalesBot}
                    className={cn("shrink-0", pricingUi.secondaryButton)}
                  >
                    Get in touch -&gt;
                  </Button>
                </div>
              </div>
            </div>

            <PriceSummary
              billingCycle={billingCycle}
              clientCount={selectedPoint.clients}
              currentMonthlyPrice={currentMonthlyPrice}
              standardMonthlyPrice={selectedPoint.monthlyPrice}
              effectivePrice={effectivePrice}
              annualYearlyTotal={selectedPoint.annualYearlyTotal}
              annualSavings={selectedPoint.annualSavings}
            />
          </div>

          <div className="border-t border-slate-200 bg-white p-5 sm:p-7 lg:p-8 xl:p-10">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p
                  className={cn(
                    "mb-2 text-xs font-extrabold tracking-normal sm:text-sm",
                    pricingUi.accentText,
                  )}
                >
                  Included from your first 5 clients
                </p>
                <h2 className="font-lexend text-2xl font-extrabold tracking-normal text-slate-950 sm:text-3xl">
                  No Pro tier. No Advanced tier. No upgrade traps.
                </h2>
                <p className="mt-3 max-w-[820px] text-base font-medium leading-7 text-slate-600">
                  From your first 5 clients, you get the tools agencies need to
                  create, automate, and deliver client-ready reporting, with API
                  and MCP access included for teams building more advanced
                  workflows.
                </p>
              </div>
            </div>

            <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {includedFeatures.map((feature, index) => (
                <IncludedFeature
                  key={feature.title}
                  feature={feature}
                  highlighted={index === 0}
                />
              ))}
            </ul>

            <div className="mt-6 grid gap-4 rounded-lg border border-slate-200 bg-white p-5 lg:grid-cols-[1fr_auto] lg:items-center lg:p-6">
              <div className="space-y-1">
                <p className="text-base font-bold leading-7 text-slate-950">
                  Start with 5 clients. Get the full agency reporting platform.
                  Scale when you need to.
                </p>
                <p className="text-sm font-medium leading-6 text-slate-600">
                  API and MCP access are included for teams that want to build
                  beyond the UI.
                </p>
              </div>
              <Button
                variant="outline"
                size="lg"
                onClick={openSignup}
                className={pricingUi.secondaryButton}
              >
                Start Free Trial
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
