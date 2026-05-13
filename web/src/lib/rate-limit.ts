type Bucket = { count: number; reset: number };

const store = new Map<string, Bucket>();

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 30;

export function rateLimit(key: string, limit = MAX_REQUESTS): boolean {
  const now = Date.now();
  const bucket = store.get(key);
  if (!bucket || now > bucket.reset) {
    store.set(key, { count: 1, reset: now + WINDOW_MS });
    return true;
  }
  if (bucket.count >= limit) {
    return false;
  }
  bucket.count += 1;
  return true;
}

export function clientKey(ip: string | null, route: string) {
  return `${ip ?? "unknown"}:${route}`;
}
