import { describe, it, expect, beforeEach, vi, Mock } from "vitest";
import * as ynab from "ynab";
import * as Tool from "../tools/GetBudgetMonthTool";

vi.mock("ynab");

const sampleMonth = {
  month: "2026-05-01",
  income: 0,
  budgeted: 0,
  activity: 0,
  to_be_budgeted: 0,
  deleted: false,
  categories: [
    {
      id: "c1",
      name: "Test",
      category_group_id: "g1",
      hidden: false,
      deleted: false,
      budgeted: 0,
      activity: 0,
      balance: -5000,
    },
  ],
};

describe("GetBudgetMonthTool", () => {
  let mockApi: { months: { getPlanMonth: Mock } };

  beforeEach(() => {
    vi.clearAllMocks();
    mockApi = { months: { getPlanMonth: vi.fn() } };
    (ynab.API as any).mockImplementation(() => mockApi);
    process.env.YNAB_BUDGET_ID = "budget-1";
  });

  it("returns summary by default", async () => {
    mockApi.months.getPlanMonth.mockResolvedValue({ data: { month: sampleMonth } });
    const result = await Tool.execute({ budgetId: "budget-1", month: "current" }, mockApi as any);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.month.overspent).toHaveLength(1);
    expect(parsed.month.categories).toBeUndefined();
    expect(result.content[0].text.length).toBeLessThan(5000);
  });

  it("returns full payload when detail=full", async () => {
    mockApi.months.getPlanMonth.mockResolvedValue({ data: { month: sampleMonth, server_knowledge: 1 } });
    const result = await Tool.execute(
      { budgetId: "budget-1", month: "current", detail: "full" },
      mockApi as any
    );
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.month).toBeDefined();
    expect(parsed.server_knowledge).toBe(1);
  });

  it("should handle missing budget id", async () => {
    delete process.env.YNAB_BUDGET_ID;
    const result = await Tool.execute({ month: "current" }, mockApi);
    expect(JSON.parse(result.content[0].text).success).toBe(false);
  });
});
