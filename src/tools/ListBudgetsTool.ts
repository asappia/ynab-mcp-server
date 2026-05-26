import { z } from "zod";
import * as ynab from "ynab";
import { getErrorMessage } from "./errorUtils.js";

export const name = "ynab_list_budgets";
export const description = "Lists all available budgets from YNAB API";
export const inputSchema = {
  includeAccounts: z
    .boolean()
    .optional()
    .describe("Include account summaries in each budget (default: false)"),
};

interface ListBudgetsInput {
  includeAccounts?: boolean;
}

export async function execute(input: ListBudgetsInput, api: ynab.API) {
  try {
    if (!process.env.YNAB_API_TOKEN) {
      return {
        content: [{ type: "text" as const, text: "YNAB API Token is not set" }]
      };
    }

    console.error("Listing budgets");
    const plansResponse = await api.plans.getPlans(input.includeAccounts ?? false);
    console.error(`Found ${plansResponse.data.plans.length} budgets`);

    const budgets = plansResponse.data.plans.map((budget) => {
      const summary: Record<string, unknown> = {
        id: budget.id,
        name: budget.name,
      };
      if ("accounts" in budget && budget.accounts) {
        summary.accounts = budget.accounts;
      }
      return summary;
    });

    return {
      content: [{ type: "text" as const, text: JSON.stringify(budgets, null, 2) }]
    };
  } catch (error: unknown) {
    console.error("Error listing budgets:", error);
    return {
      content: [{ type: "text" as const, text: JSON.stringify({
        success: false,
        error: getErrorMessage(error),
      }, null, 2) }]
    };
  }
}