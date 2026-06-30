export type AlertStatus = 'low' | 'medium' | 'critical';

export interface EventQueryOptions {
  customerId?: string;
  userEmail?: string;
  alertStatus?: AlertStatus;
  eventType?: string | string[];
  /** ISO timestamp or epoch ms, per the API. */
  start?: string;
  end?: string;
  /** Offset for paging. */
  from?: number;
  /** Page size. */
  size?: number;
  /** Sort direction on timestamp, e.g. 'asc' | 'desc'. */
  timeSort?: 'asc' | 'desc';
  /** When true, opens a scroll cursor; use scroll() to page. */
  scroll?: boolean;
}

export type SaasAlertsEvent = Record<string, unknown>;
export type RecommendedAction = Record<string, unknown>;
