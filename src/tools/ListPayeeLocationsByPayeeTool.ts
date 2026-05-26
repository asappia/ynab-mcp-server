import { z } from "zod";
import * as ynab from "ynab";
import { getErrorMessage } from "./errorUtils.js";
import { getBudgetId } from "./budgetUtils.js";

export const name = "ynab_list_payee_locations_by_payee";
export const description = "Lists all payee locations for a specific payee.";
export const inputSchema = {
  budgetId: z.string().optional().describe("Budget ID (optional, defaults to YNAB_BUDGET_ID)"),
  payeeId: z.string().describe("Payee ID"),
};

interface ListPayeeLocationsByPayeeInput {
  budgetId?: string;
  payeeId: string;
}

export async function execute(input: ListPayeeLocationsByPayeeInput, api: ynab.API) {
  try {
    const budgetId = getBudgetId(input.budgetId);
    const response = await api.payeeLocations.getPayeeLocationsByPayee(
      budgetId,
      input.payeeId
    );

    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({
          payee_locations: response.data.payee_locations,
          count: response.data.payee_locations.length,
        }, null, 2),
      }],
    };
  } catch (error) {
    console.error("Error listing payee locations by payee:", error);
    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({ success: false, error: getErrorMessage(error) }, null, 2),
      }],
    };
  }
}
