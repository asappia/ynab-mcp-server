import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import * as ynab from 'ynab';
import * as CreateScheduledTransactionTool from '../tools/CreateScheduledTransactionTool';

vi.mock('ynab');

describe('CreateScheduledTransactionTool', () => {
  let mockApi: { scheduledTransactions: { createScheduledTransaction: Mock } };

  beforeEach(() => {
    vi.clearAllMocks();
    mockApi = { scheduledTransactions: { createScheduledTransaction: vi.fn() } };
    (ynab.API as any).mockImplementation(() => mockApi);
    process.env.YNAB_BUDGET_ID = 'budget-1';
  });

  it('should create scheduled transaction', async () => {
    mockApi.scheduledTransactions.createScheduledTransaction.mockResolvedValue({
      data: { scheduled_transaction: { id: 'st-1' } },
    });

    await CreateScheduledTransactionTool.execute(
      {
        accountId: 'acct-1',
        date: '2025-06-01',
        amount: -50,
        frequency: 'monthly',
        payeeName: 'Rent',
      },
      mockApi as any
    );

    expect(mockApi.scheduledTransactions.createScheduledTransaction).toHaveBeenCalled();
    const call = mockApi.scheduledTransactions.createScheduledTransaction.mock.calls[0];
    expect(call[0]).toBe('budget-1');
    expect(call[1].scheduled_transaction.amount).toBe(-50000);
  });
});
