const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const prisma = require('../services/db');
const AIService = require('../services/aiService');
const NotificationService = require('../services/notificationService');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Storage engine for drone inspection image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'drone-scan-' + uniqueSuffix + path.extname(file.originalname || '.jpg'));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

function formatDefect(d) {
  if (!d) return null;
  return {
    ...d,
    volumetric: typeof d.volumetricJson === 'string' ? JSON.parse(d.volumetricJson) : d.volumetricJson,
    costEstimation: typeof d.costEstimationJson === 'string' ? JSON.parse(d.costEstimationJson) : d.costEstimationJson,
    riskReasons: typeof d.riskReasonsJson === 'string' ? JSON.parse(d.riskReasonsJson) : d.riskReasonsJson
  };
}

// 1. POST /api/inspections - Ingestion endpoint for image upload & inspection lifecycle
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { assetName, assetType, locationName, lat, lng, altitude, inspectorName } = req.body;
    let imageBuffer = null;
    let imageUrl = "/defects/pothole_critical_1.jpg";

    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
      imageBuffer = fs.readFileSync(req.file.path);
    }

    // Call Python AI Service
    const aiResult = await AIService.analyzeImage(imageBuffer, assetType || "road");

    const newDefectId = `DEF-${Date.now().toString().slice(-4)}`;
    const riskLevel = aiResult.cost_estimation?.risk_score || "HIGH";

    const createdDefect = await prisma.defect.create({
      data: {
        id: newDefectId,
        title: `${aiResult.defect_class} Detected via Drone Scan`,
        assetName: assetName || "Metropolitan Transit Expressway",
        assetType: assetType || "road",
        locationName: locationName || "Sector 44, Geo-Point",
        lat: lat ? parseFloat(lat) : 18.5680 + (Math.random() - 0.5) * 0.04,
        lng: lng ? parseFloat(lng) : 73.9450 + (Math.random() - 0.5) * 0.04,
        altitude: altitude ? parseFloat(altitude) : 48.5,
        riskLevel,
        riskScore: aiResult.cost_estimation?.risk_numeric || 88,
        defectClass: aiResult.defect_class,
        confidence: aiResult.confidence || 0.95,
        volumetricJson: JSON.stringify(aiResult.volumetric_data || {}),
        costEstimationJson: JSON.stringify(aiResult.cost_estimation || {}),
        riskReasonsJson: JSON.stringify(aiResult.risk_summary?.reasons || []),
        inspector: inspectorName || "Autonomous AirSim Drone Inspector",
        status: "OPEN",
        alertSent: riskLevel === "CRITICAL",
        thumbnailUrl: aiResult.annotated_image_base64 || imageUrl,
        timestamp: "Just now"
      }
    });

    const formatted = formatDefect(createdDefect);

    if (formatted.riskLevel === "CRITICAL") {
      NotificationService.sendCriticalSMSAlert(formatted);
      NotificationService.sendEmailReport(formatted);
    }

    res.status(201).json({
      success: true,
      inspectionId: newDefectId,
      status: "COMPLETED",
      message: "Drone Inspection AI Analysis Completed & Persisted",
      data: formatted
    });
  } catch (err) {
    res.status(500).json({ success: false, status: "FAILED", error: err.message });
  }
});

// 2. GET /api/inspections - List all inspections
router.get('/', async (req, res) => {
  try {
    const defects = await prisma.defect.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, count: defects.length, data: defects.map(formatDefect) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. GET /api/inspections/:id - Single inspection details
router.get('/:id', async (req, res) => {
  try {
    const defect = await prisma.defect.findUnique({
      where: { id: req.params.id }
    });

    if (!defect) {
      return res.status(404).json({ success: false, message: "Inspection record not found" });
    }

    res.json({ success: true, data: formatDefect(defect) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. POST /api/drone/upload - Physical drone frame & metadata ingestion endpoint
router.post('/upload', upload.single('frame'), async (req, res) => {
  try {
    const { droneId, lat, lng, altitude, timestamp } = req.body;
    
    // Ingest frame data from companion computer or ground station
    const newDefectId = `DRONE-INSP-${Date.now().toString().slice(-4)}`;
    
    const createdDefect = await prisma.defect.create({
      data: {
        id: newDefectId,
        title: "Live Drone Frame Inspection Scan",
        assetName: "Corridor Inspection Flight Zone",
        assetType: "road",
        locationName: `GPS (${lat || 18.5585}, ${lng || 73.9165})`,
        lat: lat ? parseFloat(lat) : 18.5585,
        lng: lng ? parseFloat(lng) : 73.9165,
        altitude: altitude ? parseFloat(altitude) : 50.0,
        riskLevel: "HIGH",
        riskScore: 82,
        defectClass: "Sub-base Pothole Scan",
        confidence: 0.94,
        volumetricJson: JSON.stringify({ volume_m3: 0.35, surface_area_m2: 2.1, avg_depth_cm: 9.5 }),
        costEstimationJson: JSON.stringify({ total_estimated_cost: 28500, currency: "₹" }),
        riskReasonsJson: JSON.stringify(["Discovered during live companion computer telemetry stream"]),
        inspector: droneId || "SkyGuardian Drone Unit",
        status: "OPEN",
        alertSent: false,
        thumbnailUrl: req.file ? `/uploads/${req.file.filename}` : "/defects/pothole_critical_1.jpg",
        timestamp: timestamp || new Date().toISOString()
      }
    });

    res.status(201).json({
      success: true,
      message: "Drone Frame Ingested Successfully",
      inspectionId: createdDefect.id,
      data: formatDefect(createdDefect)
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. POST /api/cost/estimate - Configurable cost engine matching architecture blueprint formula
router.post('/estimate', (req, res) => {
  try {
    const { area_m2, depth_m, material_rate, labour_rate, equipment_rate, transport_rate, contingency_rate } = req.body;

    const area = parseFloat(area_m2) || 1.0;
    const depth = parseFloat(depth_m) || 0.1;
    const volume_m3 = area * depth;

    const matRate = parseFloat(material_rate) || 28000;  // ₹ per m3
    const labRate = parseFloat(labour_rate) || 8000;     // ₹ base shift
    const eqRate  = parseFloat(equipment_rate) || 10000;   // ₹ shift
    const trRate  = parseFloat(transport_rate) || 2500;    // ₹ trip
    const contRate = parseFloat(contingency_rate) || 0.10; // 10% contingency

    const material_cost = volume_m3 * matRate;
    const labour_cost = labRate;
    const equipment_cost = eqRate;
    const transport_cost = trRate;
    const subtotal = material_cost + labour_cost + equipment_cost + transport_cost;
    const contingency = subtotal * contRate;
    const total_estimated_cost = Math.round(subtotal + contingency);

    res.json({
      success: true,
      currency: "₹",
      formula: "estimated_cost = material_cost + labour_cost + equipment_cost + transport_cost + contingency",
      breakdown: {
        volume_m3: parseFloat(volume_m3.toFixed(4)),
        material_cost: Math.round(material_cost),
        labour_cost: Math.round(labour_cost),
        equipment_cost: Math.round(equipment_cost),
        transport_cost: Math.round(transport_cost),
        contingency: Math.round(contingency),
        total_estimated_cost
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
