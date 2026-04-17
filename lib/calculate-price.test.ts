import { calculatePrice, pricingTiers } from "./calculate-price";

describe("Professional Plan Pricing", () => {
  const professionalPlan = pricingTiers[0];

  test("monthly pricing at key points", () => {
    // 5 clients = $49, 100 clients = $490
    expect(calculatePrice(professionalPlan, 5, "monthly")).toBe(49);
    expect(calculatePrice(professionalPlan, 50, "monthly")).toBe(258); // Midpoint-ish
    expect(calculatePrice(professionalPlan, 100, "monthly")).toBe(490);

    // Test some intermediate values (steps of 5)
    expect(calculatePrice(professionalPlan, 10, "monthly")).toBe(72);
    expect(calculatePrice(professionalPlan, 25, "monthly")).toBe(142);
    expect(calculatePrice(professionalPlan, 75, "monthly")).toBe(374);
  });

  test("yearly pricing at key points (20% discount)", () => {
    expect(calculatePrice(professionalPlan, 5, "yearly")).toBe(39); // 49 * 0.8
    expect(calculatePrice(professionalPlan, 50, "yearly")).toBe(206); // 258 * 0.8
    expect(calculatePrice(professionalPlan, 100, "yearly")).toBe(392); // 490 * 0.8

    // Test some intermediate values
    expect(calculatePrice(professionalPlan, 10, "yearly")).toBe(58); // 72 * 0.8
    expect(calculatePrice(professionalPlan, 25, "yearly")).toBe(114); // 142 * 0.8
    expect(calculatePrice(professionalPlan, 75, "yearly")).toBe(299); // 374 * 0.8
  });

  test("handles out-of-range values", () => {
    expect(calculatePrice(professionalPlan, 1, "monthly")).toBe(49); // Minimum price (clamped to 5)
    expect(calculatePrice(professionalPlan, 150, "monthly")).toBe(490); // Maximum price (clamped to 100)
  });
});

describe("Enterprise Plan Pricing", () => {
  const enterprisePlan = pricingTiers[1];

  test("returns 0 for enterprise plan (custom pricing)", () => {
    expect(calculatePrice(enterprisePlan, 100, "monthly")).toBe(0);
    expect(calculatePrice(enterprisePlan, 500, "monthly")).toBe(0);
    expect(calculatePrice(enterprisePlan, 100, "yearly")).toBe(0);
  });
});
