import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import * as ListMoneyMovementsTool from '../tools/ListMoneyMovementsTool';

describe('ListMoneyMovementsTool', () => {
  let mockClient: { moneyMovements: { getMoneyMovements: Mock } };

  beforeEach(() => {
    vi.clearAllMocks();
    mockClient = { moneyMovements: { getMoneyMovements: vi.fn() } };
    process.env.YNAB_BUDGET_ID = 'plan-1';
  });

  it('should list money movements', async () => {
    mockClient.moneyMovements.getMoneyMovements.mockResolvedValue({
      data: { money_movements: [{ id: 'mm1' }] },
    });

    const result = await ListMoneyMovementsTool.execute({}, mockClient as any);

    expect(mockClient.moneyMovements.getMoneyMovements).toHaveBeenCalledWith('plan-1');
    expect(JSON.parse(result.content[0].text).count).toBe(1);
  });
});
