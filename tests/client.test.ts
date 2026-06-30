import { describe, it, expect } from 'vitest';
import { SaasAlertsClient } from '../src/client.js';

describe('SaasAlertsClient', () => {
  it('throws without an apiKey', () => {
    // @ts-expect-error intentional
    expect(() => new SaasAlertsClient({})).toThrow(/apiKey/);
  });
  it('exposes all resource namespaces', () => {
    const c = new SaasAlertsClient({ apiKey: 'k' });
    for (const ns of ['events', 'customers', 'users', 'devices', 'billing', 'reports', 'partner'] as const) {
      expect(c[ns]).toBeDefined();
    }
  });
});
