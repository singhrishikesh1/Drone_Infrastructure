const express = require('express');
const router = express.Router();
const prisma = require('../services/db');

// GET /api/drones/live - list active drones & flight telemetry
router.get('/live', async (req, res) => {
  try {
    const drones = await prisma.drone.findMany({
      orderBy: { name: 'asc' }
    });

    res.json({
      success: true,
      data: drones,
      totalActiveDrones: drones.filter(d => d.status === 'FLYING' || d.status === 'IN_FLIGHT' || d.status === 'ACTIVE').length,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/drones/:id - drone details
router.get('/:id', async (req, res) => {
  try {
    const drone = await prisma.drone.findUnique({
      where: { id: req.params.id }
    });

    if (!drone) {
      return res.status(404).json({ success: false, error: 'Drone not found' });
    }
    res.json({ success: true, data: drone });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/drones/:id/telemetry - update drone telemetry position & battery
router.patch('/:id/telemetry', async (req, res) => {
  try {
    const { lat, lng, batteryPct, status } = req.body;
    const updateData = {};
    if (lat !== undefined) updateData.currentLat = parseFloat(lat);
    if (lng !== undefined) updateData.currentLng = parseFloat(lng);
    if (batteryPct !== undefined) updateData.batteryPct = parseInt(batteryPct, 10);
    if (status !== undefined) updateData.status = status;

    const updatedDrone = await prisma.drone.update({
      where: { id: req.params.id },
      data: updateData
    });

    res.json({ success: true, data: updatedDrone });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
