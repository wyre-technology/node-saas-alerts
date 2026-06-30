import type { HttpClient } from '../http.js';
import type { BillingDetails, BillingDate } from '../types/billing.js';

export class BillingResource {
  constructor(private getClient: () => Promise<HttpClient>) {}
  /** `GET /reports/billing-details?billingDate=yyyy-mm-dd` */
  async getDetails(billingDate: string): Promise<BillingDetails> {
    return (await this.getClient()).request<BillingDetails>('/reports/billing-details', { params: { billingDate } });
  }
  /** `GET /reports/billing-dates` */
  async listDates(): Promise<BillingDate[]> {
    const d = await (await this.getClient()).request<BillingDate[] | BillingDate>('/reports/billing-dates');
    return Array.isArray(d) ? d : d ? [d] : [];
  }
}
