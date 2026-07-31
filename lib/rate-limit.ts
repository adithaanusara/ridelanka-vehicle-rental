const attempts = new Map<string, { count: number; resetAt: number }>();
export function rateLimit(key: string, limit = 8, windowMs = 60_000) {
  const now = Date.now();
  const previous = attempts.get(key);
  if (!previous || previous.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (previous.count >= limit) return false;
  previous.count += 1;
  return true;
}
