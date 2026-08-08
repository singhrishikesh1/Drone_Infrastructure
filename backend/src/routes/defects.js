const express = require('express');
const router = express.Router();
const store = require('../services/store');
const AIService = require('../services/aiService');
const NotificationService = require('../services/notificationService');

// Get all defects with optional filter by assetType or riskLevel
router.get('/', (req, res) => {
  let defects = store.getAllDefects();
  const { assetType, riskLevel } = req.query;

  if (assetType && assetType !== 'all') {
    defects = defects.filter(d => d.assetType.toLowerCase() === assetType.toLowerCase());
  }

  if (riskLevel && riskLevel !== 'all') {
    defects = defects.filter(d => d.riskLevel.toUpperCase() === riskLevel.toUpperCase());
  }

  res.json({ success: true, count: defects.length, data: defects });
});

// Get single defect detail
router.get('/:id', (req, res) => {
  const defect = store.getDefectById(req.params.id);
  if (!defect) {
    return res.status(404).json({ success: false, message: "Defect not found" });
  }
  res.json({ success: true, data: defect });
});

// Trigger New Drone Inspection Analysis
router.post('/analyze', async (req, res) => {
  try {
    const { assetName, assetType, locationName, lat, lng, altitude, inspectorName } = req.body;

    // Call Python AI Service
    const aiResult = await AIService.analyzeImage(null, assetType || "road");

    const newDefect = store.addDefect({
      title: `${aiResult.defect_class} Detected via Drone Scan`,
      assetName: assetName || "Metropolitan Transit Expressway",
      assetType: assetType || "road",
      locationName: locationName || "Sector 44, Geo-Point",
      lat: lat ? parseFloat(lat) : 19.0760 + (Math.random() - 0.5) * 0.05,
      lng: lng ? parseFloat(lng) : 72.8777 + (Math.random() - 0.5) * 0.05,
      altitude: altitude ? parseFloat(altitude) : 35.0,
      riskLevel: aiResult.cost_estimation.risk_score,
      riskScore: aiResult.cost_estimation.risk_numeric,
      defectClass: aiResult.defect_class,
      confidence: aiResult.confidence,
      volumetric: aiResult.volumetric_data,
      costEstimation: aiResult.cost_estimation,
      riskReasons: aiResult.risk_summary.reasons,
      inspector: inspectorName || "Autonomous AirSim Drone Inspector",
      thumbnailUrl: aiResult.annotated_image_base64 || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&q=80"
    });

    if (newDefect.riskLevel === "CRITICAL") {
      NotificationService.sendCriticalSMSAlert(newDefect);
      NotificationService.sendEmailReport(newDefect);
    }

    res.json({ success: true, message: "AI Volumetric Analysis Completed", data: newDefect });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
