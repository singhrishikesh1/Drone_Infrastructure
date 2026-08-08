const express = require('express');
const router = express.Router();
const store = require('../services/store');

router.get('/', (req, res) => {
  const summary = store.getAnalyticsSummary();
  res.json({ success: true, data: summary });
});

module.exports = router;
