const rateLimitMap = new Map();
const WINDOW_SIZE = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10;

function rateLimiter(req, res, next) {
  const ip = req.ip;
  const now = Date.now();
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }
  const timestamps = rateLimitMap.get(ip).filter(ts => now - ts < WINDOW_SIZE);
  if (timestamps.length >= MAX_REQUESTS) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }
  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  next();
}

module.exports = { rateLimiter }; 