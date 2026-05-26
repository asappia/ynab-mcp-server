import { z } from "zod";
import { getErrorMessage } from "./errorUtils.js";
import { getBudgetId } from "./budgetUtils.js";
export const name = "ynab_get_scheduled_transaction";
export const description = "Returns a single scheduled transaction by ID.";
export const inputSchema = {
    budgetId: z.string().optional().describe("Budget ID (optional, defaults to YNAB_BUDGET_ID)"),
    scheduledTransactionId: z.string().describe("Scheduled transaction ID"),
};
export async function execute(input, api) {
    try {
        const budgetId = getBudgetId(input.budgetId);
        const response = await api.scheduledTransactions.getScheduledTransactionById(budgetId, input.scheduledTransactionId);
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify(response.data, null, 2),
                }],
        };
    }
    catch (error) {
        console.error("Error getting scheduled transaction:", error);
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({ success: false, error: getErrorMessage(error) }, null, 2),
                }],
        };
    }
}
