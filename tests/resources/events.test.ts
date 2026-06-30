import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EventsResource } from '../../src/resources/events.js';
import { HttpClient } from '../../src/http.js';
import { mockResponse } from '../helpers.js';

const BASE = 'https://api.example.test/api/v1';
describe('EventsResource', () => {
  let mockFetch: ReturnType<typeof vi.fn>;
  let events: EventsResource;
  beforeEach(() => {
    mockFetch = vi.fn();
    const client = new HttpClient({ baseUrl: BASE, apiKey: 'k', timeout: 5000, maxRetries: 0, fetchImpl: mockFetch as unknown as typeof fetch });
    events = new EventsResource(async () => client);
  });

  it('query passes filters as query params', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse([{ id: 'e1' }]));
    const res = await events.query({ customerId: 'c1', alertStatus: 'critical', size: 50, eventType: ['x', 'y'] });
    expect(res).toEqual([{ id: 'e1' }]);
    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain('/reports/events?');
    expect(url).toContain('customerId=c1');
    expect(url).toContain('alertStatus=critical');
    expect(url).toContain('size=50');
    expect(url).toContain('eventType=x');
    expect(url).toContain('eventType=y');
  });

  it('query coerces a non-array result to an array', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse({ id: 'single' }));
    expect(await events.query()).toEqual([{ id: 'single' }]);
  });

  it('count hits /reports/events/count', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse({ count: 7 }));
    expect(await events.count({ customerId: 'c1' })).toEqual({ count: 7 });
    expect(mockFetch.mock.calls[0][0]).toContain('/reports/events/count?customerId=c1');
  });

  it('queryAdvanced POSTs the ES body', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse({ hits: [] }));
    await events.queryAdvanced({ query: { match_all: {} } });
    expect(mockFetch.mock.calls[0][0]).toContain('/reports/events/query');
    expect(mockFetch.mock.calls[0][1]).toMatchObject({ method: 'POST', body: JSON.stringify({ query: { match_all: {} } }) });
  });

  it('scroll POSTs the scrollId', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse({ hits: [] }));
    await events.scroll('SCROLL123');
    expect(mockFetch.mock.calls[0][0]).toContain('/reports/events/scroll');
    expect(mockFetch.mock.calls[0][1]).toMatchObject({ method: 'POST', body: JSON.stringify({ scrollId: 'SCROLL123' }) });
  });

  it('recommendedActions hits the alert-recommended-actions endpoint', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse([{ action: 'reset' }]));
    expect(await events.recommendedActions()).toEqual([{ action: 'reset' }]);
    expect(mockFetch.mock.calls[0][0]).toContain('/reports/alert-recommended-actions');
  });
});
