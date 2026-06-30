import type { HttpClient } from '../http.js';
import type { ScheduledReport, ScheduledReportInput } from '../types/reports.js';

export class ReportsResource {
  constructor(private getClient: () => Promise<HttpClient>) {}
  /** `GET /reports/scheduled-report` */
  async listScheduled(): Promise<ScheduledReport[]> {
    const d = await (await this.getClient()).request<ScheduledReport[] | ScheduledReport>('/reports/scheduled-report');
    return Array.isArray(d) ? d : d ? [d] : [];
  }
  /** `GET /reports/scheduled-report/{id}` */
  async getScheduled(id: string): Promise<ScheduledReport> {
    return (await this.getClient()).request<ScheduledReport>(`/reports/scheduled-report/${encodeURIComponent(id)}`);
  }
  /** `POST /reports/scheduled-report` */
  async createScheduled(body: ScheduledReportInput): Promise<ScheduledReport> {
    return (await this.getClient()).request<ScheduledReport>('/reports/scheduled-report', { method: 'POST', body });
  }
  /** `DELETE /reports/scheduled-report/{id}` */
  async deleteScheduled(id: string): Promise<unknown> {
    return (await this.getClient()).request(`/reports/scheduled-report/${encodeURIComponent(id)}`, { method: 'DELETE' });
  }
}
