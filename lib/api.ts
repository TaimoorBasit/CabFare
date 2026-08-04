const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

export const API_BASE_URL = (configuredApiUrl || 'http://localhost:5000').replace(/\/+$/, '');

export class ApiRequestError extends Error {
  status: number | null;
  code: 'http' | 'network' | 'timeout' | 'invalid-response';

  constructor(
    message: string,
    options: {
      status?: number | null;
      code?: 'http' | 'network' | 'timeout' | 'invalid-response';
    } = {},
  ) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = options.status ?? null;
    this.code = options.code ?? 'http';
  }
}

type ApiResult<T> = {
  data: T;
  status: number;
};

export async function requestJson<T = unknown>(
  path: string,
  init: RequestInit = {},
  timeoutMs = 15000,
): Promise<ApiResult<T>> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    let response: Response;
    try {
      response = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        cache: 'no-store',
        signal: controller.signal,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ApiRequestError('The server did not respond in time.', { code: 'timeout' });
      }
      throw new ApiRequestError('The booking server could not be reached.', { code: 'network' });
    }

    const rawBody = await response.text();
    let data: unknown = null;
    if (rawBody) {
      try {
        data = JSON.parse(rawBody);
      } catch {
        throw new ApiRequestError('The server returned an invalid response.', {
          status: response.status,
          code: 'invalid-response',
        });
      }
    }

    if (!response.ok) {
      const serverMessage =
        data && typeof data === 'object' && 'error' in data && typeof data.error === 'string'
          ? data.error
          : `Request failed with status ${response.status}.`;
      throw new ApiRequestError(serverMessage, { status: response.status, code: 'http' });
    }

    return { data: data as T, status: response.status };
  } finally {
    window.clearTimeout(timeout);
  }
}
