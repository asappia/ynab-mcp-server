import { z } from "zod";
import * as ynab from "ynab";
import { getErrorMessage } from "./errorUtils.js";
import { getBudgetId, dollarsToMilliunits } from "./budgetUtils.js";
const transactionUpdateSchema = z.object({
    id: z.string().optional().describe("Transaction ID (provide id or importId)"),
    importId: z.string().optional().describe("Import ID for bank-imported transactions"),
    accountId: z.string().optional(),
    date: z.string().optional(),
    amount: z.number().optional().describe("Amount in dollars"),
    payeeId: z.string().optional(),
    payeeName: z.string().optional(),
    categoryId: z.string().optional(),
    memo: z.string().optional(),
    cleared: z.enum(["cleared", "uncleared", "reconciled"]).optional(),
    approved: z.boolean().optional(),
    flagColor: z.enum(["red", "orange", "yellow", "green", "blue", "purple"]).optional(),
});
export const name = "ynab_update_transactions";
export const description = "Updates multiple transactions by id or import_id in one API call.";
export const inputSchema = {
    budgetId: z.string().optional().describe("Budget ID (optional, defaults to YNAB_BUDGET_ID)"),
    transactions: z.array(transactionUpdateSchema).min(1).describe("Transaction updates"),
};
function mapClearedStatus(cleared) {
    switch (cleared) {
        case "cleared":
            return ynab.TransactionClearedStatus.Cleared;
        case "reconciled":
            return ynab.TransactionClearedStatus.Reconciled;
        default:
            return ynab.TransactionClearedStatus.Uncleared;
    }
}
function toPatchTransaction(txn) {
    if (!txn.id && !txn.importId) {
        throw new Error("Each transaction update requires id or importId");
    }
    const update = {
        id: txn.id,
        import_id: txn.importId,
    };
    if (txn.accountId !== undefined)
        update.account_id = txn.accountId;
    if (txn.date !== undefined)
        update.date = txn.date;
    if (txn.amount !== undefined)
        update.amount = dollarsToMilliunits(txn.amount);
    if (txn.payeeId !== undefined)
        update.payee_id = txn.payeeId;
    if (txn.payeeName !== undefined)
        update.payee_name = txn.payeeName;
    if (txn.categoryId !== undefined)
        update.category_id = txn.categoryId;
    if (txn.memo !== undefined)
        update.memo = txn.memo;
    if (txn.cleared !== undefined)
        update.cleared = mapClearedStatus(txn.cleared);
    if (txn.approved !== undefined)
        update.approved = txn.approved;
    if (txn.flagColor !== undefined)
        update.flag_color = txn.flagColor;
    return update;
}
export async function execute(input, api) {
    try {
        const budgetId = getBudgetId(input.budgetId);
        const transactions = input.transactions.map(toPatchTransaction);
        const response = await api.transactions.updateTransactions(budgetId, {
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
        console.error("Error updating transactions:", error);
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({ success: false, error: getErrorMessage(error) }, null, 2),
                }],
        };
    }
}
