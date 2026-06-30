import type { HttpClient } from '../http.js';
import type { EventQueryOptions, SaasAlertsEvent, RecommendedAction } from '../types/events.js';

function toParams(opts: EventQueryOptions): Record<string, unknown> {
  const p: Record<string, unknown> = {};
  if (opts.customerId !== undefined) p.customerId = opts.customerId;
  if (opts.userEmail !== undefined) p.userEmail = opts.userEmail;
  if (opts.alertStatus !== undefined) p.alertStatus = opts.alertStatus;
  if (opts.eventType !== undefined) p.eventType = opts.eventType;
  if (opts.start !== undefined) p.start = opts.start;
  if (opts.end !== undefined) p.end = opts.end;
  if (opts.from !== undefined) p.from = opts.from;
  if (opts.size !== undefined) p.size = opts.size;
  if (opts.timeSort !== undefined) p.timeSort = opts.timeSort;
  if (opts.scroll !== undefined) p.scroll = opts.scroll;
  return p;
}

export class EventsResource {
  constructor(private getClient: () => Promise<HttpClient>) {}

  /** `GET /reports/events` — query events/alerts with filters. */
  async query(opts: EventQueryOptions = {}): Promise<SaasAlertsEvent[]> {
    const client = await this.getClient();
    const data = await client.request<SaasAlertsEvent[] | SaasAlertsEvent>('/reports/events', { params: toParams(opts) });
    return Array.isArray(data) ? data : data ? [data] : [];
  }

  /** `GET /reports/events/count` — count matching events. */
  async count(opts: EventQueryOptions = {}): Promise<unknown> {
    const client = await this.getClient();
    return client.request('/reports/events/count', { params: toParams(opts) });
  }

  /** `POST /reports/events/query` — advanced Elasticsearch-style query. */
  async queryAdvanced(body: Record<string, unknown>): Promise<unknown> {
    const client = await this.getClient();
    return client.request('/reports/events/query', { method: 'POST', body });
  }

  /** `POST /reports/events/count/query` — count via advanced query. */
  async countAdvanced(body: Record<string, unknown>): Promise<unknown> {
    const client = await this.getClient();
    return client.request('/reports/events/count/query', { method: 'POST', body });
  }

  /** `POST /reports/events/scroll` — page a large result set via a scroll cursor. */
  async scroll(scrollId: string): Promise<unknown> {
    const client = await this.getClient();
    return client.request('/reports/events/scroll', { method: 'POST', body: { scrollId } });
  }

  /** `GET /reports/alert-recommended-actions` — recommended security actions. */
  async recommendedActions(): Promise<RecommendedAction[]> {
    const client = await this.getClient();
    const data = await client.request<RecommendedAction[] | RecommendedAction>('/reports/alert-recommended-actions');
    return Array.isArray(data) ? data : data ? [data] : [];
  }
}
