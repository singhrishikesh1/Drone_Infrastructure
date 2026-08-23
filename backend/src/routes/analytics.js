const express = require('express');
const router = express.Router();
const prisma = require('../services/db');

router.get('/', async (req, res) => {
  try {
    const defects = await prisma.defect.findMany();

    const totalInspections = defects.length;
    const criticalRisks = defects.filter(d => d.riskLevel === 'CRITICAL').length;
    const highRisks = defects.filter(d => d.riskLevel === 'HIGH').length;
    const mediumRisks = defects.filter(d => d.riskLevel === 'MEDIUM').length;
    const lowRisks = defects.filter(d => d.riskLevel === 'LOW').length;
    const resolvedProblems = defects.filter(d => d.status === 'RESOLVED').length;

    let totalEstimatedBudget = 0;
    defects.forEach(d => {
      try {
        const costData = typeof d.costEstimationJson === 'string' ? JSON.parse(d.costEstimationJson) : d.costEstimationJson;
        if (costData && costData.total_estimated_cost) {
          totalEstimatedBudget += parseFloat(costData.total_estimated_cost);
        }
      } catch (e) {}
    });

    const byAssetType = {
      road: defects.filter(d => d.assetType.toLowerCase() === 'road').length,
      bridge: defects.filter(d => d.assetType.toLowerCase() === 'bridge').length,
      railway: defects.filter(d => d.assetType.toLowerCase() === 'railway').length,
      pipeline: defects.filter(d => d.assetType.toLowerCase() === 'pipeline').length
    };

    const summary = {
      totalInspections,
      criticalRisks,
      highRisks,
      mediumRisks,
      lowRisks,
      resolvedProblems,
      totalEstimatedBudget,
      currency: "₹",
      byAssetType
    };

    res.json({ success: true, data: summary });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
