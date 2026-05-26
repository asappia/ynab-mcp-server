import { z } from "zod";
import { getErrorMessage } from "./errorUtils.js";
import { getBudgetId } from "./budgetUtils.js";
export const name = "ynab_create_category_group";
export const description = "Creates a new category group.";
export const inputSchema = {
    budgetId: z.string().optional().describe("Budget/plan ID (optional, defaults to YNAB_BUDGET_ID)"),
    name: z.string().describe("Category group name (max 50 characters)"),
};
export async function execute(input, api) {
    try {
        const planId = getBudgetId(input.budgetId);
        const response = await api.categories.createCategoryGroup(planId, {
            category_group: { name: input.name },
        });
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({ success: true, category_group: response.data.category_group }, null, 2),
                }],
        };
    }
    catch (error) {
        console.error("Error creating category group:", error);
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({ success: false, error: getErrorMessage(error) }, null, 2),
                }],
        };
    }
}
