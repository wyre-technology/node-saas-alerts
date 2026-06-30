/** Base error for all SaaS Alerts SDK failures. */
export class SaasAlertsError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: unknown,
    public errorCode?: string
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;
  }
}
export class AuthenticationError extends SaasAlertsError {
  constructor(message: string, response?: unknown, errorCode?: string) { super(message, 401, response, errorCode); }
}
export class ForbiddenError extends SaasAlertsError {
  constructor(message: string, response?: unknown, errorCode?: string) { super(message, 403, response, errorCode); }
}
export class NotFoundError extends SaasAlertsError {
  constructor(message: string, response?: unknown, errorCode?: string) { super(message, 404, response, errorCode); }
}
export class RateLimitError extends SaasAlertsError {
  constructor(message: string, response?: unknown, errorCode?: string) { super(message, 429, response, errorCode); }
}
export class ServerError extends SaasAlertsError {
  constructor(message: string, statusCode = 500, response?: unknown, errorCode?: string) { super(message, statusCode, response, errorCode); }
}
