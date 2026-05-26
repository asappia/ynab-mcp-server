import { z } from "zod";
import * as ynab from "ynab";
import { getErrorMessage } from "./errorUtils.js";
import { getBudgetId, dollarsToMilliunits } from "./budgetUtils.js";
const transactionInputSchema = z.object({
    accountId: z.string().describe("Account ID"),
    date: z.string().describe("Transaction date (ISO)"),
    amount: z.number().describe("Amount in dollars"),
    payeeId: z.string().optional(),
    payeeName: z.string().optional(),
    categoryId: z.string().optional(),
    memo: z.string().optional(),
    cleared: z.boolean().optional(),
    approved: z.boolean().optional(),
    flagColor: z.enum(["red", "orange", "yellow", "green", "blue", "purple"]).optional(),
});
export const name = "ynab_create_transactions";
export const description = "Creates multiple transactions in one API call. Each transaction needs accountId, date, amount, and payeeId or payeeName.";
export const inputSchema = {
    budgetId: z.string().optional().describe("Budget ID (optional, defaults to YNAB_BUDGET_ID)"),
    transactions: z.array(transactionInputSchema).min(1).describe("Transactions to create"),
};
function toNewTransaction(txn) {
    if (!txn.payeeId && !txn.payeeName) {
        throw new Error("Each transaction requires payeeId or payeeName");
    }
    return {
        account_id: txn.accountId,
        date: txn.date,
        amount: dollarsToMilliunits(txn.amount),
        payee_id: txn.payeeId,
        payee_name: txn.payeeName,
        category_id: txn.categoryId,
        memo: txn.memo,
        cleared: txn.cleared
            ? ynab.TransactionClearedStatus.Cleared
            : ynab.TransactionClearedStatus.Uncleared,
        approved: txn.approved ?? false,
        flag_color: txn.flagColor,
    };
}
export async function execute(input, api) {
    try {
        const budgetId = getBudgetId(input.budgetId);
        const transactions = input.transactions.map(toNewTransaction);
        const response = await api.transactions.createTransactions(budgetId, {
            transactions,
        });
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        success: true,
                        transactions: response.data.transactions,
                        count: response.data.transactions?.length ?? 0,
                    }, null, 2),
                }],
        };
    }
    catch (error) {
        console.error("Error creating transactions:", error);
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({ success: false, error: getErrorMessage(error) }, null, 2),
                }],
        };
    }
}
