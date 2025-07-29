const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  url: { type: String, required: true },
  status: { type: String, enum: ['pending', 'processing', 'done', 'failed'], default: 'pending' },
  pdfs: [
    {
      pageUrl: String,
      fileName: String,
      hasVideo: Boolean,
    },
  ],
  error: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Job', JobSchema);