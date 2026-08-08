const express = require('express');
const router = express.Router();
const dataStore = require('../services/store');

// GET /api/drones/live - list active drones & flight telemetry
router.get('/live', (req, res) => {
  try {
    const drones = dataStore.getAllDrones();
    res.json({
      success: true,
      data: drones,
      totalActiveDrones: drones.filter(d => d.status === 'FLYING').length,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/drones/:id - drone details
router.get('/:id', (req, res) => {
  try {
    const drone = dataStore.getDroneById(req.params.id);
    if (!drone) {
      return res.status(404).json({ success: false, error: 'Drone not found' });
    }
    res.json({ success: true, data: drone });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
