import { z } from "zod";
import { getErrorMessage } from "./errorUtils.js";
import { getBudgetId } from "./budgetUtils.js";
export const name = "ynab_create_payee";
export const description = "Creates a new payee.";
export const inputSchema = {
    budgetId: z.string().optional().describe("Budget/plan ID (optional, defaults to YNAB_BUDGET_ID)"),
    name: z.string().describe("Payee name"),
};
export async function execute(input, api) {
    try {
        const planId = getBudgetId(input.budgetId);
        const response = await api.payees.createPayee(planId, {
            payee: { name: input.name },
        });
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({ success: true, payee: response.data.payee }, null, 2),
                }],
        };
    }
    catch (error) {
        console.error("Error creating payee:", error);
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({ success: false, error: getErrorMessage(error) }, null, 2),
                }],
        };
    }
}
