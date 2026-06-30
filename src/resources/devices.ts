import type { HttpClient } from '../http.js';
import type { UnmappedDeviceOptions, Device, DeviceOrganization } from '../types/devices.js';

export class DevicesResource {
  constructor(private getClient: () => Promise<HttpClient>) {}
  /** `GET /reports/unify-mapped-devices-by-account?organizationIds=...` */
  async listMapped(organizationIds: string | string[]): Promise<Device[]> {
    const d = await (await this.getClient()).request<Device[] | Device>('/reports/unify-mapped-devices-by-account', { params: { organizationIds } });
    return Array.isArray(d) ? d : d ? [d] : [];
  }
  /** `GET /reports/unify-unmapped-devices-by-account` */
  async listUnmapped(opts: UnmappedDeviceOptions): Promise<Device[]> {
    const params: Record<string, unknown> = { organizationIds: opts.organizationIds };
    if (opts.confidence !== undefined) params.confidence = opts.confidence;
    if (opts.onlyWithSuggestions !== undefined) params.onlyWithSuggestions = opts.onlyWithSuggestions;
    const d = await (await this.getClient()).request<Device[] | Device>('/reports/unify-unmapped-devices-by-account', { params });
    return Array.isArray(d) ? d : d ? [d] : [];
  }
  /** `GET /reports/unify-ignored-devices?organizationIds=...` */
  async listIgnored(organizationIds: string | string[]): Promise<Device[]> {
    const d = await (await this.getClient()).request<Device[] | Device>('/reports/unify-ignored-devices', { params: { organizationIds } });
    return Array.isArray(d) ? d : d ? [d] : [];
  }
  /** `GET /reports/devices-organizations` */
  async listOrganizations(): Promise<DeviceOrganization[]> {
    const d = await (await this.getClient()).request<DeviceOrganization[] | DeviceOrganization>('/reports/devices-organizations');
    return Array.isArray(d) ? d : d ? [d] : [];
  }
}
