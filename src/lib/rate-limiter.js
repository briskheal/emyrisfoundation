import { LRUCache } from 'lru-cache';

const rateLimitOptions = {
  max: 500,
  ttl: 60 * 1000, // 1 minute
};

const tokenCache = new LRUCache(rateLimitOptions);

export function rateLimit(request, limit = 5) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
  const tokenCount = tokenCache.get(ip) || [0];
  
  if (tokenCount[0] === 0) {
    tokenCache.set(ip, tokenCount);
  }
  
  tokenCount[0] += 1;
  
  const currentUsage = tokenCount[0];
  const isRateLimited = currentUsage > limit;
  
  return {
    isRateLimited,
    ip,
    currentUsage
  };
}

export async function verifyCaptcha(token) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey || secretKey === 'fallback_secret') {
    console.log('Skipping captcha verification (no secret key provided)');
    return true; // Pass if no key configured
  }

  if (!token) return false;

  try {
    const res = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`, {
      method: 'POST',
    });
    const data = await res.json();
    return data.success && data.score >= 0.5;
  } catch (err) {
    console.error('Captcha error:', err);
    return false;
  }
}
