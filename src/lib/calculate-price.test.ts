import { calculatePrice } from "./calculate-price"
import { pricingTiers } from "./pricing-data"
import { describe, expect, test } from "vitest"

describe("Starter Plan Pricing", () => {
  const starterPlan = pricingTiers[0]

  test("monthly pricing at key points", () => {
    expect(calculatePrice(starterPlan, 3, "monthly")).toBe(39)
    expect(calculatePrice(starterPlan, 19, "monthly")).toBe(119)

    // Test some intermediate values
    expect(calculatePrice(starterPlan, 11, "monthly")).toBe(79)
    expect(calculatePrice(starterPlan, 15, "monthly")).toBe(99)
  })

  test("yearly pricing at key points", () => {
    expect(calculatePrice(starterPlan, 3, "yearly")).toBe(31) // 39 * 0.8
    expect(calculatePrice(starterPlan, 19, "yearly")).toBe(95) // 119 * 0.8

    // Test some intermediate values
    expect(calculatePrice(starterPlan, 11, "yearly")).toBe(63) // 79 * 0.8
    expect(calculatePrice(starterPlan, 15, "yearly")).toBe(79) // 99 * 0.8
  })

  test("pricing progression is smooth", () => {
    let prevPrice = 0
    for (let i = 3; i <= 19; i++) {
      const price = calculatePrice(starterPlan, i, "monthly")
      expect(price).toBeGreaterThan(prevPrice)
      expect(price - prevPrice).toBeLessThanOrEqual(10) // Ensure no large jumps
      prevPrice = price
    }
  })

  test("handles out-of-range values", () => {
    expect(calculatePrice(starterPlan, 1, "monthly")).toBe(39) // Minimum price
    expect(calculatePrice(starterPlan, 25, "monthly")).toBe(119) // Maximum price
  })
})

describe("Professional Plan Pricing", () => {
  const professionalPlan = pricingTiers[1]

  test("monthly pricing", () => {
    expect(calculatePrice(professionalPlan, 20, "monthly")).toBe(129)
    expect(calculatePrice(professionalPlan, 60, "monthly")).toBe(289)
    expect(calculatePrice(professionalPlan, 100, "monthly")).toBe(449)
  })

  test("yearly pricing", () => {
    expect(calculatePrice(professionalPlan, 20, "yearly")).toBe(103) // 129 * 0.8
    expect(calculatePrice(professionalPlan, 60, "yearly")).toBe(231) // 289 * 0.8
    expect(calculatePrice(professionalPlan, 100, "yearly")).toBe(359) // 449 * 0.8
  })
})

describe("Enterprise Plan Pricing", () => {
  const enterprisePlan = pricingTiers[2]

  test("always returns 0", () => {
    expect(calculatePrice(enterprisePlan, 100, "monthly")).toBe(0)
    expect(calculatePrice(enterprisePlan, 1000, "yearly")).toBe(0)
  })
})

