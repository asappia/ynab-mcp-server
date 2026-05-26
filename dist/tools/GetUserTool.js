import { getErrorMessage } from "./errorUtils.js";
export const name = "ynab_get_user";
export const description = "Returns authenticated YNAB user information.";
export const inputSchema = {};
export async function execute(_input, api) {
    try {
        const response = await api.user.getUser();
        return {
            content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
        };
    }
    catch (error) {
        console.error("Error getting user:", error);
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({ success: false, error: getErrorMessage(error) }, null, 2),
                }],
        };
    }
}
