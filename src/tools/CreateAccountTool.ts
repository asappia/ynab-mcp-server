import { z } from "zod";
import * as ynab from "ynab";
import { getErrorMessage } from "./errorUtils.js";
import { getBudgetId, dollarsToMilliunits } from "./budgetUtils.js";

const accountTypeSchema = z.enum([
  "checking",
  "savings",
  "cash",
  "creditCard",
  "otherAsset",
  "otherLiability",
]);

export const name = "ynab_create_account";
export const description = "Creates a new account in a budget.";
export const inputSchema = {
  budgetId: z.string().optional().describe("Budget ID (optional, defaults to YNAB_BUDGET_ID)"),
  name: z.string().describe("Account name"),
  type: accountTypeSchema.describe("Account type"),
  balance: z.number().describe("Opening balance in dollars"),
};

interface CreateAccountInput {
  budgetId?: string;
  name: string;
  type: z.infer<typeof accountTypeSchema>;
  balance: number;
}

export async function execute(input: CreateAccountInput, api: ynab.API) {
  try {
    const budgetId = getBudgetId(input.budgetId);
    const response = await api.accounts.createAccount(budgetId, {
      account: {
        name: input.name,
        type: input.type as ynab.SaveAccountType,
        balance: dollarsToMilliunits(input.balance),
      },
    });

    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({
          success: true,
          account: response.data.account,
        }, null, 2),
      }],
    };
  } catch (error) {
    console.error("Error creating account:", error);
    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({ success: false, error: getErrorMessage(error) }, null, 2),
      }],
    };
  }
}
