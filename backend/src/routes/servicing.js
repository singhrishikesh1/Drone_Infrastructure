const express = require('express');
const router = express.Router();
const prisma = require('../services/db');

// GET /api/servicing - get servicing tickets and fleet health overview
router.get('/', async (req, res) => {
  try {
    const serviceTickets = await prisma.servicingTicket.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const drones = await prisma.drone.findMany();

    const fleetHealthOverview = drones.map(d => ({
      droneId: d.id,
      droneCode: d.droneCode,
      droneName: d.name,
      healthScore: d.healthScore,
      batteryPercent: d.batteryPct,
      lastServiceDate: d.lastServiced,
      status: d.status
    }));

    res.json({
      success: true,
      data: {
        fleetHealthOverview,
        serviceHistory: serviceTickets
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/servicing/request - book a drone or defect servicing ticket
router.post('/request', async (req, res) => {
  try {
    const { defectId, title, assetName, priority, estimatedCost, assignedCrew, scheduledDate, notes } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, error: 'Title is required for servicing request' });
    }

    const ticket = await prisma.servicingTicket.create({
      data: {
        defectId: defectId || null,
        title,
        assetName: assetName || "Metropolitan Highway Sector",
        status: "SCHEDULED",
        priority: priority || "HIGH",
        estimatedCost: estimatedCost ? parseFloat(estimatedCost) : 35000,
        assignedCrew: assignedCrew || "PMC Infrastructure Rapid Repair Team",
        scheduledDate: scheduledDate || new Date().toISOString().split('T')[0],
        notes: notes || "Preventative maintenance scheduled."
      }
    });

    // If linked to a defect, update defect status to DISPATCHED
    if (defectId) {
      await prisma.defect.update({
        where: { id: defectId },
        data: { status: 'DISPATCHED' }
      }).catch(() => {});
    }

    res.status(201).json({ success: true, data: ticket });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/servicing/:id/status - update ticket status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, error: 'Status is required' });
    }

    const updated = await prisma.servicingTicket.update({
      where: { id: req.params.id },
      data: { status }
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
