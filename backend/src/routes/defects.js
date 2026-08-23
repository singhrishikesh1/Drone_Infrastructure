const express = require('express');
const router = express.Router();
const prisma = require('../services/db');
const AIService = require('../services/aiService');
const NotificationService = require('../services/notificationService');

// Helper to parse JSON strings back into objects for frontend compatibility
function formatDefect(d) {
  if (!d) return null;
  return {
    ...d,
    volumetric: typeof d.volumetricJson === 'string' ? JSON.parse(d.volumetricJson) : d.volumetricJson,
    costEstimation: typeof d.costEstimationJson === 'string' ? JSON.parse(d.costEstimationJson) : d.costEstimationJson,
    riskReasons: typeof d.riskReasonsJson === 'string' ? JSON.parse(d.riskReasonsJson) : d.riskReasonsJson
  };
}

// Get all defects with optional filter by assetType or riskLevel
router.get('/', async (req, res) => {
  try {
    const { assetType, riskLevel } = req.query;
    const where = {};

    if (assetType && assetType !== 'all') {
      where.assetType = { equals: assetType.toLowerCase() };
    }

    if (riskLevel && riskLevel !== 'all') {
      where.riskLevel = { equals: riskLevel.toUpperCase() };
    }

    const defects = await prisma.defect.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    const formattedDefects = defects.map(formatDefect);

    res.json({ success: true, count: formattedDefects.length, data: formattedDefects });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get single defect detail
router.get('/:id', async (req, res) => {
  try {
    const defect = await prisma.defect.findUnique({
      where: { id: req.params.id }
    });

    if (!defect) {
      return res.status(404).json({ success: false, message: "Defect not found" });
    }

    res.json({ success: true, data: formatDefect(defect) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Trigger New Drone Inspection Analysis & Store in DB
router.post('/analyze', async (req, res) => {
  try {
    const { assetName, assetType, locationName, lat, lng, altitude, inspectorName } = req.body;

    // Call Python AI Service
    const aiResult = await AIService.analyzeImage(null, assetType || "road");

    const newDefectId = `DEF-${Date.now().toString().slice(-4)}`;
    const riskLevel = aiResult.cost_estimation.risk_score || "HIGH";

    const createdDefect = await prisma.defect.create({
      data: {
        id: newDefectId,
        title: `${aiResult.defect_class} Detected via Drone Scan`,
        assetName: assetName || "Metropolitan Transit Expressway",
        assetType: assetType || "road",
        locationName: locationName || "Sector 44, Geo-Point",
        lat: lat ? parseFloat(lat) : 19.0760 + (Math.random() - 0.5) * 0.05,
        lng: lng ? parseFloat(lng) : 72.8777 + (Math.random() - 0.5) * 0.05,
        altitude: altitude ? parseFloat(altitude) : 35.0,
        riskLevel,
        riskScore: aiResult.cost_estimation.risk_numeric || 85,
        defectClass: aiResult.defect_class,
        confidence: aiResult.confidence || 0.94,
        volumetricJson: JSON.stringify(aiResult.volumetric_data || {}),
        costEstimationJson: JSON.stringify(aiResult.cost_estimation || {}),
        riskReasonsJson: JSON.stringify(aiResult.risk_summary?.reasons || []),
        inspector: inspectorName || "Autonomous AirSim Drone Inspector",
        status: "OPEN",
        alertSent: riskLevel === "CRITICAL",
        thumbnailUrl: aiResult.annotated_image_base64 || "/defects/pothole_critical_1.jpg",
        timestamp: "Just now"
      }
    });

    const formatted = formatDefect(createdDefect);

    if (formatted.riskLevel === "CRITICAL") {
      NotificationService.sendCriticalSMSAlert(formatted);
      NotificationService.sendEmailReport(formatted);
    }

    res.json({ success: true, message: "AI Volumetric Analysis Completed & Saved to Database", data: formatted });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update defect status (e.g. RESOLVED, IN_REVIEW, DISPATCHED)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, error: 'Status is required' });
    }

    const updated = await prisma.defect.update({
      where: { id: req.params.id },
      data: { status }
    });

    res.json({ success: true, data: formatDefect(updated) });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, error: 'Defect not found' });
    }
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
