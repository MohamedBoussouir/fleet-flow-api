const rateLimit = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const redisClient = require('../config/redis');

const createRateLimiter = (options = {}) => {
  const windowMs = options.windowMs || 60 * 1000; // 1 دقيقة افتراضياً
  const max = options.max || 100; // 100 طلب افتراضياً

  return rateLimit({
    windowMs,
    max,
    standardHeaders: true, // يرسل رؤوس RateLimit القياسية (Limit, Remaining, Reset)
    legacyHeaders: false, // يلغي رؤوس X-RateLimit القديمة
    // دمج rate-limit-redis هنا
    store: new RedisStore({
      sendCommand: (...args) => redisClient.sendCommand(args),
      prefix: 'rl:', // البادئة التي ستظهر بها المفاتيح داخل Redis
    }),
    message: {
      success: false,
      message: 'Trop de requêtes, veuillez réessayer plus tard. (Rate limit dépassé)',
    },
  });
};

module.exports = createRateLimiter;