/**
 * areas.routes.js
 * ---------------
 * Routes الخاصة بالمناطق
 */

const router = require('express').Router();
const ctrl = require('../controllers/areas.controller');

// قائمة المناطق
router.get('/', ctrl.listAreas);

// Seed بسماية (مؤقتاً بدون حماية، سنغلقه لاحقاً)
router.post('/seed/bismaya', ctrl.seedBismaya);

module.exports = router;
