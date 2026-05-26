import { z } from "zod";
import * as ynab from "ynab";
import { getErrorMessage } from "./errorUtils.js";
import { getBudgetId } from "./budgetUtils.js";

export const name = "ynab_update_payee";
export const description = "Updates a payee name.";
export const inputSchema = {
  budgetId: z.string().optional().describe("Budget ID (optional, defaults to YNAB_BUDGET_ID)"),
  payeeId: z.string().describe("The payee ID"),
  name: z.string().describe("New payee name (max 500 characters)"),
};

interface UpdatePayeeInput {
  budgetId?: string;
  payeeId: string;
  name: string;
}

export async function execute(input: UpdatePayeeInput, api: ynab.API) {
  try {
    const budgetId = getBudgetId(input.budgetId);
    const response = await api.payees.updatePayee(budgetId, input.payeeId, {
      payee: { name: input.name },
    });

    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({
          success: true,
          payee: response.data.payee,
        }, null, 2),
      }],
    };
  } catch (error) {
    console.error("Error updating payee:", error);
    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({ success: false, error: getErrorMessage(error) }, null, 2),
      }],
    };
  }
}
