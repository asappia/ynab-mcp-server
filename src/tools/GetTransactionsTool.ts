import { z } from "zod";
import * as ynab from "ynab";
import { getErrorMessage } from "./errorUtils.js";
import { getBudgetId } from "./budgetUtils.js";

export const name = "ynab_get_transactions";
export const description = "Gets transactions from a budget with optional filters. Can filter by month, date range, account, category, payee, or approval status. When month is set, account/category/payee filters are ignored.";
export const inputSchema = {
  budgetId: z.string().optional().describe("The ID of the budget (optional, defaults to YNAB_BUDGET_ID environment variable)"),
  month: z.string().regex(/^(current|\d{4}-\d{2}-\d{2})$/).optional().describe("Filter to transactions in this budget month (ISO date or 'current'). Takes precedence over account/category/payee filters."),
  sinceDate: z.string().optional().describe("Only return transactions on or after this date (ISO format: 2024-01-01)"),
  type: z.enum(["all", "uncategorized", "unapproved"]).optional().describe("Filter by transaction type. Defaults to 'all'."),
  accountId: z.string().optional().describe("Filter to only transactions in this account"),
  categoryId: z.string().optional().describe("Filter to only transactions in this category"),
  payeeId: z.string().optional().describe("Filter to only transactions with this payee"),
  limit: z.number().optional().describe("Maximum number of transactions to return (default: 100)"),
};

interface GetTransactionsInput {
  budgetId?: string;
  month?: string;
  sinceDate?: string;
  type?: "all" | "uncategorized" | "unapproved";
  accountId?: string;
  categoryId?: string;
  payeeId?: string;
  limit?: number;
}


function mapTransactionType(type?: string): ynab.GetTransactionsTypeEnum | undefined {
  switch (type) {
    case "uncategorized":
      return ynab.GetTransactionsTypeEnum.Uncategorized;
    case "unapproved":
      return ynab.GetTransactionsTypeEnum.Unapproved;
    default:
      return undefined;
  }
}

interface TransactionData {
  id: string;
  date: string;
  amount: number;
  memo?: string | null;
  approved: boolean;
  cleared: string;
  account_name?: string | null;
  payee_name?: string | null;
  category_name?: string | null;
  flag_color?: string | null;
  transfer_account_id?: string | null;
  deleted: boolean;
}

export async function execute(input: GetTransactionsInput, api: ynab.API) {
  try {
    const budgetId = getBudgetId(input.budgetId);
    const limit = input.limit || 100;

    let rawTransactions: TransactionData[];

    // Use the appropriate API method based on filters (month takes precedence)
    if (input.month) {
      const response = await api.transactions.getTransactionsByMonth(
        budgetId,
        input.month,
        input.sinceDate,
        mapTransactionType(input.type) as ynab.GetTransactionsByMonthTypeEnum
      );
      rawTransactions = response.data.transactions;
    } else if (input.accountId) {
      const response = await api.transactions.getTransactionsByAccount(
        budgetId,
        input.accountId,
        input.sinceDate,
        mapTransactionType(input.type) as ynab.GetTransactionsByAccountTypeEnum
      );
      rawTransactions = response.data.transactions;
    } else if (input.categoryId) {
      const response = await api.transactions.getTransactionsByCategory(
        budgetId,
        input.categoryId,
        input.sinceDate,
        mapTransactionType(input.type) as ynab.GetTransactionsByCategoryTypeEnum
      );
      rawTransactions = response.data.transactions;
    } else if (input.payeeId) {
      const response = await api.transactions.getTransactionsByPayee(
        budgetId,
        input.payeeId,
        input.sinceDate,
        mapTransactionType(input.type) as ynab.GetTransactionsByPayeeTypeEnum
      );
      rawTransactions = response.data.transactions;
    } else {
      const response = await api.transactions.getTransactions(
        budgetId,
        input.sinceDate,
        mapTransactionType(input.type)
      );
      rawTransactions = response.data.transactions;
    }

    // Filter out deleted and apply limit
    const transactions = rawTransactions
      .filter((txn) => !txn.deleted)
      .slice(0, limit)
      .map((txn) => ({
        id: txn.id,
        date: txn.date,
        amount: (txn.amount / 1000).toFixed(2),
        memo: txn.memo,
        approved: txn.approved,
        cleared: txn.cleared,
        account_name: txn.account_name,
        payee_name: txn.payee_name,
        category_name: txn.category_name,
        flag_color: txn.flag_color,
        transfer_account_id: txn.transfer_account_id,
      }));

    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({
          transactions,
          transaction_count: transactions.length,
          total_available: rawTransactions.filter((t) => !t.deleted).length,
        }, null, 2),
      }],
    };
  } catch (error) {
    console.error("Error getting transactions:", error);
    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({
          success: false,
          error: getErrorMessage(error),
        }, null, 2),
      }],
    };
  }
}
