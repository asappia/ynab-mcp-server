import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import * as CreatePayeeTool from '../tools/CreatePayeeTool';

describe('CreatePayeeTool', () => {
  let mockApi: { payees: { createPayee: Mock } };

  beforeEach(() => {
    vi.clearAllMocks();
    mockApi = { payees: { createPayee: vi.fn() } };
    process.env.YNAB_BUDGET_ID = 'plan-1';
  });

  it('should create a payee', async () => {
    mockApi.payees.createPayee.mockResolvedValue({
      data: { payee: { id: 'p1', name: 'Coffee Shop' } },
    });

    await CreatePayeeTool.execute({ name: 'Coffee Shop' }, mockApi as any);

    expect(mockApi.payees.createPayee).toHaveBeenCalledWith('plan-1', {
      payee: { name: 'Coffee Shop' },
    });
  });
});
