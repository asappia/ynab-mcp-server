import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import * as ynab from 'ynab';
import * as Tool from '../tools/GetScheduledTransactionTool';
vi.mock('ynab');
describe('GetScheduledTransactionTool', () => {
  let mockApi: any;
  beforeEach(() => {
    vi.clearAllMocks();
    mockApi = { scheduledTransactions: { getScheduledTransactionById: vi.fn() } };
    (ynab.API as any).mockImplementation(() => mockApi);
    process.env.YNAB_BUDGET_ID = 'budget-1';
  });
  it('should call API successfully', async () => {
    mockApi.scheduledTransactions.getScheduledTransactionById.mockResolvedValue({ data: { ok: true } });
    const result = await Tool.execute({ budgetId: 'budget-1', scheduledTransactionId: 'st-1' }, mockApi);
    expect(mockApi.scheduledTransactions.getScheduledTransactionById).toHaveBeenCalled();
    expect(result.content[0].text).toContain('ok');
  });
  it('should handle missing budget id', async () => {
    delete process.env.YNAB_BUDGET_ID;
    const result = await Tool.execute({ scheduledTransactionId: 'st-1' }, mockApi);
    expect(JSON.parse(result.content[0].text).success).toBe(false);
  });
});
