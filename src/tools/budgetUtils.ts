export function getBudgetId(inputBudgetId?: string): string {
  const budgetId = inputBudgetId || process.env.YNAB_BUDGET_ID || "";
  if (!budgetId) {
    throw new Error(
      "No budget ID provided. Please provide a budget ID or set the YNAB_BUDGET_ID environment variable."
    );
  }
  return budgetId;
}

export function dollarsToMilliunits(dollars: number): number {
  return Math.round(dollars * 1000);
}
