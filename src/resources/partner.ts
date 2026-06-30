import type { HttpClient } from '../http.js';
import type { PartnerProfile, BrandingInput } from '../types/partner.js';

export class PartnerResource {
  constructor(private getClient: () => Promise<HttpClient>) {}
  /** `GET /reports/partners/profile` */
  async getProfile(): Promise<PartnerProfile> {
    return (await this.getClient()).request<PartnerProfile>('/reports/partners/profile');
  }
  /** `POST /reports/partners/branding` */
  async updateBranding(body: BrandingInput): Promise<unknown> {
    return (await this.getClient()).request('/reports/partners/branding', { method: 'POST', body });
  }
}
