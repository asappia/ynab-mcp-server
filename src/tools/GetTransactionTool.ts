import { z } from "zod";
import * as ynab from "ynab";
import { getErrorMessage } from "./errorUtils.js";
import { getBudgetId } from "./budgetUtils.js";

export const name = "ynab_get_transaction";
export const description = "Returns a single transaction by ID. Amount is in milliunits.";
export const inputSchema = {
  budgetId: z.string().optional().describe("Budget ID (optional, defaults to YNAB_BUDGET_ID)"),
  transactionId: z.string().describe("The transaction ID"),
};

interface GetTransactionInput {
  budgetId?: string;
  transactionId: string;
}

export async function execute(input: GetTransactionInput, api: ynab.API) {
  try {
    const budgetId = getBudgetId(input.budgetId);
    const response = await api.transactions.getTransactionById(
      budgetId,
      input.transactionId
    );
    return {
      content: [{ type: "text" as const, text: JSON.stringify(response.data, null, 2) }],
    };
  } catch (error) {
    console.error("Error getting transaction:", error);
    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({ success: false, error: getErrorMessage(error) }, null, 2),
      }],
    };
  }
}
