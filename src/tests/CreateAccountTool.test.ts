import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import * as ynab from 'ynab';
import * as CreateAccountTool from '../tools/CreateAccountTool';

vi.mock('ynab');

describe('CreateAccountTool', () => {
  let mockApi: { accounts: { createAccount: Mock } };

  beforeEach(() => {
    vi.clearAllMocks();
    mockApi = { accounts: { createAccount: vi.fn() } };
    (ynab.API as any).mockImplementation(() => mockApi);
    process.env.YNAB_BUDGET_ID = 'budget-1';
  });

  it('should create account', async () => {
    mockApi.accounts.createAccount.mockResolvedValue({
      data: { account: { id: 'acct-new', name: 'Savings' } },
    });

    const result = await CreateAccountTool.execute(
      {
        name: 'Savings',
        type: 'savings',
        balance: 100,
      },
      mockApi as any
    );

    expect(mockApi.accounts.createAccount).toHaveBeenCalledWith('budget-1', {
      account: { name: 'Savings', type: 'savings', balance: 100000 },
    });
    expect(JSON.parse(result.content[0].text).success).toBe(true);
  });
});
