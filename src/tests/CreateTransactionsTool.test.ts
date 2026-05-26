import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import * as ynab from 'ynab';
import * as CreateTransactionsTool from '../tools/CreateTransactionsTool';

vi.mock('ynab');

describe('CreateTransactionsTool', () => {
  let mockApi: { transactions: { createTransactions: Mock } };

  beforeEach(() => {
    vi.clearAllMocks();
    mockApi = { transactions: { createTransactions: vi.fn() } };
    (ynab.API as any).mockImplementation(() => mockApi);
    process.env.YNAB_BUDGET_ID = 'budget-1';
  });

  it('should create multiple transactions', async () => {
    mockApi.transactions.createTransactions.mockResolvedValue({
      data: { transactions: [{ id: 't1' }, { id: 't2' }] },
    });

    const result = await CreateTransactionsTool.execute(
      {
        transactions: [
          {
            accountId: 'a1',
            date: '2024-01-01',
            amount: -10,
            payeeName: 'Store',
          },
          {
            accountId: 'a1',
            date: '2024-01-02',
            amount: -20,
            payeeId: 'p1',
          },
        ],
      },
      mockApi as any
    );

    expect(mockApi.transactions.createTransactions).toHaveBeenCalled();
    expect(JSON.parse(result.content[0].text).count).toBe(2);
  });
});
