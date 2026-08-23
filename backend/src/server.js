const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const defectsRoutes = require('./routes/defects');
const analyticsRoutes = require('./routes/analytics');
const reportsRoutes = require('./routes/reports');
const dronesRoutes = require('./routes/drones');
const servicingRoutes = require('./routes/servicing');
const redisRoutes = require('./routes/redis');
const inspectionsRoutes = require('./routes/inspections');

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded drone inspection images statically
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
app.use('/defects', express.static(path.join(__dirname, '../public/defects')));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Drone Infrastructure Backend API',
    timestamp: new Date().toISOString(),
    version: '2.0.0-hackathon'
  });
});

// Primary Blueprint & Core API Routes
app.use('/api/auth', authRoutes);
app.use('/api/defects', defectsRoutes);
app.use('/api/inspections', inspectionsRoutes);
app.use('/api/potholes', defectsRoutes);          // Alias matching blueprint spec
app.use('/api/dashboard', analyticsRoutes);       // Alias matching blueprint spec
app.use('/api/analytics', analyticsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/drones', dronesRoutes);
app.use('/api/drone', inspectionsRoutes);         // Alias for /api/drone/upload
app.use('/api/cost', inspectionsRoutes);          // Alias for /api/cost/estimate
app.use('/api/servicing', servicingRoutes);
app.use('/api/redis', redisRoutes);

app.listen(PORT, () => {
  console.log(`\n🛸 ==============================================================`);
  console.log(`🚀 [Drone Infrastructure Backend]: Express listening on http://localhost:${PORT}`);
  console.log(`🌐 Architecture Blueprint Endpoints: /api/inspections, /api/drone/upload, /api/cost/estimate`);
  console.log(`==============================================================\n`);
});
