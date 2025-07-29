// routes/pdf.js
const express = require('express');
const router = express.Router();
const {
  handleCrawlAndGeneratePDFs,
  downloadZip,
} = require('../services/pdfService');
const Job = require('../models/Job');

// Endpoint to crawl site and generate PDFs
router.post('/generate', handleCrawlAndGeneratePDFs);

// Endpoint to download zip file
router.get('/download', downloadZip);

router.get('/status/:jobId', async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  res.json(job);
});

router.get('/jobs', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 }).limit(20);
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

module.exports = router;
