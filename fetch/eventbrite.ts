export const API_BASE = 'https://www.eventbriteapi.com/v3';
export const ORG_ID = '168322805152';

const token = process.env.EVENTBRITE_TOKEN;

export const eventbriteGet = async <T>(
  path: string,
  params: Record<string, string> = {},
): Promise<T> => {
  if (!token) throw new Error('EVENTBRITE_TOKEN is required');
  const url = path.startsWith('https://') ? new URL(path) : new URL(`${API_BASE}${path}`);
  if (url.origin !== 'https://www.eventbriteapi.com') {
    throw new Error(`Refusing to call non-Eventbrite URL: ${url.origin}`);
  }
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const request = () =>
    fetch(url, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } });

  let res = await request();
  if (res.status === 429) {
    const retryAfter = Number.parseInt(res.headers.get('Retry-After') ?? '2', 10);
    await new Promise((resolve) => setTimeout(resolve, Math.min(retryAfter, 30) * 1000));
    res = await request();
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Eventbrite API error ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
};
