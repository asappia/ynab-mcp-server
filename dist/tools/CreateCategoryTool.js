import { z } from "zod";
import { getErrorMessage } from "./errorUtils.js";
import { getBudgetId, dollarsToMilliunits } from "./budgetUtils.js";
export const name = "ynab_create_category";
export const description = "Creates a new category in a category group.";
export const inputSchema = {
    budgetId: z.string().optional().describe("Budget/plan ID (optional, defaults to YNAB_BUDGET_ID)"),
    name: z.string().describe("Category name"),
    categoryGroupId: z.string().describe("Category group ID"),
    note: z.string().optional().describe("Category note"),
    goalTarget: z.number().optional().describe("Goal target in dollars (creates a monthly goal if not configured)"),
    goalTargetDate: z.string().optional().describe("Goal target date (ISO, e.g. 2016-12-01)"),
    goalNeedsWholeAmount: z.boolean().optional().describe("For NEED goals: true = set aside another, false = refill up to"),
};
export async function execute(input, api) {
    try {
        const planId = getBudgetId(input.budgetId);
        const category = {
            name: input.name,
            category_group_id: input.categoryGroupId,
            note: input.note,
            goal_target_date: input.goalTargetDate,
            goal_needs_whole_amount: input.goalNeedsWholeAmount,
        };
        if (input.goalTarget !== undefined) {
            category.goal_target = dollarsToMilliunits(input.goalTarget);
        }
        const response = await api.categories.createCategory(planId, { category });
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({ success: true, category: response.data.category }, null, 2),
                }],
        };
    }
    catch (error) {
        console.error("Error creating category:", error);
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({ success: false, error: getErrorMessage(error) }, null, 2),
                }],
        };
    }
}
