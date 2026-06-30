export interface UnmappedDeviceOptions {
  organizationIds: string | string[];
  /** Minimum confidence score for suggestions. */
  confidence?: number;
  onlyWithSuggestions?: boolean;
}
export type Device = Record<string, unknown>;
export type DeviceOrganization = Record<string, unknown>;
