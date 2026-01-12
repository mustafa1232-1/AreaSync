/**
 * jwt.js
 * ------
 * إنشاء/تحقق من JWT
 * ملاحظة: نخليها بسيطة (Access token فقط) كبداية
 */

const jwt = require('jsonwebtoken');

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || '';
const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';

if (!JWT_ACCESS_SECRET) {
  // ملاحظة بالعربي: على Railway لازم تضيف JWT_ACCESS_SECRET في Variables
  console.warn('⚠️ JWT_ACCESS_SECRET is not set (this will break auth in production)');
}

function signAccessToken(payload) {
  return jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: JWT_ACCESS_EXPIRES_IN });
}

function verifyAccessToken(token) {
  return jwt.verify(token, JWT_ACCESS_SECRET);
}

module.exports = { signAccessToken, verifyAccessToken };
