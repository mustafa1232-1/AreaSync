/**
 * auth.controller.js
 * ------------------
 * Register / Login / Me
 */

const db = require('../db');
const { hashPassword, verifyPassword } = require('../utils/password');
const { signAccessToken } = require('../utils/jwt');

// POST /api/auth/register
async function register(req, res) {
  try {
    const { fullName, email, phone, password, username, age, areaId, blockId, buildingId, apartmentId } = req.body;

    // ملاحظة بالعربي: تحقق بسيط
    if (!fullName || !password) {
      return res.status(400).json({ message: 'fullName and password are required' });
    }
    if ((!email || email.trim() === '') && (!phone || phone.trim() === '')) {
      return res.status(400).json({ message: 'email or phone is required' });
    }

    const passwordHash = await hashPassword(password);

    const { rows } = await db.query(
      `INSERT INTO users (
         full_name, email, phone, password_hash, username, age,
         area_id, block_id, building_id, apartment_id
       )
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING id, uuid, role, full_name, email, phone, username, age, created_at`,
      [
        fullName,
        email || null,
        phone || null,
        passwordHash,
        username || null,
        age || null,
        areaId || null,
        blockId || null,
        buildingId || null,
        apartmentId || null,
      ]
    );

    const user = rows[0];

    const accessToken = signAccessToken({
      sub: String(user.uuid), // ملاحظة بالعربي: sub = user uuid
      role: user.role,
    });

    return res.status(201).json({ user, accessToken });
  } catch (e) {
    // ملاحظة بالعربي: أخطاء unique (email/phone/username)
    if (String(e.message).includes('duplicate key')) {
      return res.status(409).json({ message: 'User already exists (email/phone/username)', error: e.message });
    }
    return res.status(500).json({ message: 'Register failed', error: e.message });
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    const { email, phone, password } = req.body;

    if (!password) return res.status(400).json({ message: 'password is required' });
    if ((!email || email.trim() === '') && (!phone || phone.trim() === '')) {
      return res.status(400).json({ message: 'email or phone is required' });
    }

    const { rows } = await db.query(
      `SELECT id, uuid, role, full_name, email, phone, username, age, password_hash, is_active
       FROM users
       WHERE (email = $1 AND $1 IS NOT NULL)
          OR (phone = $2 AND $2 IS NOT NULL)
       LIMIT 1`,
      [email || null, phone || null]
    );

    const user = rows[0];
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    if (!user.is_active) return res.status(403).json({ message: 'Account is disabled' });

    const ok = await verifyPassword(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const accessToken = signAccessToken({
      sub: String(user.uuid),
      role: user.role,
    });

    // ملاحظة بالعربي: لا نرجع password_hash للموبايل
    delete user.password_hash;

    return res.json({ user, accessToken });
  } catch (e) {
    return res.status(500).json({ message: 'Login failed', error: e.message });
  }
}

// GET /api/auth/me
async function me(req, res) {
  try {
    const userUuid = req.user?.sub;
    if (!userUuid) return res.status(401).json({ message: 'Unauthorized' });

    const { rows } = await db.query(
      `SELECT uuid, role, full_name, email, phone, username, age,
              area_id, block_id, building_id, apartment_id,
              created_at, updated_at
       FROM users
       WHERE uuid = $1
       LIMIT 1`,
      [userUuid]
    );

    const user = rows[0];
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.json({ user });
  } catch (e) {
    return res.status(500).json({ message: 'Failed to load profile', error: e.message });
  }
}

module.exports = { register, login, me };
