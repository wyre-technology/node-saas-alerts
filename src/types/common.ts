export interface SaasAlertsClientConfig {
  /** SaaS Alerts API key (sent as the `api_key` header). Required. */
  apiKey: string;
  /** Override the API base URL. Defaults to the production cloud-function host. */
  baseUrl?: string;
  /** Request timeout in ms. Default 30000. */
  timeout?: number;
  /** Max retry attempts on 5xx/network errors. Default 3. */
  maxRetries?: number;
  /** Custom fetch implementation (for testing). Defaults to global fetch. */
  fetchImpl?: typeof fetch;
}

/** Production base URL for the SaaS Alerts External Partner API. */
export const DEFAULT_BASE_URL =
  'https://us-central1-the-byway-248217.cloudfunctions.net/reportApi/api/v1';
