import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CustomersResource } from '../../src/resources/customers.js';
import { HttpClient } from '../../src/http.js';
import { mockResponse } from '../helpers.js';

const BASE = 'https://api.example.test/api/v1';
describe('CustomersResource', () => {
  let mockFetch: ReturnType<typeof vi.fn>;
  let customers: CustomersResource;
  beforeEach(() => {
    mockFetch = vi.fn();
    const client = new HttpClient({ baseUrl: BASE, apiKey: 'k', timeout: 5000, maxRetries: 0, fetchImpl: mockFetch as unknown as typeof fetch });
    customers = new CustomersResource(async () => client);
  });

  it('list hits GET /customers and coerces to array', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse([{ id: 'c1' }]));
    const res = await customers.list();
    expect(res).toEqual([{ id: 'c1' }]);
    expect(mockFetch.mock.calls[0][0]).toContain('/customers');
  });

  it('get hits GET /customers/{id}', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse({ id: 'c1' }));
    const res = await customers.get('c1');
    expect(res).toEqual({ id: 'c1' });
    expect(mockFetch.mock.calls[0][0]).toContain('/customers/c1');
  });

  it('create POSTs to /customers', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse({ id: 'c2' }));
    await customers.create({ name: 'Acme' });
    expect(mockFetch.mock.calls[0][0]).toContain('/customers');
    expect(mockFetch.mock.calls[0][1]).toMatchObject({ method: 'POST', body: JSON.stringify({ name: 'Acme' }) });
  });

  it('update PATCHes /customers/{id}', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse({ id: 'c1' }));
    await customers.update('c1', { name: 'Updated' });
    expect(mockFetch.mock.calls[0][0]).toContain('/customers/c1');
    expect(mockFetch.mock.calls[0][1]).toMatchObject({ method: 'PATCH' });
  });

  it('delete sends DELETE /customers/{id}', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse(null));
    await customers.delete('c1');
    expect(mockFetch.mock.calls[0][0]).toContain('/customers/c1');
    expect(mockFetch.mock.calls[0][1]).toMatchObject({ method: 'DELETE' });
  });

  it('setWhitelists POSTs /customers/{id}/whitelists', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse({}));
    await customers.setWhitelists('c1', { emails: [] });
    expect(mockFetch.mock.calls[0][0]).toContain('/customers/c1/whitelists');
    expect(mockFetch.mock.calls[0][1]).toMatchObject({ method: 'POST' });
  });

  it('setAccountWhitelists POSTs /customers/{id}/accounts/whitelists', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse({}));
    await customers.setAccountWhitelists('c1', { domains: [] });
    expect(mockFetch.mock.calls[0][0]).toContain('/customers/c1/accounts/whitelists');
    expect(mockFetch.mock.calls[0][1]).toMatchObject({ method: 'POST' });
  });
});
