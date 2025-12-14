export const request = async <T>(
  input: RequestInfo | URL,
  init?: RequestInit,
  defaultErrorMessage = 'Request failed'
): Promise<T> => {
  const res = await fetch(input, init);
  const errorBody = !res.ok ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    const message = (errorBody as { error?: string } | null)?.error ?? defaultErrorMessage;
    throw new Error(message);
  }

  return res.json() as Promise<T>;
};
