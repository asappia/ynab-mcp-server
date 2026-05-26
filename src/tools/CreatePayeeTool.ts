import { z } from "zod";
import * as ynab from "ynab";
import { getErrorMessage } from "./errorUtils.js";
import { getBudgetId } from "./budgetUtils.js";

export const name = "ynab_create_payee";
export const description = "Creates a new payee.";
export const inputSchema = {
  budgetId: z.string().optional().describe("Budget/plan ID (optional, defaults to YNAB_BUDGET_ID)"),
  name: z.string().describe("Payee name"),
};

interface CreatePayeeInput {
  budgetId?: string;
  name: string;
}

export async function execute(input: CreatePayeeInput, api: ynab.API) {
  try {
    const planId = getBudgetId(input.budgetId);
    const response = await api.payees.createPayee(planId, {
      payee: { name: input.name },
    });

    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({ success: true, payee: response.data.payee }, null, 2),
      }],
    };
  } catch (error) {
    console.error("Error creating payee:", error);
    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({ success: false, error: getErrorMessage(error) }, null, 2),
      }],
    };
  }
}
