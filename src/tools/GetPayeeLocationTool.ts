import { z } from "zod";
import * as ynab from "ynab";
import { getErrorMessage } from "./errorUtils.js";
import { getBudgetId } from "./budgetUtils.js";

export const name = "ynab_get_payee_location";
export const description = "Returns a single payee location by ID.";
export const inputSchema = {
  budgetId: z.string().optional().describe("Budget ID (optional, defaults to YNAB_BUDGET_ID)"),
  payeeLocationId: z.string().describe("Payee location ID"),
};

interface GetPayeeLocationInput {
  budgetId?: string;
  payeeLocationId: string;
}

export async function execute(input: GetPayeeLocationInput, api: ynab.API) {
  try {
    const budgetId = getBudgetId(input.budgetId);
    const response = await api.payeeLocations.getPayeeLocationById(
      budgetId,
      input.payeeLocationId
    );

    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify(response.data, null, 2),
      }],
    };
  } catch (error) {
    console.error("Error getting payee location:", error);
    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({ success: false, error: getErrorMessage(error) }, null, 2),
      }],
    };
  }
}
