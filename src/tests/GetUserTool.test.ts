import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import * as ynab from 'ynab';
import * as GetUserTool from '../tools/GetUserTool';
vi.mock('ynab');
describe('GetUserTool', () => {
  let mockApi: { user: { getUser: Mock } };
  beforeEach(() => {
    vi.clearAllMocks();
    mockApi = { user: { getUser: vi.fn() } };
    (ynab.API as any).mockImplementation(() => mockApi);
  });
  it('should return user data', async () => {
    mockApi.user.getUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
    const result = await GetUserTool.execute({}, mockApi as any);
    expect(mockApi.user.getUser).toHaveBeenCalled();
    expect(JSON.parse(result.content[0].text).user.id).toBe('u1');
  });
  it('should handle errors', async () => {
    mockApi.user.getUser.mockRejectedValue(new Error('API error'));
    const result = await GetUserTool.execute({}, mockApi as any);
    expect(JSON.parse(result.content[0].text).success).toBe(false);
  });
});
