import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import * as ynab from 'ynab';
import * as UpdateTransactionsTool from '../tools/UpdateTransactionsTool';

vi.mock('ynab');

describe('UpdateTransactionsTool', () => {
  let mockApi: { transactions: { updateTransactions: Mock } };

  beforeEach(() => {
    vi.clearAllMocks();
    mockApi = { transactions: { updateTransactions: vi.fn() } };
    (ynab.API as any).mockImplementation(() => mockApi);
    process.env.YNAB_BUDGET_ID = 'budget-1';
  });

  it('should update multiple transactions', async () => {
    mockApi.transactions.updateTransactions.mockResolvedValue({
      data: { transactions: [{ id: 't1', approved: true }] },
    });

    await UpdateTransactionsTool.execute(
      {
        transactions: [{ id: 't1', approved: true }, { id: 't2', approved: false }],
      },
      mockApi as any
    );

    expect(mockApi.transactions.updateTransactions).toHaveBeenCalledWith('budget-1', {
      transactions: [
        { id: 't1', approved: true },
        { id: 't2', approved: false },
      ],
    });
  });

  it('should require id or importId', async () => {
    const result = await UpdateTransactionsTool.execute(
      { transactions: [{ approved: true }] },
      mockApi as any
    );
    expect(JSON.parse(result.content[0].text).success).toBe(false);
  });
});
