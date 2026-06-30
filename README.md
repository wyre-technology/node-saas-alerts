# @wyre-technology/node-saas-alerts

Node.js client library for the [Kaseya SaaS Alerts](https://www.saasalerts.com/) External Partner API. Provides a type-safe, promise-based interface to query security events, manage customers, retrieve billing details, and more.

## Installation

This package is published to GitHub Packages. Add the following to your project's `.npmrc`:

```
@wyre-technology:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

Then install:

```bash
npm install @wyre-technology/node-saas-alerts
```

## Authentication

SaaS Alerts uses an API key passed as the `api_key` request header. Generate your key in the SaaS Alerts partner portal under **Settings > API Keys**.

## Quick start

```ts
import { SaasAlertsClient } from '@wyre-technology/node-saas-alerts';

const client = new SaasAlertsClient({ apiKey: process.env.SAAS_ALERTS_API_KEY! });

// Query critical alerts for a specific customer
const events = await client.events.query({
  alertStatus: 'critical',
  customerId: 'your-customer-id',
  size: 100,
});

console.log(`Found ${events.length} critical alerts`);

// List all customers
const customers = await client.customers.list();

// Get billing details for a specific date
const billing = await client.billing.getDetails('2024-01-01');
```

## Available resources

| Namespace | Description |
|---|---|
| `client.events` | Query security events/alerts, scroll large result sets, get recommended actions |
| `client.customers` | Create, read, update, delete customers and manage whitelists |
| `client.users` | MSP user, partner users, per-customer user lists |
| `client.devices` | Mapped, unmapped, and ignored device management |
| `client.billing` | Billing details and available billing dates |
| `client.reports` | Scheduled report CRUD |
| `client.partner` | Partner profile and branding |

## Error handling

All errors extend `SaasAlertsError`. Import the typed subclasses to handle specific conditions:

```ts
import {
  SaasAlertsClient,
  AuthenticationError,
  NotFoundError,
  RateLimitError,
  ServerError,
} from '@wyre-technology/node-saas-alerts';

try {
  await client.events.query({ customerId: 'cust-123' });
} catch (err) {
  if (err instanceof AuthenticationError) {
    console.error('Invalid API key — check SAAS_ALERTS_API_KEY');
  } else if (err instanceof RateLimitError) {
    console.error('Rate limited — back off and retry');
  } else if (err instanceof NotFoundError) {
    console.error('Resource not found');
  } else if (err instanceof ServerError) {
    console.error(`SaaS Alerts server error (${err.statusCode})`);
  }
  throw err;
}
```

The client automatically retries 5xx errors up to `maxRetries` times (default: 3) with exponential backoff. API keys are redacted from error messages.

## Configuration

```ts
const client = new SaasAlertsClient({
  apiKey: 'your-api-key',        // required
  baseUrl: 'https://...',        // optional, defaults to production
  timeout: 30_000,               // optional, ms (default 30000)
  maxRetries: 3,                 // optional (default 3)
  fetchImpl: customFetch,        // optional, for testing or custom transports
});
```

## License

Apache-2.0. See [LICENSE](./LICENSE).

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Please read our [Code of Conduct](./CODE_OF_CONDUCT.md) and [Security Policy](./SECURITY.md).
