import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DevicesResource } from '../../src/resources/devices.js';
import { HttpClient } from '../../src/http.js';
import { mockResponse } from '../helpers.js';

const BASE = 'https://api.example.test/api/v1';
describe('DevicesResource', () => {
  let mockFetch: ReturnType<typeof vi.fn>;
  let devices: DevicesResource;
  beforeEach(() => {
    mockFetch = vi.fn();
    const client = new HttpClient({ baseUrl: BASE, apiKey: 'k', timeout: 5000, maxRetries: 0, fetchImpl: mockFetch as unknown as typeof fetch });
    devices = new DevicesResource(async () => client);
  });

  it('listMapped hits /reports/unify-mapped-devices-by-account', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse([{ id: 'd1' }]));
    const res = await devices.listMapped('org1');
    expect(res).toEqual([{ id: 'd1' }]);
    expect(mockFetch.mock.calls[0][0]).toContain('/reports/unify-mapped-devices-by-account');
    expect(mockFetch.mock.calls[0][0]).toContain('organizationIds=org1');
  });

  it('listUnmapped hits /reports/unify-unmapped-devices-by-account', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse([{ id: 'd2' }]));
    const res = await devices.listUnmapped({ organizationIds: 'org1', confidence: 0.8 });
    expect(res).toEqual([{ id: 'd2' }]);
    expect(mockFetch.mock.calls[0][0]).toContain('/reports/unify-unmapped-devices-by-account');
    expect(mockFetch.mock.calls[0][0]).toContain('confidence=0.8');
  });

  it('listIgnored hits /reports/unify-ignored-devices', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse([{ id: 'd3' }]));
    await devices.listIgnored(['org1', 'org2']);
    expect(mockFetch.mock.calls[0][0]).toContain('/reports/unify-ignored-devices');
  });

  it('listOrganizations hits /reports/devices-organizations', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse([{ id: 'o1' }]));
    await devices.listOrganizations();
    expect(mockFetch.mock.calls[0][0]).toContain('/reports/devices-organizations');
  });
});
