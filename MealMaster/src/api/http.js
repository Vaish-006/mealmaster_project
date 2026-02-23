const CONFIGURED_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const DEFAULT_API_BASE_URLS = ['http://localhost:9090/api'];
let resolvedApiBaseUrl = null;

export async function apiRequest(path, { method = 'GET', body, token, responseType = 'json' } = {}) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;
  if (responseType === 'blob') headers['Accept'] = 'application/pdf, */*';

  const baseUrls = CONFIGURED_API_BASE_URL
    ? [CONFIGURED_API_BASE_URL]
    : resolvedApiBaseUrl
      ? [resolvedApiBaseUrl]
      : DEFAULT_API_BASE_URLS;

  let response;
  let networkError;

  for (const baseUrl of baseUrls) {
    try {
      response = await fetch(`${baseUrl}${path}`, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body)
      });
      resolvedApiBaseUrl = baseUrl;
      break;
    } catch (e) {
      networkError = e;
    }
  }

  if (!response) {
    const error = new Error(
      `Cannot reach backend API. Configure VITE_API_BASE_URL (tried: ${baseUrls.join(', ')})`
    );
    error.cause = networkError;
    throw error;
  }

  if (!response.ok) {
    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const payload = isJson ? await response.json().catch(() => null) : await response.text().catch(() => '');

    const message =
      (payload && typeof payload === 'object' && (payload.title || payload.message || payload.error)) ||
      (typeof payload === 'string' && payload) ||
      response.statusText ||
      'Request failed';

    console.error('API Error:', { status: response.status, message, payload });

    const error = new Error(message);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  if (responseType === 'blob') {
    return await response.blob();
  }

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  return isJson ? await response.json().catch(() => null) : await response.text().catch(() => '');
}
