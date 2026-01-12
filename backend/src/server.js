/**
 * server.js
 * ----------
 * Entry point
 * - يشغل السيرفر
 * - health check يفحص DB
 * - يربط Routes الخاصة بالمشروع (Areas كبداية)
 */

require('dotenv').config();

const app = require('./app');
const db = require('./db');
const { port, nodeEnv } = require('./config');

// ✅ Routes
const areasRoutes = require('./routes/areas.routes');

// Root
app.get('/', (req, res) => {
  res.json({ message: 'AreaSync API is running' });
});

// Health (يفحص DB)
app.get('/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.status(200).json({
      status: 'ok',
      service: 'AreaSync Backend',
      environment: nodeEnv,
      time: new Date().toISOString(),
    });
  } catch (e) {
    res.status(500).json({
      status: 'error',
      message: 'DB not connected',
      error: e.message,
    });
  }
});

// ✅ Mount API Routes
// ملاحظة: كل API راح يكون تحت /api
app.use('/api/areas', areasRoutes);

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 AreaSync API running on port ${port}`);
});
