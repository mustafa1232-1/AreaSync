/**
 * db.js
 * -----
 * اتصال PostgreSQL
 * يعمل على Railway
 */

const { Pool } = require('pg');
const { databaseUrl } = require('./config');

if (!databaseUrl) {
  console.error('❌ DATABASE_URL is not set');
  process.exit(1);
}

const pool = new Pool({
  connectionString: databaseUrl,
  // Railway Postgres غالباً يحتاج SSL
  ssl: { rejectUnauthorized: false },
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
