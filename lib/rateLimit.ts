// In-memory limiter: per server instance. Swap for Redis/Upstash when running several instances.
const hits = new Map<string, { n: number; t: number }>();
export function rateLimit(key: string, max = 10, windowMs = 60_000) {
  const now = Date.now(), h = hits.get(key);
  if (!h || now - h.t > windowMs) { hits.set(key, { n: 1, t: now }); return true; }
  return ++h.n <= max;
}
export const clientIp = (req: Request) => req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "local";
