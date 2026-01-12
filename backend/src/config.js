/**
 * config.js
 * ----------
 * إعدادات عامة للتطبيق
 */

module.exports = {
  port: process.env.PORT || 8080,
  nodeEnv: process.env.NODE_ENV || 'production',
  databaseUrl: process.env.DATABASE_URL || '',
};
