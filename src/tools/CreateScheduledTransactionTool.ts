import { z } from "zod";
import * as ynab from "ynab";
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

export const name = "ynab_create_scheduled_transaction";
export const description =
  "Creates a scheduled (recurring) transaction with a future date.";
export const inputSchema = {
  budgetId: z.string().optional().describe("Budget ID (optional, defaults to YNAB_BUDGET_ID)"),
  accountId: z.string().describe("Account ID"),
  date: z.string().describe("First/scheduled date in ISO format (future date, within 5 years)"),
  amount: z.number().describe("Amount in dollars (negative for outflow)"),
  frequency: frequencySchema.describe("Recurrence frequency"),
  payeeId: z.string().optional().describe("Payee ID"),
  payeeName: z.string().optional().describe("Payee name (used if payeeId not set)"),
  categoryId: z.string().optional().describe("Category ID"),
  memo: z.string().optional().describe("Memo"),
  flagColor: z.enum(["red", "orange", "yellow", "green", "blue", "purple"]).optional(),
};

interface CreateScheduledTransactionInput {
  budgetId?: string;
  accountId: string;
  date: string;
  amount: number;
  frequency: z.infer<typeof frequencySchema>;
  payeeId?: string;
  payeeName?: string;
  categoryId?: string;
  memo?: string;
  flagColor?: "red" | "orange" | "yellow" | "green" | "blue" | "purple";
}

export async function execute(input: CreateScheduledTransactionInput, api: ynab.API) {
  try {
    const budgetId = getBudgetId(input.budgetId);

    const scheduledTransaction: ynab.SaveScheduledTransaction = {
      account_id: input.accountId,
      date: input.date,
      amount: dollarsToMilliunits(input.amount),
      frequency: input.frequency as ynab.ScheduledTransactionFrequency,
      payee_id: input.payeeId,
      payee_name: input.payeeName,
      category_id: input.categoryId,
      memo: input.memo,
      flag_color: input.flagColor as ynab.TransactionFlagColor | undefined,
    };

    const response = await api.scheduledTransactions.createScheduledTransaction(
      budgetId,
      { scheduled_transaction: scheduledTransaction }
    );

    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({
          success: true,
          scheduled_transaction: response.data.scheduled_transaction,
        }, null, 2),
      }],
    };
  } catch (error) {
    console.error("Error creating scheduled transaction:", error);
    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({ success: false, error: getErrorMessage(error) }, null, 2),
      }],
    };
  }
}
