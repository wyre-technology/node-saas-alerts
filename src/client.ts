import type { SaasAlertsClientConfig } from './types/common.js';
import { DEFAULT_BASE_URL } from './types/common.js';
import { HttpClient } from './http.js';
import { EventsResource } from './resources/events.js';
import { CustomersResource } from './resources/customers.js';
import { UsersResource } from './resources/users.js';
import { DevicesResource } from './resources/devices.js';
import { BillingResource } from './resources/billing.js';
import { ReportsResource } from './resources/reports.js';
import { PartnerResource } from './resources/partner.js';

export class SaasAlertsClient {
  readonly events: EventsResource;
  readonly customers: CustomersResource;
  readonly users: UsersResource;
  readonly devices: DevicesResource;
  readonly billing: BillingResource;
  readonly reports: ReportsResource;
  readonly partner: PartnerResource;

  private httpClient: HttpClient | null = null;
  private readonly config: Required<SaasAlertsClientConfig>;

  constructor(config: SaasAlertsClientConfig) {
    if (!config || !config.apiKey) {
      throw new Error('SaasAlertsClient requires an `apiKey`.');
    }
    this.config = {
      apiKey: config.apiKey,
      baseUrl: config.baseUrl ?? DEFAULT_BASE_URL,
      timeout: config.timeout ?? 30_000,
      maxRetries: config.maxRetries ?? 3,
      fetchImpl: config.fetchImpl ?? globalThis.fetch,
    };
    const getClient = async () => this.getHttpClient();
    this.events = new EventsResource(getClient);
    this.customers = new CustomersResource(getClient);
    this.users = new UsersResource(getClient);
    this.devices = new DevicesResource(getClient);
    this.billing = new BillingResource(getClient);
    this.reports = new ReportsResource(getClient);
    this.partner = new PartnerResource(getClient);
  }

  private async getHttpClient(): Promise<HttpClient> {
    if (this.httpClient) return this.httpClient;
    this.httpClient = new HttpClient({
      baseUrl: this.config.baseUrl,
      apiKey: this.config.apiKey,
      timeout: this.config.timeout,
      maxRetries: this.config.maxRetries,
      fetchImpl: this.config.fetchImpl,
    });
    return this.httpClient;
  }
}
