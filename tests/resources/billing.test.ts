import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BillingResource } from '../../src/resources/billing.js';
import { HttpClient } from '../../src/http.js';
import { mockResponse } from '../helpers.js';

const BASE = 'https://api.example.test/api/v1';
describe('BillingResource', () => {
  let mockFetch: ReturnType<typeof vi.fn>;
  let billing: BillingResource;
  beforeEach(() => {
    mockFetch = vi.fn();
    const client = new HttpClient({ baseUrl: BASE, apiKey: 'k', timeout: 5000, maxRetries: 0, fetchImpl: mockFetch as unknown as typeof fetch });
    billing = new BillingResource(async () => client);
  });

  it('getDetails hits /reports/billing-details?billingDate=...', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse({ total: 100 }));
    const res = await billing.getDetails('2024-01-01');
    expect(res).toEqual({ total: 100 });
    expect(mockFetch.mock.calls[0][0]).toContain('/reports/billing-details');
    expect(mockFetch.mock.calls[0][0]).toContain('billingDate=2024-01-01');
  });

  it('listDates hits /reports/billing-dates and coerces to array', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse(['2024-01-01', '2024-02-01']));
    const res = await billing.listDates();
    expect(res).toEqual(['2024-01-01', '2024-02-01']);
    expect(mockFetch.mock.calls[0][0]).toContain('/reports/billing-dates');
  });
});
