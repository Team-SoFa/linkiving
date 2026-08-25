import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const replace = vi.fn();

const jsonResponse = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

describe('clientApiClient authentication errors', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal('window', { location: { replace } });
    replace.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('cleans up the session and redirects on 401', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(401, { message: 'Unauthorized' }))
      .mockResolvedValueOnce(jsonResponse(200, { success: true }));
    vi.stubGlobal('fetch', fetchMock);
    const { clientApiClient } = await import('./apiClient');

    await expect(clientApiClient('/api/protected')).rejects.toMatchObject({ status: 401 });
    await vi.waitFor(() => expect(replace).toHaveBeenCalledWith('/'));

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      '/api/member/logout',
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('preserves the session on 403', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(403, { message: 'Forbidden' }));
    vi.stubGlobal('fetch', fetchMock);
    const { clientApiClient } = await import('./apiClient');

    await expect(clientApiClient('/api/protected')).rejects.toMatchObject({ status: 403 });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(replace).not.toHaveBeenCalled();
  });

  it('defers invalid-session cleanup during intentional session termination', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(200, { success: true }));
    vi.stubGlobal('fetch', fetchMock);
    const { clearInvalidSessionAndRedirect, setIntentionalSessionTermination } =
      await import('./apiClient');

    setIntentionalSessionTermination(true);
    clearInvalidSessionAndRedirect();
    expect(fetchMock).not.toHaveBeenCalled();

    setIntentionalSessionTermination(false);
    await vi.waitFor(() => expect(replace).toHaveBeenCalledWith('/'));
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
