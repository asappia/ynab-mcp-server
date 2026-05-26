import { describe, it, expect } from "vitest";
import {
  summarizePlanMonth,
  toToolJson,
  listCompactCategories,
} from "../tools/responseUtils.js";

describe("responseUtils", () => {
  const sampleMonth = {
    month: "2026-05-01",
    income: 1000000,
    budgeted: 900000,
    activity: -800000,
    to_be_budgeted: 100000,
    deleted: false,
    categories: [
      {
        id: "c1",
        name: "Groceries",
        category_group_id: "g1",
        category_group_name: "Monthly",
        hidden: false,
        deleted: false,
        budgeted: 50000,
        activity: -60000,
        balance: -10000,
      },
      {
        id: "c2",
        name: "Hidden",
        category_group_id: "g1",
        hidden: true,
        deleted: false,
        budgeted: 0,
        activity: 0,
        balance: 0,
      },
    ],
  };

  it("summarizePlanMonth excludes hidden and lists overspent", () => {
    const summary = summarizePlanMonth(sampleMonth);
    expect(summary.categoryCount).toBe(1);
    expect(summary.overspent).toHaveLength(1);
    expect(summary.overspent[0].name).toBe("Groceries");
  });

  it("toToolJson truncates very large payloads", () => {
    const huge = { data: "x".repeat(60_000) };
    const text = toToolJson(huge, { maxChars: 1000 });
    const parsed = JSON.parse(text);
    expect(parsed.truncated).toBe(true);
  });

  it("listCompactCategories filters hidden and deleted", () => {
    const list = listCompactCategories(sampleMonth.categories);
    expect(list).toHaveLength(1);
  });
});
