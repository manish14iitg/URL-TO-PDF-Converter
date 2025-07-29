// services/pdfService.js
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const archiver = require('archiver');
const cheerio = require('cheerio');
const { URL } = require('url');
const Job = require('../models/Job');

const TEMP_DIR = path.join(__dirname, '..', 'temp');

const crawlAndGetLinks = async (startUrl, maxPages = 10) => {
  const visited = new Set();
  const queue = [startUrl];
  const baseDomain = new URL(startUrl).hostname;

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  while (queue.length > 0 && visited.size < maxPages) {
    const currentUrl = queue.shift();
    if (visited.has(currentUrl)) continue;

    try {
      await page.goto(currentUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

      const links = await page.evaluate(() =>
        Array.from(document.querySelectorAll('a[href]')).map(a => a.href)
      );

      links.forEach(href => {
        try {
          const absoluteUrl = new URL(href, currentUrl).href;
          const isInternal = new URL(absoluteUrl).hostname === baseDomain;
          if (isInternal && !visited.has(absoluteUrl)) {
            queue.push(absoluteUrl);
          }
        } catch (err) {
          // Ignore bad links
        }
      });

      visited.add(currentUrl);
    } catch (err) {
      console.log(`❌ Failed to crawl: ${currentUrl}`, err.message);
    }
  }

  await browser.close();
  return [...visited];
};


const handleCrawlAndGeneratePDFs = async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  // Create a Job entry in DB
  const job = new Job({ url, status: 'processing' });
  await job.save();

  try {
    const pages = await crawlAndGetLinks(url, 30);
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const pdfPaths = [];

    for (let i = 0; i < pages.length; i++) {
      const pageUrl = pages[i];
      await page.goto(pageUrl, { waitUntil: 'networkidle2', timeout: 15000 });

      const hasVideo = await page.evaluate(() => !!document.querySelector('video'));
      const fileName = `page-${i + 1}.pdf`;
      const pdfPath = path.join(TEMP_DIR, fileName);

      await page.pdf({ path: pdfPath, format: 'A4' });

      pdfPaths.push({ pageUrl, fileName, hasVideo });
    }

    await browser.close();

    job.status = 'done';
    job.pdfs = pdfPaths;
    await job.save();

    res.json({ jobId: job._id, pdfPaths });
  } catch (err) {
    console.error('Error generating PDFs:', err.message);
    job.status = 'failed';
    job.error = err.message;
    await job.save();
    res.status(500).json({ error: 'PDF generation failed', jobId: job._id });
  }
};

const downloadZip = async (req, res) => {
  const zipPath = path.join(TEMP_DIR, 'output.zip');
  const output = fs.createWriteStream(zipPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', () => {
    res.download(zipPath);
  });

  archive.pipe(output);
  fs.readdirSync(TEMP_DIR).forEach(file => {
    if (file.endsWith('.pdf')) {
      archive.file(path.join(TEMP_DIR, file), { name: file });
    }
  });

  archive.finalize();
};

module.exports = {
  handleCrawlAndGeneratePDFs,
  downloadZip,
};
