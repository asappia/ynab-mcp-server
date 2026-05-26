import { z } from "zod";
import * as ynab from "ynab";
import { getErrorMessage } from "./errorUtils.js";
import { getBudgetId } from "./budgetUtils.js";
import { summarizePlanMonth, toToolJson } from "./responseUtils.js";

export const name = "ynab_budget_summary";
export const description =
  "Compact month overview: totals, overspent categories, and open account balances. Prefer this over ynab_get_budget_month for routine budget checks.";
export const inputSchema = {
  budgetId: z.string().optional().describe("The ID of the budget to get a summary for (optional, defaults to the budget set in the YNAB_BUDGET_ID environment variable)"),
  month: z.string().regex(/^(current|\d{4}-\d{2}-\d{2})$/).default("current").describe("The budget month in ISO format (e.g. 2016-12-01). The string 'current' can also be used to specify the current calendar month (UTC)"),
};

interface BudgetSummaryInput {
  budgetId?: string;
  month?: string;
}

export async function execute(input: BudgetSummaryInput, api: ynab.API) {
  try {
    const budgetId = getBudgetId(input.budgetId);
    const month = input.month || "current";

    console.error(`Getting accounts and categories for budget ${budgetId} and month ${month}`);
    const accountsResponse = await api.accounts.getAccounts(budgetId);
    const accounts = accountsResponse.data.accounts
      .filter((account) => account.deleted === false && account.closed === false)
      .map((account) => ({
        id: account.id,
        name: account.name,
        type: account.type,
        balance: account.balance,
        on_budget: account.on_budget,
      }));

    const monthBudget = await api.months.getPlanMonth(budgetId, month);

    return {
      content: [{
        type: "text" as const,
        text: toToolJson({
          month: summarizePlanMonth(monthBudget.data.month),
          accounts,
          amountsNote: "Divide all numbers by 1000 to get dollars.",
        }),
      }],
    };
  } catch (error: unknown) {
    console.error("Error getting budget summary:", error);
    return {
      content: [{
        type: "text" as const,
        text: toToolJson({ success: false, error: getErrorMessage(error) }),
      }],
    };
  }
}
