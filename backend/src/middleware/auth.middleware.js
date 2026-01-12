/**
 * auth.middleware.js
 * ------------------
 * Middleware للتحقق من Authorization: Bearer <token>
 */

const { verifyAccessToken } = require('../utils/jwt');

function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [type, token] = header.split(' ');

    if (type !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Missing or invalid Authorization header' });
    }

    const payload = verifyAccessToken(token);
    // ملاحظة بالعربي: نخزن بيانات المستخدم المستخرجة من التوكن هنا
    req.user = payload;

    return next();
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized', error: e.message });
  }
}

module.exports = { requireAuth };
