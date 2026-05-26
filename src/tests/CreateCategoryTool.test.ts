import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import * as CreateCategoryTool from '../tools/CreateCategoryTool';

describe('CreateCategoryTool', () => {
  let mockApi: { categories: { createCategory: Mock } };

  beforeEach(() => {
    vi.clearAllMocks();
    mockApi = { categories: { createCategory: vi.fn() } };
    process.env.YNAB_BUDGET_ID = 'plan-1';
  });

  it('should create a category', async () => {
    mockApi.categories.createCategory.mockResolvedValue({
      data: { category: { id: 'c1', name: 'Groceries' } },
    });

    const result = await CreateCategoryTool.execute(
      { name: 'Groceries', categoryGroupId: 'g1' },
      mockApi as any
    );

    expect(mockApi.categories.createCategory).toHaveBeenCalledWith('plan-1', {
      category: expect.objectContaining({ name: 'Groceries', category_group_id: 'g1' }),
    });
    expect(JSON.parse(result.content[0].text).success).toBe(true);
  });
});
