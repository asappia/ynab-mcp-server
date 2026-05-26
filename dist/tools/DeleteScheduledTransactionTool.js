import { z } from "zod";
import { getErrorMessage } from "./errorUtils.js";
import { getBudgetId } from "./budgetUtils.js";
export const name = "ynab_delete_scheduled_transaction";
export const description = "Deletes a scheduled transaction.";
export const inputSchema = {
    budgetId: z.string().optional().describe("Budget ID (optional, defaults to YNAB_BUDGET_ID)"),
    scheduledTransactionId: z.string().describe("Scheduled transaction ID"),
};
export async function execute(input, api) {
    try {
        const budgetId = getBudgetId(input.budgetId);
        await api.scheduledTransactions.deleteScheduledTransaction(budgetId, input.scheduledTransactionId);
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        success: true,
                        message: "Scheduled transaction deleted successfully",
                        scheduledTransactionId: input.scheduledTransactionId,
                    }, null, 2),
                }],
        };
    }
    catch (error) {
        console.error("Error deleting scheduled transaction:", error);
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({ success: false, error: getErrorMessage(error) }, null, 2),
                }],
        };
    }
}
