export function mockResponse(
  body: unknown,
  init: { ok?: boolean; status?: number } = {}
): { ok: boolean; status: number; text: () => Promise<string> } {
  const status = init.status ?? 200;
  const ok = init.ok ?? (status >= 200 && status < 300);
  const text = typeof body === 'string' ? body : JSON.stringify(body);
  return { ok, status, text: async () => text };
}
export function makeClient(mockFetch: unknown) {
  // imported lazily in tests to avoid circular import at module load
  return mockFetch;
}
