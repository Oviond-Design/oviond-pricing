import { calculatePrice, pricingTiers } from "./calculate-price";

describe("Basic Plan Pricing", () => {
  const basicPlan = pricingTiers[0];

  test("monthly pricing at key points", () => {
    expect(calculatePrice(basicPlan, 20, "monthly")).toBe(29);
    expect(calculatePrice(basicPlan, 50, "monthly")).toBe(49);
    expect(calculatePrice(basicPlan, 100, "monthly")).toBe(99);

    // Test some intermediate values
    expect(calculatePrice(basicPlan, 35, "monthly")).toBe(39);
    expect(calculatePrice(basicPlan, 75, "monthly")).toBe(79);
  });

  test("yearly pricing at key points", () => {
    expect(calculatePrice(basicPlan, 20, "yearly")).toBe(23); // 29 * 0.8
    expect(calculatePrice(basicPlan, 50, "yearly")).toBe(39); // 49 * 0.8
    expect(calculatePrice(basicPlan, 100, "yearly")).toBe(79); // 99 * 0.8

    // Test some intermediate values
    expect(calculatePrice(basicPlan, 35, "yearly")).toBe(31); // 39 * 0.8
    expect(calculatePrice(basicPlan, 75, "yearly")).toBe(63); // 79 * 0.8
  });

  test("handles out-of-range values", () => {
    expect(calculatePrice(basicPlan, 10, "monthly")).toBe(29); // Minimum price
    expect(calculatePrice(basicPlan, 150, "monthly")).toBe(99); // Maximum price
  });
});

describe("Professional Plan Pricing", () => {
  const professionalPlan = pricingTiers[1];

  test("monthly pricing at key points", () => {
    expect(calculatePrice(professionalPlan, 20, "monthly")).toBe(129);
    expect(calculatePrice(professionalPlan, 50, "monthly")).toBe(249);
    expect(calculatePrice(professionalPlan, 100, "monthly")).toBe(449);

    // Test some intermediate values
    expect(calculatePrice(professionalPlan, 35, "monthly")).toBe(189);
    expect(calculatePrice(professionalPlan, 75, "monthly")).toBe(349);
  });

  test("yearly pricing at key points", () => {
    expect(calculatePrice(professionalPlan, 20, "yearly")).toBe(103); // 129 * 0.8
    expect(calculatePrice(professionalPlan, 50, "yearly")).toBe(199); // 249 * 0.8
    expect(calculatePrice(professionalPlan, 100, "yearly")).toBe(359); // 449 * 0.8

    // Test some intermediate values
    expect(calculatePrice(professionalPlan, 35, "yearly")).toBe(151); // 189 * 0.8
    expect(calculatePrice(professionalPlan, 75, "yearly")).toBe(279); // 349 * 0.8
  });

  test("handles out-of-range values", () => {
    expect(calculatePrice(professionalPlan, 10, "monthly")).toBe(129); // Minimum price
    expect(calculatePrice(professionalPlan, 150, "monthly")).toBe(449); // Maximum price
  });
});
