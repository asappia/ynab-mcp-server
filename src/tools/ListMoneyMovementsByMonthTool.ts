import { z } from "zod";
import { getErrorMessage } from "./errorUtils.js";
import { getBudgetId } from "./budgetUtils.js";
import type { YnabClient } from "./ynabClient.js";

export const name = "ynab_list_money_movements_by_month";
export const description = "Lists money movements for a specific plan month.";
export const inputSchema = {
  budgetId: z.string().optional().describe("Budget/plan ID (optional, defaults to YNAB_BUDGET_ID)"),
  month: z
    .string()
    .regex(/^(current|\d{4}-\d{2}-\d{2})$/)
    .describe("Plan month (ISO date or 'current')"),
};

interface ListMoneyMovementsByMonthInput {
  budgetId?: string;
  month: string;
}

export async function execute(input: ListMoneyMovementsByMonthInput, client: YnabClient) {
  try {
    const planId = getBudgetId(input.budgetId);
    const response = await client.moneyMovements.getMoneyMovementsByMonth(planId, input.month);

    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({
          money_movements: response.data.money_movements,
          count: response.data.money_movements.length,
        }, null, 2),
      }],
    };
  } catch (error) {
    console.error("Error listing money movements by month:", error);
    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({ success: false, error: getErrorMessage(error) }, null, 2),
      }],
    };
  }
}
