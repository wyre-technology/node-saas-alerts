import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UsersResource } from '../../src/resources/users.js';
import { HttpClient } from '../../src/http.js';
import { mockResponse } from '../helpers.js';

const BASE = 'https://api.example.test/api/v1';
describe('UsersResource', () => {
  let mockFetch: ReturnType<typeof vi.fn>;
  let users: UsersResource;
  beforeEach(() => {
    mockFetch = vi.fn();
    const client = new HttpClient({ baseUrl: BASE, apiKey: 'k', timeout: 5000, maxRetries: 0, fetchImpl: mockFetch as unknown as typeof fetch });
    users = new UsersResource(async () => client);
  });

  it('getMspUser hits GET /reports/msp-user', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse({ email: 'msp@test.com' }));
    const res = await users.getMspUser();
    expect(res).toEqual({ email: 'msp@test.com' });
    expect(mockFetch.mock.calls[0][0]).toContain('/reports/msp-user');
  });

  it('listPartnerUsers hits GET /reports/partnerUsers and coerces to array', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse([{ id: 'u1' }]));
    const res = await users.listPartnerUsers();
    expect(res).toEqual([{ id: 'u1' }]);
    expect(mockFetch.mock.calls[0][0]).toContain('/reports/partnerUsers');
  });

  it('listByCustomer hits GET /reports/users?customerId=...', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse([{ id: 'u2' }]));
    const res = await users.listByCustomer('cust1');
    expect(res).toEqual([{ id: 'u2' }]);
    expect(mockFetch.mock.calls[0][0]).toContain('/reports/users');
    expect(mockFetch.mock.calls[0][0]).toContain('customerId=cust1');
  });
});
