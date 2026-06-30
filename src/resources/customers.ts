import type { HttpClient } from '../http.js';
import type { Customer, CustomerCreateInput, CustomerUpdateInput, WhitelistInput } from '../types/customers.js';

export class CustomersResource {
  constructor(private getClient: () => Promise<HttpClient>) {}
  /** `GET /customers` */
  async list(): Promise<Customer[]> {
    const c = await this.getClient();
    const d = await c.request<Customer[] | Customer>('/customers');
    return Array.isArray(d) ? d : d ? [d] : [];
  }
  /** `GET /customers/{id}` */
  async get(id: string): Promise<Customer> {
    return (await this.getClient()).request<Customer>(`/customers/${encodeURIComponent(id)}`);
  }
  /** `POST /customers` */
  async create(body: CustomerCreateInput): Promise<Customer> {
    return (await this.getClient()).request<Customer>('/customers', { method: 'POST', body });
  }
  /** `PATCH /customers/{id}` */
  async update(id: string, body: CustomerUpdateInput): Promise<Customer> {
    return (await this.getClient()).request<Customer>(`/customers/${encodeURIComponent(id)}`, { method: 'PATCH', body });
  }
  /** `DELETE /customers/{id}` */
  async delete(id: string): Promise<unknown> {
    return (await this.getClient()).request(`/customers/${encodeURIComponent(id)}`, { method: 'DELETE' });
  }
  /** `POST /customers/{id}/whitelists` */
  async setWhitelists(id: string, body: WhitelistInput): Promise<unknown> {
    return (await this.getClient()).request(`/customers/${encodeURIComponent(id)}/whitelists`, { method: 'POST', body });
  }
  /** `POST /customers/{id}/accounts/whitelists` */
  async setAccountWhitelists(id: string, body: WhitelistInput): Promise<unknown> {
    return (await this.getClient()).request(`/customers/${encodeURIComponent(id)}/accounts/whitelists`, { method: 'POST', body });
  }
}
