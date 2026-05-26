import { z } from "zod";
import * as ynab from "ynab";
import { getErrorMessage } from "./errorUtils.js";
import { getBudgetId } from "./budgetUtils.js";

export const name = "ynab_get_account";
export const description = "Returns a single account. Balances are in milliunits.";
export const inputSchema = {
  budgetId: z.string().optional().describe("Budget ID (optional, defaults to YNAB_BUDGET_ID)"),
  accountId: z.string().describe("The account ID"),
};

interface GetAccountInput {
  budgetId?: string;
  accountId: string;
}

export async function execute(input: GetAccountInput, api: ynab.API) {
  try {
    const budgetId = getBudgetId(input.budgetId);
    const response = await api.accounts.getAccountById(budgetId, input.accountId);
    return {
      content: [{ type: "text" as const, text: JSON.stringify(response.data, null, 2) }],
    };
  } catch (error) {
    console.error("Error getting account:", error);
    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({ success: false, error: getErrorMessage(error) }, null, 2),
      }],
    };
  }
}
