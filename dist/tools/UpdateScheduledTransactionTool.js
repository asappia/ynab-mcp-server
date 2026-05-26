import { z } from "zod";
import { getErrorMessage } from "./errorUtils.js";
import { getBudgetId, dollarsToMilliunits } from "./budgetUtils.js";
const frequencySchema = z.enum([
    "never",
    "daily",
    "weekly",
    "everyOtherWeek",
    "twiceAMonth",
    "every4Weeks",
    "monthly",
    "everyOtherMonth",
    "every3Months",
    "every4Months",
    "twiceAYear",
    "yearly",
    "everyOtherYear",
]);
export const name = "ynab_update_scheduled_transaction";
export const description = "Updates a scheduled transaction. Provide all fields you want on the scheduled transaction (full replace via API).";
export const inputSchema = {
    budgetId: z.string().optional().describe("Budget ID (optional, defaults to YNAB_BUDGET_ID)"),
    scheduledTransactionId: z.string().describe("Scheduled transaction ID"),
    accountId: z.string().describe("Account ID"),
    date: z.string().describe("Scheduled date in ISO format"),
    amount: z.number().describe("Amount in dollars"),
    frequency: frequencySchema.describe("Recurrence frequency"),
    payeeId: z.string().optional().describe("Payee ID"),
    payeeName: z.string().optional().describe("Payee name"),
    categoryId: z.string().optional().describe("Category ID"),
    memo: z.string().optional().describe("Memo"),
    flagColor: z.enum(["red", "orange", "yellow", "green", "blue", "purple"]).optional(),
};
export async function execute(input, api) {
    try {
        const budgetId = getBudgetId(input.budgetId);
        const scheduledTransaction = {
            account_id: input.accountId,
            date: input.date,
            amount: dollarsToMilliunits(input.amount),
            frequency: input.frequency,
            payee_id: input.payeeId,
            payee_name: input.payeeName,
            category_id: input.categoryId,
            memo: input.memo,
            flag_color: input.flagColor,
        };
        const response = await api.scheduledTransactions.updateScheduledTransaction(budgetId, input.scheduledTransactionId, { scheduled_transaction: scheduledTransaction });
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        success: true,
                        scheduled_transaction: response.data.scheduled_transaction,
                    }, null, 2),
                }],
        };
    }
    catch (error) {
        console.error("Error updating scheduled transaction:", error);
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({ success: false, error: getErrorMessage(error) }, null, 2),
                }],
        };
    }
}
