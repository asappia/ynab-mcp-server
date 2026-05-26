import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import * as ynab from 'ynab';
import * as UpdatePayeeTool from '../tools/UpdatePayeeTool';

vi.mock('ynab');

describe('UpdatePayeeTool', () => {
  let mockApi: { payees: { updatePayee: Mock } };

  beforeEach(() => {
    vi.clearAllMocks();
    mockApi = { payees: { updatePayee: vi.fn() } };
    (ynab.API as any).mockImplementation(() => mockApi);
    process.env.YNAB_BUDGET_ID = 'budget-1';
  });

  it('should update payee', async () => {
    mockApi.payees.updatePayee.mockResolvedValue({
      data: { payee: { id: 'p1', name: 'New Name' } },
    });

    await UpdatePayeeTool.execute(
      { payeeId: 'p1', name: 'New Name' },
      mockApi as any
    );

    expect(mockApi.payees.updatePayee).toHaveBeenCalledWith('budget-1', 'p1', {
      payee: { name: 'New Name' },
    });
  });
});
