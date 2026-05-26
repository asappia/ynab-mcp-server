import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import * as ynab from 'ynab';
import * as Tool from '../tools/GetCategoryTool';
vi.mock('ynab');
describe('GetCategoryTool', () => {
  let mockApi: any;
  beforeEach(() => {
    vi.clearAllMocks();
    mockApi = { categories: { getCategoryById: vi.fn() } };
    (ynab.API as any).mockImplementation(() => mockApi);
    process.env.YNAB_BUDGET_ID = 'budget-1';
  });
  it('should call API successfully', async () => {
    mockApi.categories.getCategoryById.mockResolvedValue({ data: { ok: true } });
    const result = await Tool.execute({ budgetId: 'budget-1', categoryId: 'cat-1' }, mockApi);
    expect(mockApi.categories.getCategoryById).toHaveBeenCalled();
    expect(result.content[0].text).toContain('ok');
  });
  it('should handle missing budget id', async () => {
    delete process.env.YNAB_BUDGET_ID;
    const result = await Tool.execute({ categoryId: 'cat-1' }, mockApi);
    expect(JSON.parse(result.content[0].text).success).toBe(false);
  });
});
