import { describe, expect, test } from "vitest";
import {
  agencyPricingTable,
  calculateAgencyEffectivePrice,
  calculateAgencyPrice,
  getAgencyPricingPoint,
} from "./calculate-price";

describe("Agency Plan Pricing", () => {
  function getPointByClients(clients: number) {
    const point = agencyPricingTable.find((entry) => entry.clients === clients);

    expect(point).toBeDefined();

    return point!;
  }

  test("contains exact CSV pricing values for representative client counts", () => {
    expect(agencyPricingTable[0]).toEqual({
      clients: 5,
      pricePerClient: 9.8,
      monthlyPrice: 49,
      annualMonthlyPrice: 39,
      annualYearlyTotal: 468,
      annualSavings: 120,
    });

    expect(getPointByClients(100)).toEqual({
      clients: 100,
      pricePerClient: 6.95,
      monthlyPrice: 695,
      annualMonthlyPrice: 556,
      annualYearlyTotal: 6672,
      annualSavings: 1668,
    });

    expect(getPointByClients(500)).toEqual({
      clients: 500,
      pricePerClient: 5.59,
      monthlyPrice: 2795,
      annualMonthlyPrice: 2236,
      annualYearlyTotal: 26832,
      annualSavings: 6708,
    });

    expect(agencyPricingTable.at(-1)).toEqual({
      clients: 1000,
      pricePerClient: 5,
      monthlyPrice: 4995,
      annualMonthlyPrice: 3996,
      annualYearlyTotal: 47952,
      annualSavings: 11988,
    });
  });

  test("contains the exact CSV step sequence through 1000 clients", () => {
    const clients = agencyPricingTable.map((entry) => entry.clients);

    expect(agencyPricingTable).toHaveLength(65);
    expect(clients[0]).toBe(5);
    expect(clients.at(-1)).toBe(1000);
    expect(clients.slice(0, 20)).toEqual([
      5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95,
      100,
    ]);
    expect(clients.slice(20, 60)).toEqual([
      110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250,
      260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400,
      410, 420, 430, 440, 450, 460, 470, 480, 490, 500,
    ]);
    expect(clients.slice(60)).toEqual([600, 700, 800, 900, 1000]);
  });

  test("returns monthly price for the selected band", () => {
    expect(calculateAgencyPrice(getAgencyPricingPoint(0), "monthly")).toBe(49);
    expect(calculateAgencyPrice(getPointByClients(100), "monthly")).toBe(695);
    expect(calculateAgencyPrice(getAgencyPricingPoint(64), "monthly")).toBe(
      4995,
    );
  });

  test("returns exact annual monthly price from the CSV", () => {
    expect(calculateAgencyPrice(getAgencyPricingPoint(0), "yearly")).toBe(39);
    expect(calculateAgencyPrice(getPointByClients(100), "yearly")).toBe(556);
    expect(calculateAgencyPrice(getAgencyPricingPoint(64), "yearly")).toBe(
      3996,
    );
  });

  test("calculates effective price per client for the active billing cycle", () => {
    expect(
      calculateAgencyEffectivePrice(getAgencyPricingPoint(0), "monthly"),
    ).toBe(9.8);
    expect(
      calculateAgencyEffectivePrice(getPointByClients(500), "monthly"),
    ).toBe(5.59);
    expect(
      calculateAgencyEffectivePrice(getPointByClients(1000), "yearly"),
    ).toBeCloseTo(3.996);
  });

  test("clamps out-of-range slider indexes", () => {
    expect(getAgencyPricingPoint(-1).clients).toBe(5);
    expect(getAgencyPricingPoint(999).clients).toBe(1000);
  });
});
