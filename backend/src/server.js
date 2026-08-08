const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const defectsRoutes = require('./routes/defects');
const analyticsRoutes = require('./routes/analytics');
const reportsRoutes = require('./routes/reports');

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Drone Infrastructure Inspector Backend API',
    timestamp: new Date().toISOString(),
    version: '1.0.0-hackathon'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/defects', defectsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/reports', reportsRoutes);

app.listen(PORT, () => {
  console.log(`\n🛸 ==============================================================`);
  console.log(`🚀 [Backend Server]: Express listening on http://localhost:${PORT}`);
  console.log(`🌐 Ready for Drone Infrastructure Inspector Frontend connections.`);
  console.log(`==============================================================\n`);
});
