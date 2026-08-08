const express = require('express');
const router = express.Router();
const dataStore = require('../services/store');

// GET /api/servicing - get all service records
router.get('/', (req, res) => {
  try {
    const serviceLogs = dataStore.getAllServiceLogs();
    const drones = dataStore.getAllDrones();

    const serviceOverview = drones.map(d => ({
      droneId: d.id,
      droneName: d.name,
      model: d.model,
      rotorHealth: d.rotorHealth,
      batteryPercent: d.batteryPercent,
      lastServiceDate: d.lastServiceDate,
      nextServiceDue: d.nextServiceDue,
      needsServiceSoon: new Date(d.nextServiceDue) <= new Date(Date.now() + 15 * 86400000)
    }));

    res.json({
      success: true,
      data: {
        fleetHealthOverview: serviceOverview,
        serviceHistory: serviceLogs
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/servicing/request - book a drone servicing ticket
router.post('/request', (req, res) => {
  try {
    const { droneId, droneName, serviceType, notes } = req.body;
    if (!droneId || !serviceType) {
      return res.status(400).json({ success: false, error: 'droneId and serviceType are required' });
    }

    const newRecord = dataStore.addServiceRequest({
      droneId,
      droneName: droneName || 'Drone Unit',
      serviceType,
      technician: 'Assigned Senior Avionics Lead',
      notes: notes || 'Routine preventative servicing scheduled.'
    });

    res.status(201).json({ success: true, data: newRecord });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
