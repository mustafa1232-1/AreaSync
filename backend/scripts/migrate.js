/**
 * migrate.js
 * ------------
 * تطبيق migrations بالترتيب + lock لمنع التشغيل المتزامن
 */

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const MIGRATIONS_DIR = path.join(__dirname, '..', 'migrations');
const MIGRATION_LOCK_KEY = 91234567;

async function run() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('❌ DATABASE_URL is not set');
    process.exit(1);
  }

  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log('✅ Connected to database');

  console.log('🔒 Acquiring migration lock...');
  await client.query('SELECT pg_advisory_lock($1)', [MIGRATION_LOCK_KEY]);
  console.log('🔒 Lock acquired');

  let appliedCount = 0;
  let skippedCount = 0;

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        filename TEXT UNIQUE NOT NULL,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    const appliedRes = await client.query('SELECT filename FROM schema_migrations');
    const applied = new Set(appliedRes.rows.map(r => r.filename));

    const files = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter(f => f.endsWith('.sql'))
      .sort();

    console.log(`📦 Found ${files.length} migration files`);

    for (const file of files) {
      if (applied.has(file)) {
        skippedCount++;
        console.log(`⏭️  Skipping (already applied): ${file}`);
        continue;
      }

      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');

      console.log(`🚀 Applying: ${file}`);

      try {
        await client.query('BEGIN');
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [file]);
        await client.query('COMMIT');

        appliedCount++;
        console.log(`✅ Applied: ${file}`);
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`❌ Failed on: ${file}`);
        console.error(err);
        process.exit(1);
      }
    }

    console.log(`🎉 Done. applied=${appliedCount}, skipped=${skippedCount}`);
  } finally {
    console.log('🔓 Releasing migration lock...');
    await client.query('SELECT pg_advisory_unlock($1)', [MIGRATION_LOCK_KEY]);
    await client.end();
  }
}

run();
