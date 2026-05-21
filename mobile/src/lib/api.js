export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || 'http://127.0.0.1:5000';

const createUrl = (path) => {
  const normalizedBase = API_BASE_URL.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

const parseJson = (text) => {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

export async function apiRequest(path, options = {}) {
  const { token, body, headers, ...rest } = options;
  const requestHeaders = {
    Accept: 'application/json',
    ...(body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  const response = await fetch(createUrl(path), {
    ...rest,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = parseJson(await response.text());

  if (!response.ok) {
    const message = data?.message || data?.error || `Request failed (${response.status})`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

