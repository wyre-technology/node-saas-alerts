import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ReportsResource } from '../../src/resources/reports.js';
import { HttpClient } from '../../src/http.js';
import { mockResponse } from '../helpers.js';

const BASE = 'https://api.example.test/api/v1';
describe('ReportsResource', () => {
  let mockFetch: ReturnType<typeof vi.fn>;
  let reports: ReportsResource;
  beforeEach(() => {
    mockFetch = vi.fn();
    const client = new HttpClient({ baseUrl: BASE, apiKey: 'k', timeout: 5000, maxRetries: 0, fetchImpl: mockFetch as unknown as typeof fetch });
    reports = new ReportsResource(async () => client);
  });

  it('listScheduled hits GET /reports/scheduled-report', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse([{ id: 'r1' }]));
    const res = await reports.listScheduled();
    expect(res).toEqual([{ id: 'r1' }]);
    expect(mockFetch.mock.calls[0][0]).toContain('/reports/scheduled-report');
  });

  it('getScheduled hits GET /reports/scheduled-report/{id}', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse({ id: 'r1' }));
    const res = await reports.getScheduled('r1');
    expect(res).toEqual({ id: 'r1' });
    expect(mockFetch.mock.calls[0][0]).toContain('/reports/scheduled-report/r1');
  });

  it('createScheduled POSTs to /reports/scheduled-report', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse({ id: 'r2' }));
    await reports.createScheduled({ name: 'Weekly' });
    expect(mockFetch.mock.calls[0][0]).toContain('/reports/scheduled-report');
    expect(mockFetch.mock.calls[0][1]).toMatchObject({ method: 'POST', body: JSON.stringify({ name: 'Weekly' }) });
  });

  it('deleteScheduled sends DELETE /reports/scheduled-report/{id}', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse(null));
    await reports.deleteScheduled('r1');
    expect(mockFetch.mock.calls[0][0]).toContain('/reports/scheduled-report/r1');
    expect(mockFetch.mock.calls[0][1]).toMatchObject({ method: 'DELETE' });
  });
});
