import {
  SaasAlertsError, AuthenticationError, ForbiddenError,
  NotFoundError, RateLimitError, ServerError,
} from './errors.js';

export interface HttpClientConfig {
  baseUrl: string;
  apiKey: string;
  timeout: number;
  maxRetries: number;
  fetchImpl: typeof fetch;
}

export interface RequestOptions {
  method?: string;
  params?: Record<string, unknown>;
  body?: unknown;
}

const QUOTA_PATTERN = /quota|rate.?limit|throttl/i;

export class HttpClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly timeout: number;
  private readonly maxRetries: number;
  private readonly fetchImpl: typeof fetch;

  constructor(config: HttpClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, '');
    this.apiKey = config.apiKey;
    this.timeout = config.timeout;
    this.maxRetries = config.maxRetries;
    this.fetchImpl = config.fetchImpl;
  }

  private redact(text: string): string {
    if (!this.apiKey) return text;
    return text.split(this.apiKey).join('[REDACTED]');
  }

  async request<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', params, body } = options;
    let endpoint = path.trim();
    if (!endpoint.startsWith('/')) endpoint = `/${endpoint}`;

    let url = `${this.baseUrl}${endpoint}`;
    if (params) {
      const sp = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null) continue;
        if (Array.isArray(value)) { for (const v of value) sp.append(key, String(v)); }
        else sp.set(key, String(value));
      }
      const qs = sp.toString();
      if (qs) url += `?${qs}`;
    }

    let lastError: Error | null = null;
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      if (attempt > 0) {
        const delay = Math.min(1000 * 2 ** (attempt - 1) + Math.random() * 1000, 300_000);
        await new Promise((r) => setTimeout(r, delay));
      }
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      const headers: Record<string, string> = {
        api_key: this.apiKey,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      let response: Response;
      try {
        response = await this.fetchImpl(url, {
          method, headers,
          body: body !== undefined ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
      } catch (err) {
        clearTimeout(timeoutId);
        let e = err as Error;
        if (e.name === 'AbortError') e = new SaasAlertsError(`Request timeout after ${this.timeout}ms`);
        lastError = e;
        if (attempt < this.maxRetries) continue;
        throw e;
      }

      const rawText = await response.text().catch(() => '');
      let parsed: unknown;
      try { parsed = rawText ? JSON.parse(rawText) : undefined; } catch { parsed = rawText || undefined; }

      if (!response.ok) {
        if (response.status >= 500 && attempt < this.maxRetries) {
          lastError = this.buildError(response.status, rawText);
          continue;
        }
        throw this.buildError(response.status, rawText);
      }
      return parsed as T;
    }
    throw lastError ?? new SaasAlertsError('Request failed after retries');
  }

  private buildError(status: number, rawText: string): SaasAlertsError {
    const message = this.redact((rawText || `HTTP ${status}`).slice(0, 500)).trim();
    if (status === 401) return new AuthenticationError(message || 'Invalid SaaS Alerts API key.');
    if (status === 429 || QUOTA_PATTERN.test(rawText)) return new RateLimitError(message || 'Rate limit exceeded.');
    if (status === 403) return new ForbiddenError(message || 'Forbidden.');
    if (status === 404) return new NotFoundError(message || 'Not found.');
    if (status >= 500) return new ServerError(message || 'Server error', status);
    return new SaasAlertsError(message || `SaaS Alerts API request failed (HTTP ${status})`, status);
  }
}
