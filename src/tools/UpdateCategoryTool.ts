import { z } from "zod";
import * as ynab from "ynab";
import { getErrorMessage } from "./errorUtils.js";
import { getBudgetId, dollarsToMilliunits } from "./budgetUtils.js";

export const name = "ynab_update_category";
export const description =
  "Updates category metadata (name, note, category group, goal target). Does not change month budgeted amounts; use ynab_update_category_budget for that.";
export const inputSchema = {
  budgetId: z.string().optional().describe("Budget ID (optional, defaults to YNAB_BUDGET_ID)"),
  categoryId: z.string().describe("The category ID"),
  name: z.string().optional().describe("Category name"),
  note: z.string().optional().describe("Category note"),
  categoryGroupId: z.string().optional().describe("Move category to this category group ID"),
  goalTarget: z.number().optional().describe("Goal target amount in dollars (only if category has a goal)"),
};

interface UpdateCategoryInput {
  budgetId?: string;
  categoryId: string;
  name?: string;
  note?: string;
  categoryGroupId?: string;
  goalTarget?: number;
}

export async function execute(input: UpdateCategoryInput, api: ynab.API) {
  try {
    const budgetId = getBudgetId(input.budgetId);

    const category: ynab.ExistingCategory = {};
    if (input.name !== undefined) category.name = input.name;
    if (input.note !== undefined) category.note = input.note;
    if (input.categoryGroupId !== undefined) category.category_group_id = input.categoryGroupId;
    if (input.goalTarget !== undefined) category.goal_target = dollarsToMilliunits(input.goalTarget);

    if (Object.keys(category).length === 0) {
      throw new Error("At least one field to update must be provided");
    }

    const response = await api.categories.updateCategory(budgetId, input.categoryId, {
      category,
    });

    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({
          success: true,
          category: response.data.category,
        }, null, 2),
      }],
    };
  } catch (error) {
    console.error("Error updating category:", error);
    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({ success: false, error: getErrorMessage(error) }, null, 2),
      }],
    };
  }
}
