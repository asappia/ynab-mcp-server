import { z } from "zod";
import { getErrorMessage } from "./errorUtils.js";
import { getBudgetId } from "./budgetUtils.js";
export const name = "ynab_get_budget_month";
export const description = "Returns a single budget month including categories with assigned/activity/available amounts. Use month 'current' or ISO date (e.g. 2024-01-01). Amounts are in milliunits.";
export const inputSchema = {
    budgetId: z.string().optional().describe("Budget ID (optional, defaults to YNAB_BUDGET_ID)"),
    month: z
        .string()
        .regex(/^(current|\d{4}-\d{2}-\d{2})$/)
        .default("current")
        .describe("Budget month in ISO format (e.g. 2016-12-01) or 'current'"),
};
export async function execute(input, api) {
    try {
        const budgetId = getBudgetId(input.budgetId);
        const month = input.month || "current";
        const response = await api.months.getBudgetMonth(budgetId, month);
        return {
            content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
        };
    }
    catch (error) {
        console.error("Error getting budget month:", error);
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({ success: false, error: getErrorMessage(error) }, null, 2),
                }],
        };
    }
}
