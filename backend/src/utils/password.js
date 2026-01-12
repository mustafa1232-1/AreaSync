/**
 * password.js
 * -----------
 * تشفير/مقارنة كلمات المرور
 */

const bcrypt = require('bcryptjs');

async function hashPassword(plain) {
  // ملاحظة بالعربي: كلما زاد الرقم زاد الأمان لكن أبطأ
  const saltRounds = 10;
  return bcrypt.hash(plain, saltRounds);
}

async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

module.exports = { hashPassword, verifyPassword };
