const express = require('express');
const router = express.Router();
const prisma = require('../services/db');
const PDFService = require('../services/pdfService');
const NotificationService = require('../services/notificationService');

function formatDefect(d) {
  if (!d) return null;
  return {
    ...d,
    volumetric: typeof d.volumetricJson === 'string' ? JSON.parse(d.volumetricJson) : d.volumetricJson,
    costEstimation: typeof d.costEstimationJson === 'string' ? JSON.parse(d.costEstimationJson) : d.costEstimationJson,
    riskReasons: typeof d.riskReasonsJson === 'string' ? JSON.parse(d.riskReasonsJson) : d.riskReasonsJson
  };
}

// Download PDF Audit Report
router.get('/pdf/:id', async (req, res) => {
  try {
    const rawDefect = await prisma.defect.findUnique({
      where: { id: req.params.id }
    });

    if (!rawDefect) {
      return res.status(404).json({ success: false, message: "Defect report not found" });
    }

    const defect = formatDefect(rawDefect);
    PDFService.generateInspectionReport(defect, res);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Trigger SMS Alert
router.post('/sms-alert/:id', async (req, res) => {
  try {
    const rawDefect = await prisma.defect.findUnique({
      where: { id: req.params.id }
    });

    if (!rawDefect) {
      return res.status(404).json({ success: false, message: "Defect not found" });
    }

    const defect = formatDefect(rawDefect);
    const result = await NotificationService.sendCriticalSMSAlert(defect);
    res.json({ success: true, message: "SMS Alert Dispatched via Twilio API", data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Trigger Email Audit Report
router.post('/email-report/:id', async (req, res) => {
  try {
    const rawDefect = await prisma.defect.findUnique({
      where: { id: req.params.id }
    });

    if (!rawDefect) {
      return res.status(404).json({ success: false, message: "Defect not found" });
    }

    const defect = formatDefect(rawDefect);
    const { email } = req.body;
    const result = await NotificationService.sendEmailReport(defect, email);
    res.json({ success: true, message: "Email Audit Report Dispatched via Nodemailer", data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
