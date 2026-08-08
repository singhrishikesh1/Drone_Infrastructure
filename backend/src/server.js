const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const defectsRoutes = require('./routes/defects');
const analyticsRoutes = require('./routes/analytics');
const reportsRoutes = require('./routes/reports');
const dronesRoutes = require('./routes/drones');
const servicingRoutes = require('./routes/servicing');
const redisRoutes = require('./routes/redis');

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Drone Infrastructure Backend API',
    timestamp: new Date().toISOString(),
    version: '2.0.0-hackathon'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/defects', defectsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/drones', dronesRoutes);
app.use('/api/servicing', servicingRoutes);
app.use('/api/redis', redisRoutes);

app.listen(PORT, () => {
  console.log(`\n🛸 ==============================================================`);
  console.log(`🚀 [Drone Infrastructure Backend]: Express listening on http://localhost:${PORT}`);
  console.log(`🌐 Ready for Drone Infrastructure Frontend connections.`);
  console.log(`==============================================================\n`);
});

