import { z } from "zod";
import { getErrorMessage } from "./errorUtils.js";
import { getBudgetId } from "./budgetUtils.js";
export const name = "ynab_get_budget";
export const description = "Returns a single budget with all related entities (full budget export). Amounts are in milliunits; divide by 1000 for dollars.";
export const inputSchema = {
    budgetId: z.string().optional().describe("Budget ID (optional, defaults to YNAB_BUDGET_ID)"),
    lastKnowledgeOfServer: z
        .number()
        .optional()
        .describe("If set, only entities changed since this server knowledge value are included"),
};
export async function execute(input, api) {
    try {
        const budgetId = getBudgetId(input.budgetId);
        const response = await api.budgets.getBudgetById(budgetId, input.lastKnowledgeOfServer);
        return {
            content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
        };
    }
    catch (error) {
        console.error("Error getting budget:", error);
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({ success: false, error: getErrorMessage(error) }, null, 2),
                }],
        };
    }
}
