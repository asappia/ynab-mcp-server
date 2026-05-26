import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import * as ynab from 'ynab';
import * as Tool from '../tools/ListPayeeLocationsByPayeeTool';
vi.mock('ynab');
describe('ListPayeeLocationsByPayeeTool', () => {
  let mockApi: any;
  beforeEach(() => {
    vi.clearAllMocks();
    mockApi = { payeeLocations: { getPayeeLocationsByPayee: vi.fn() } };
    (ynab.API as any).mockImplementation(() => mockApi);
    process.env.YNAB_BUDGET_ID = 'budget-1';
  });
  it('should call API successfully', async () => {
    mockApi.payeeLocations.getPayeeLocationsByPayee.mockResolvedValue({
      data: { payee_locations: [{ id: 'loc-1' }] },
    });
    const result = await Tool.execute({ budgetId: 'budget-1', payeeId: 'payee-1' }, mockApi);
    expect(mockApi.payeeLocations.getPayeeLocationsByPayee).toHaveBeenCalled();
    expect(JSON.parse(result.content[0].text).count).toBe(1);
  });
  it('should handle missing budget id', async () => {
    delete process.env.YNAB_BUDGET_ID;
    const result = await Tool.execute({ payeeId: 'payee-1' }, mockApi);
    expect(JSON.parse(result.content[0].text).success).toBe(false);
  });
});
