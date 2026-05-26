import { z } from "zod";
import { getErrorMessage } from "./errorUtils.js";
import { getBudgetId } from "./budgetUtils.js";
export const name = "ynab_get_month_category";
export const description = "Returns a single category for a specific budget month. Amounts are in milliunits.";
export const inputSchema = {
    budgetId: z.string().optional().describe("Budget ID (optional, defaults to YNAB_BUDGET_ID)"),
    month: z
        .string()
        .regex(/^(current|\d{4}-\d{2}-\d{2})$/)
        .describe("Budget month in ISO format (e.g. 2016-12-01) or 'current'"),
    categoryId: z.string().describe("The category ID"),
};
export async function execute(input, api) {
    try {
        const budgetId = getBudgetId(input.budgetId);
        const response = await api.categories.getMonthCategoryById(budgetId, input.month, input.categoryId);
        return {
            content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
        };
    }
    catch (error) {
        console.error("Error getting month category:", error);
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({ success: false, error: getErrorMessage(error) }, null, 2),
                }],
        };
    }
}
