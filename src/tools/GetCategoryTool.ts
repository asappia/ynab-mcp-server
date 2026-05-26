import { z } from "zod";
import * as ynab from "ynab";
import { getErrorMessage } from "./errorUtils.js";
import { getBudgetId } from "./budgetUtils.js";

export const name = "ynab_get_category";
export const description =
  "Returns a single category for the current budget month (UTC). Amounts are in milliunits.";
export const inputSchema = {
  budgetId: z.string().optional().describe("Budget ID (optional, defaults to YNAB_BUDGET_ID)"),
  categoryId: z.string().describe("The category ID"),
};

interface GetCategoryInput {
  budgetId?: string;
  categoryId: string;
}

export async function execute(input: GetCategoryInput, api: ynab.API) {
  try {
    const budgetId = getBudgetId(input.budgetId);
    const response = await api.categories.getCategoryById(budgetId, input.categoryId);
    return {
      content: [{ type: "text" as const, text: JSON.stringify(response.data, null, 2) }],
    };
  } catch (error) {
    console.error("Error getting category:", error);
    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({ success: false, error: getErrorMessage(error) }, null, 2),
      }],
    };
  }
}
