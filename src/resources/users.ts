import type { HttpClient } from '../http.js';
import type { MspUser, PartnerUser, CustomerUser } from '../types/users.js';

export class UsersResource {
  constructor(private getClient: () => Promise<HttpClient>) {}
  /** `GET /reports/msp-user` */
  async getMspUser(): Promise<MspUser> {
    return (await this.getClient()).request<MspUser>('/reports/msp-user');
  }
  /** `GET /reports/partnerUsers` */
  async listPartnerUsers(): Promise<PartnerUser[]> {
    const d = await (await this.getClient()).request<PartnerUser[] | PartnerUser>('/reports/partnerUsers');
    return Array.isArray(d) ? d : d ? [d] : [];
  }
  /** `GET /reports/users?customerId=...` */
  async listByCustomer(customerId: string): Promise<CustomerUser[]> {
    const d = await (await this.getClient()).request<CustomerUser[] | CustomerUser>('/reports/users', { params: { customerId } });
    return Array.isArray(d) ? d : d ? [d] : [];
  }
}
