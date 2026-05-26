/** Keep MCP tool payloads small enough for LLM context windows. */
export const MAX_TOOL_RESPONSE_CHARS = 48_000;

export type MonthCategoryLike = {
  id: string;
  name: string;
  category_group_id: string;
  category_group_name?: string;
  hidden: boolean;
  deleted: boolean;
  budgeted: number;
  activity: number;
  balance: number;
};

export type CompactMonthCategory = {
  id: string;
  name: string;
  category_group_name?: string;
  budgeted: number;
  activity: number;
  balance: number;
};

export type MonthDetailLike = {
  month: string;
  note?: string;
  income: number;
  budgeted: number;
  activity: number;
  to_be_budgeted: number;
  age_of_money?: number;
  deleted: boolean;
  categories: MonthCategoryLike[];
};

export function compactMonthCategory(
  category: MonthCategoryLike
): CompactMonthCategory | null {
  if (category.deleted || category.hidden) {
    return null;
  }
  return {
    id: category.id,
    name: category.name,
    category_group_name: category.category_group_name,
    budgeted: category.budgeted,
    activity: category.activity,
    balance: category.balance,
  };
}

export function listCompactCategories(
  categories: MonthCategoryLike[]
): CompactMonthCategory[] {
  return categories
    .map(compactMonthCategory)
    .filter((c): c is CompactMonthCategory => c !== null);
}

/** Month totals plus overspent / notable categories — safe default for agents. */
export function summarizePlanMonth(month: MonthDetailLike) {
  const categories = listCompactCategories(month.categories);
  const overspent = categories
    .filter((c) => c.balance < 0)
    .sort((a, b) => a.balance - b.balance);
  const wellFunded = categories
    .filter((c) => c.balance > 0)
    .sort((a, b) => b.balance - a.balance)
    .slice(0, 25);

  return {
    month: month.month,
    note: month.note,
    income: month.income,
    budgeted: month.budgeted,
    activity: month.activity,
    to_be_budgeted: month.to_be_budgeted,
    age_of_money: month.age_of_money,
    amountsNote: "All amounts are milliunits (divide by 1000 for dollars).",
    categoryCount: categories.length,
    overspentCount: overspent.length,
    overspent,
    wellFundedSample: wellFunded,
    hint:
      "For one category use ynab_get_month_category. For full category list use detail=compact or detail=full on ynab_get_budget_month.",
  };
}

export function toToolJson(
  data: unknown,
  options?: { pretty?: boolean; maxChars?: number }
): string {
  const maxChars = options?.maxChars ?? MAX_TOOL_RESPONSE_CHARS;
  const text = JSON.stringify(data, null, options?.pretty ? 2 : undefined);

  if (text.length <= maxChars) {
    return text;
  }

  return JSON.stringify({
    truncated: true,
    originalCharacterCount: text.length,
    maxCharacterCount: maxChars,
    preview: text.slice(0, maxChars),
    hint:
      "Response too large. Retry with detail=summary on ynab_get_budget_month, or use ynab_budget_summary / ynab_get_month_category.",
  });
}
