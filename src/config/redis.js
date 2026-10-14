const Redis = require('ioredis');

// الاتصال بخدمة Redis عبر الرابط المعرف في متغيرات البيئة أو افتراضياً
const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
    enableReadyCheck: false
});

redisClient.on('connect', () => {
    console.log('✅ Connexion à Redis établie avec succès !');
});

redisClient.on('error', (err) => {
    console.error('❌ Erreur de connexion Redis :', err);
});

module.exports = redisClient;