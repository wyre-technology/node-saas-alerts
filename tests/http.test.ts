import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HttpClient } from '../src/http.js';
import { AuthenticationError, RateLimitError, NotFoundError, ServerError } from '../src/errors.js';
import { mockResponse } from './helpers.js';

const BASE = 'https://api.example.test/api/v1';
function client(mockFetch: ReturnType<typeof vi.fn>, maxRetries = 0) {
  return new HttpClient({ baseUrl: BASE, apiKey: 'secret-key', timeout: 5000, maxRetries, fetchImpl: mockFetch as unknown as typeof fetch });
}

describe('HttpClient', () => {
  let mockFetch: ReturnType<typeof vi.fn>;
  beforeEach(() => { mockFetch = vi.fn(); });

  it('sends the api_key header and returns parsed JSON', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse([{ id: 1 }]));
    const res = await client(mockFetch).request('/reports/events');
    expect(res).toEqual([{ id: 1 }]);
    expect(mockFetch).toHaveBeenCalledWith(`${BASE}/reports/events`,
      expect.objectContaining({ method: 'GET', headers: expect.objectContaining({ api_key: 'secret-key' }) }));
  });

  it('builds query params (arrays repeated)', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse({}));
    await client(mockFetch).request('/reports/events', { params: { size: 10, eventType: ['a', 'b'], skip: undefined } });
    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain('size=10');
    expect(url).toContain('eventType=a');
    expect(url).toContain('eventType=b');
    expect(url).not.toContain('skip');
  });

  it('serializes a POST body', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse({ count: 3 }));
    await client(mockFetch).request('/reports/events/query', { method: 'POST', body: { q: 'x' } });
    expect(mockFetch.mock.calls[0][1]).toMatchObject({ method: 'POST', body: JSON.stringify({ q: 'x' }) });
  });

  it('maps 401 to AuthenticationError and redacts the key', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse('bad key secret-key', { status: 401 }));
    await expect(client(mockFetch).request('/x')).rejects.toBeInstanceOf(AuthenticationError);
    mockFetch.mockResolvedValueOnce(mockResponse('bad key secret-key', { status: 401 }));
    await expect(client(mockFetch).request('/x')).rejects.toThrow(/\[REDACTED\]/);
  });

  it('maps 404/429/500', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse('', { status: 404 }));
    await expect(client(mockFetch).request('/x')).rejects.toBeInstanceOf(NotFoundError);
    mockFetch.mockResolvedValueOnce(mockResponse('', { status: 429 }));
    await expect(client(mockFetch).request('/x')).rejects.toBeInstanceOf(RateLimitError);
    mockFetch.mockResolvedValueOnce(mockResponse('', { status: 500 }));
    await expect(client(mockFetch, 0).request('/x')).rejects.toBeInstanceOf(ServerError);
  });

  it('retries a 5xx then succeeds', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse('', { status: 503 }));
    mockFetch.mockResolvedValueOnce(mockResponse({ ok: true }));
    const res = await client(mockFetch, 1).request('/x');
    expect(res).toEqual({ ok: true });
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('returns undefined for an empty 200 body', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse('', { status: 200 }));
    expect(await client(mockFetch).request('/x')).toBeUndefined();
  });
});
