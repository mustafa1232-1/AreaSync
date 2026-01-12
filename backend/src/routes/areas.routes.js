/**
 * areas.routes.js
 * ---------------
 * Routes الخاصة بالمناطق
 */

const router = require('express').Router();
const ctrl = require('../controllers/areas.controller');

// ✅ قائمة المناطق (لشاشة اختيار المنطقة)
router.get('/', ctrl.listAreas);

// ✅ Seed بسماية (مؤقتاً بدون حماية، سنقفلها لاحقاً بـ Developer Secret)
router.post('/seed/bismaya', ctrl.seedBismaya);

module.exports = router;
