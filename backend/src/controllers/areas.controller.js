/**
 * areas.controller.js
 * -------------------
 * منطق Areas (المناطق)
 */

const db = require('../db');

// GET /api/areas
async function listAreas(req, res) {
  try {
    const { rows } = await db.query(
      `SELECT id, name, slug, created_at
       FROM areas
       ORDER BY id ASC`
    );

    return res.json({ items: rows });
  } catch (e) {
    return res.status(500).json({
      message: 'Failed to load areas',
      error: e.message,
    });
  }
}

// POST /api/areas/seed/bismaya
// ملاحظة: يُفضّل استخدامه مرة واحدة فقط
async function seedBismaya(req, res) {
  const client = await db.pool.connect();

  try {
    await client.query('BEGIN');

    // 1) إنشاء المنطقة (بسماية) أو تحديث اسمها إذا موجودة
    const areaRes = await client.query(
      `INSERT INTO areas (name, slug)
       VALUES ($1, $2)
       ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
       RETURNING id, name, slug`,
      ['BasmayaSync', 'basmaya']
    );

    const area = areaRes.rows[0];

    // 2) بلوكات نموذجية (تقدر تغيرها لاحقاً)
    const blocks = [
      { name: 'Block A', code: 'A' },
      { name: 'Block B', code: 'B' },
      { name: 'Block C', code: 'C' },
    ];

    for (const b of blocks) {
      await client.query(
        `INSERT INTO blocks (area_id, name, code)
         VALUES ($1, $2, $3)
         ON CONFLICT (area_id, code) DO UPDATE SET name = EXCLUDED.name`,
        [area.id, b.name, b.code]
      );
    }

    // 3) إضافة عمارات نموذجية لكل بلوك
    const { rows: blockRows } = await client.query(
      `SELECT id, code FROM blocks WHERE area_id = $1 ORDER BY id ASC`,
      [area.id]
    );

    for (const blk of blockRows) {
      // 3 عمارات لكل بلوك (مثال)
      for (let i = 1; i <= 3; i++) {
        const buildingCode = `${blk.code}-${i}`;
        const buildingName = `Building ${buildingCode}`;

        await client.query(
          `INSERT INTO buildings (block_id, name, code)
           VALUES ($1, $2, $3)
           ON CONFLICT (block_id, code) DO UPDATE SET name = EXCLUDED.name`,
          [blk.id, buildingName, buildingCode]
        );
      }
    }

    await client.query('COMMIT');

    return res.json({
      message: 'Basmaya seeded successfully',
      area,
    });
  } catch (e) {
    await client.query('ROLLBACK');
    return res.status(500).json({
      message: 'Seed failed',
      error: e.message,
    });
  } finally {
    client.release();
  }
}

module.exports = {
  listAreas,
  seedBismaya,
};
