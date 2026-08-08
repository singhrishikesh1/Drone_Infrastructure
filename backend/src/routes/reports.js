const express = require('express');
const router = express.Router();
const store = require('../services/store');
const PDFService = require('../services/pdfService');
const NotificationService = require('../services/notificationService');

// Download PDF Audit Report
router.get('/pdf/:id', (req, res) => {
  const defect = store.getDefectById(req.params.id);
  if (!defect) {
    return res.status(404).json({ success: false, message: "Defect report not found" });
  }

  PDFService.generateInspectionReport(defect, res);
});

// Trigger SMS Alert
router.post('/sms-alert/:id', async (req, res) => {
  const defect = store.getDefectById(req.params.id);
  if (!defect) {
    return res.status(404).json({ success: false, message: "Defect not found" });
  }

  const result = await NotificationService.sendCriticalSMSAlert(defect);
  res.json({ success: true, message: "SMS Alert Dispatched via Twilio API", data: result });
});

// Trigger Email Audit Report
router.post('/email-report/:id', async (req, res) => {
  const defect = store.getDefectById(req.params.id);
  if (!defect) {
    return res.status(404).json({ success: false, message: "Defect not found" });
  }

  const { email } = req.body;
  const result = await NotificationService.sendEmailReport(defect, email);
  res.json({ success: true, message: "Email Audit Report Dispatched via Nodemailer", data: result });
});

module.exports = router;
