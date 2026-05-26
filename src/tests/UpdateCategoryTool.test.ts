import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import * as ynab from 'ynab';
import * as UpdateCategoryTool from '../tools/UpdateCategoryTool';

vi.mock('ynab');

describe('UpdateCategoryTool', () => {
  let mockApi: { categories: { updateCategory: Mock } };

  beforeEach(() => {
    vi.clearAllMocks();
    mockApi = { categories: { updateCategory: vi.fn() } };
    (ynab.API as any).mockImplementation(() => mockApi);
    process.env.YNAB_BUDGET_ID = 'budget-1';
  });

  it('should update category name', async () => {
    mockApi.categories.updateCategory.mockResolvedValue({
      data: { category: { id: 'c1', name: 'Groceries' } },
    });

    await UpdateCategoryTool.execute(
      { categoryId: 'c1', name: 'Groceries' },
      mockApi as any
    );

    expect(mockApi.categories.updateCategory).toHaveBeenCalledWith('budget-1', 'c1', {
      category: { name: 'Groceries' },
    });
  });

  it('should require at least one field', async () => {
    const result = await UpdateCategoryTool.execute(
      { categoryId: 'c1' },
      mockApi as any
    );
    expect(JSON.parse(result.content[0].text).success).toBe(false);
  });
});
