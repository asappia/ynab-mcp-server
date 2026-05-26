import { z } from "zod";
import * as ynab from "ynab";
import { getErrorMessage } from "./errorUtils.js";
import { getBudgetId } from "./budgetUtils.js";

export const name = "ynab_get_budget";
export const description =
  "Returns a single budget with all related entities (full budget export — very large). Prefer ynab_get_budget_month with detail=summary or ynab_budget_summary. Amounts are in milliunits.";
export const inputSchema = {
  budgetId: z.string().optional().describe("Budget ID (optional, defaults to YNAB_BUDGET_ID)"),
  lastKnowledgeOfServer: z
    .number()
    .optional()
    .describe("If set, only entities changed since this server knowledge value are included"),
};

interface GetBudgetInput {
  budgetId?: string;
  lastKnowledgeOfServer?: number;
}

export async function execute(input: GetBudgetInput, api: ynab.API) {
  try {
    const budgetId = getBudgetId(input.budgetId);
    const response = await api.plans.getPlanById(
      budgetId,
      input.lastKnowledgeOfServer
    );
    return {
      content: [{ type: "text" as const, text: JSON.stringify(response.data, null, 2) }],
    };
  } catch (error) {
    console.error("Error getting budget:", error);
    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({ success: false, error: getErrorMessage(error) }, null, 2),
      }],
    };
  }
}
