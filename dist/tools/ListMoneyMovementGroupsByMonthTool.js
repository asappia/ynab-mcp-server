import { z } from "zod";
import { getErrorMessage } from "./errorUtils.js";
import { getBudgetId } from "./budgetUtils.js";
export const name = "ynab_list_money_movement_groups_by_month";
export const description = "Lists money movement groups for a specific plan month.";
export const inputSchema = {
    budgetId: z.string().optional().describe("Budget/plan ID (optional, defaults to YNAB_BUDGET_ID)"),
    month: z
        .string()
        .regex(/^(current|\d{4}-\d{2}-\d{2})$/)
        .describe("Plan month (ISO date or 'current')"),
};
export async function execute(input, client) {
    try {
        const planId = getBudgetId(input.budgetId);
        const response = await client.moneyMovements.getMoneyMovementGroupsByMonth(planId, input.month);
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        money_movement_groups: response.data.money_movement_groups,
                        count: response.data.money_movement_groups.length,
                    }, null, 2),
                }],
        };
    }
    catch (error) {
        console.error("Error listing money movement groups by month:", error);
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({ success: false, error: getErrorMessage(error) }, null, 2),
                }],
        };
    }
}
