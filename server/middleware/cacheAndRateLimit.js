/**
 * Caching & Rate Limiting Middleware
 * Prevents API spam, caches wallet roast results for 10 minutes.
 */

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const walletCache = new Map();

// Rate limiter state
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30;
const ipRequestCounts = new Map();

export function getCachedWalletData(address) {
  const key = address.trim().toLowerCase();
  const entry = walletCache.get(key);
  if (!entry) return null;

  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    walletCache.delete(key);
    return null;
  }

  return entry.data;
}

export function setCachedWalletData(address, data) {
  const key = address.trim().toLowerCase();
  walletCache.set(key, {
    timestamp: Date.now(),
    data
  });
}

export function rateLimiterMiddleware(req, res, next) {
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  const now = Date.now();

  const record = ipRequestCounts.get(clientIp) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS };

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + RATE_LIMIT_WINDOW_MS;
  } else {
    record.count++;
  }

  ipRequestCounts.set(clientIp, record);

  if (record.count > MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      error: "Woah slow down degenerate! 💀 You've hit the rate limit. Take a breath and try again in a minute."
    });
  }

  next();
}
