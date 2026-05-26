import { z } from "zod";
import * as ynab from "ynab";
import { getErrorMessage } from "./errorUtils.js";
import { getBudgetId } from "./budgetUtils.js";
import {
  listCompactCategories,
  summarizePlanMonth,
  toToolJson,
} from "./responseUtils.js";

export const name = "ynab_get_budget_month";
export const description =
  "Returns a budget month. Default detail=summary (month totals + overspent categories only, LLM-friendly). Use detail=compact for all categories (slim fields), detail=full for raw API payload. Prefer ynab_budget_summary for overspent review. Amounts are milliunits.";
export const inputSchema = {
  budgetId: z.string().optional().describe("Budget ID (optional, defaults to YNAB_BUDGET_ID)"),
  month: z
    .string()
    .regex(/^(current|\d{4}-\d{2}-\d{2})$/)
    .default("current")
    .describe("Budget month in ISO format (e.g. 2016-12-01) or 'current'"),
  detail: z
    .enum(["summary", "compact", "full"])
    .default("summary")
    .describe(
      "summary: month rollup + overspent (default). compact: all visible categories (slim). full: complete API response."
    ),
};

interface GetBudgetMonthInput {
  budgetId?: string;
  month?: string;
  detail?: "summary" | "compact" | "full";
}

export async function execute(input: GetBudgetMonthInput, api: ynab.API) {
  try {
    const budgetId = getBudgetId(input.budgetId);
    const month = input.month || "current";
    const detail = input.detail ?? "summary";
    const response = await api.months.getPlanMonth(budgetId, month);
    const monthData = response.data.month;

    let payload: unknown;
    if (detail === "full") {
      payload = response.data;
    } else if (detail === "compact") {
      payload = {
        month: {
          month: monthData.month,
          note: monthData.note,
          income: monthData.income,
          budgeted: monthData.budgeted,
          activity: monthData.activity,
          to_be_budgeted: monthData.to_be_budgeted,
          age_of_money: monthData.age_of_money,
          amountsNote: "Milliunits; divide by 1000 for dollars.",
          categories: listCompactCategories(monthData.categories),
        },
      };
    } else {
      payload = { month: summarizePlanMonth(monthData) };
    }

    return {
      content: [{ type: "text" as const, text: toToolJson(payload) }],
    };
  } catch (error) {
    console.error("Error getting budget month:", error);
    return {
      content: [{
        type: "text" as const,
        text: toToolJson({ success: false, error: getErrorMessage(error) }),
      }],
    };
  }
}
