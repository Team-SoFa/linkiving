import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const replace = vi.fn();

const jsonResponse = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

describe('backendApiClient authentication errors', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('NEXT_PUBLIC_BASE_API_URL', 'http://backend.test');
    vi.stubGlobal('window', { location: { replace } });
    replace.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('preserves the session on 403', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(403, { message: 'Forbidden' }));
    vi.stubGlobal('fetch', fetchMock);
    const { backendApiClient } = await import('./backendClient');

    await expect(backendApiClient('/v1/protected')).rejects.toMatchObject({ status: 403 });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(replace).not.toHaveBeenCalled();
  });
});
