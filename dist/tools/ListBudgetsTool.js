import { z } from "zod";
import { getErrorMessage } from "./errorUtils.js";
export const name = "ynab_list_budgets";
export const description = "Lists all available budgets from YNAB API";
export const inputSchema = {
    includeAccounts: z
        .boolean()
        .optional()
        .describe("Include account summaries in each budget (default: false)"),
};
export async function execute(input, api) {
    try {
        if (!process.env.YNAB_API_TOKEN) {
            return {
                content: [{ type: "text", text: "YNAB API Token is not set" }]
            };
        }
        console.error("Listing budgets");
        const budgetsResponse = await api.budgets.getBudgets(input.includeAccounts ?? false);
        console.error(`Found ${budgetsResponse.data.budgets.length} budgets`);
        const budgets = budgetsResponse.data.budgets.map((budget) => {
            const summary = {
                id: budget.id,
                name: budget.name,
            };
            if ("accounts" in budget && budget.accounts) {
                summary.accounts = budget.accounts;
            }
            return summary;
        });
        return {
            content: [{ type: "text", text: JSON.stringify(budgets, null, 2) }]
        };
    }
    catch (error) {
        console.error("Error listing budgets:", error);
        return {
            content: [{ type: "text", text: JSON.stringify({
                        success: false,
                        error: getErrorMessage(error),
                    }, null, 2) }]
        };
    }
}
