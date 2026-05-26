import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import * as ynab from 'ynab';
import * as DeleteScheduledTransactionTool from '../tools/DeleteScheduledTransactionTool';

vi.mock('ynab');

describe('DeleteScheduledTransactionTool', () => {
  let mockApi: { scheduledTransactions: { deleteScheduledTransaction: Mock } };

  beforeEach(() => {
    vi.clearAllMocks();
    mockApi = { scheduledTransactions: { deleteScheduledTransaction: vi.fn() } };
    (ynab.API as any).mockImplementation(() => mockApi);
    process.env.YNAB_BUDGET_ID = 'budget-1';
  });

  it('should delete scheduled transaction', async () => {
    mockApi.scheduledTransactions.deleteScheduledTransaction.mockResolvedValue({});

    const result = await DeleteScheduledTransactionTool.execute(
      { scheduledTransactionId: 'st-1' },
      mockApi as any
    );

    expect(mockApi.scheduledTransactions.deleteScheduledTransaction).toHaveBeenCalledWith(
      'budget-1',
      'st-1'
    );
    expect(JSON.parse(result.content[0].text).success).toBe(true);
  });
});
