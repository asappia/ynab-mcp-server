import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import * as ynab from 'ynab';
import * as Tool from '../tools/GetMonthCategoryTool';
vi.mock('ynab');
describe('GetMonthCategoryTool', () => {
  let mockApi: any;
  beforeEach(() => {
    vi.clearAllMocks();
    mockApi = { categories: { getMonthCategoryById: vi.fn() } };
    (ynab.API as any).mockImplementation(() => mockApi);
    process.env.YNAB_BUDGET_ID = 'budget-1';
  });
  it('should call API successfully', async () => {
    mockApi.categories.getMonthCategoryById.mockResolvedValue({ data: { ok: true } });
    const result = await Tool.execute({ budgetId: 'budget-1', month: '2024-01-01', categoryId: 'cat-1' }, mockApi);
    expect(mockApi.categories.getMonthCategoryById).toHaveBeenCalled();
    expect(result.content[0].text).toContain('ok');
  });
  it('should handle missing budget id', async () => {
    delete process.env.YNAB_BUDGET_ID;
    const result = await Tool.execute({ month: '2024-01-01', categoryId: 'cat-1' }, mockApi);
    expect(JSON.parse(result.content[0].text).success).toBe(false);
  });
});
