import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PartnerResource } from '../../src/resources/partner.js';
import { HttpClient } from '../../src/http.js';
import { mockResponse } from '../helpers.js';

const BASE = 'https://api.example.test/api/v1';
describe('PartnerResource', () => {
  let mockFetch: ReturnType<typeof vi.fn>;
  let partner: PartnerResource;
  beforeEach(() => {
    mockFetch = vi.fn();
    const client = new HttpClient({ baseUrl: BASE, apiKey: 'k', timeout: 5000, maxRetries: 0, fetchImpl: mockFetch as unknown as typeof fetch });
    partner = new PartnerResource(async () => client);
  });

  it('getProfile hits GET /reports/partners/profile', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse({ name: 'WYRE' }));
    const res = await partner.getProfile();
    expect(res).toEqual({ name: 'WYRE' });
    expect(mockFetch.mock.calls[0][0]).toContain('/reports/partners/profile');
  });

  it('updateBranding POSTs to /reports/partners/branding', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse({}));
    await partner.updateBranding({ logo: 'url' });
    expect(mockFetch.mock.calls[0][0]).toContain('/reports/partners/branding');
    expect(mockFetch.mock.calls[0][1]).toMatchObject({ method: 'POST', body: JSON.stringify({ logo: 'url' }) });
  });
});
