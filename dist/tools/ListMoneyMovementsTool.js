import { z } from "zod";
import { getErrorMessage } from "./errorUtils.js";
import { getBudgetId } from "./budgetUtils.js";
export const name = "ynab_list_money_movements";
export const description = "Lists all money movements for a plan.";
export const inputSchema = {
    budgetId: z.string().optional().describe("Budget/plan ID (optional, defaults to YNAB_BUDGET_ID)"),
};
export async function execute(input, client) {
    try {
        const planId = getBudgetId(input.budgetId);
        const response = await client.moneyMovements.getMoneyMovements(planId);
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        money_movements: response.data.money_movements,
                        count: response.data.money_movements.length,
                    }, null, 2),
                }],
        };
    }
    catch (error) {
        console.error("Error listing money movements:", error);
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({ success: false, error: getErrorMessage(error) }, null, 2),
                }],
        };
    }
}
