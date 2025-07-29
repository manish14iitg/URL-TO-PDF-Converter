// server.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const pdfRoutes = require('./routes/pdf');
const connectDB = require('./config/db');
require('dotenv').config();
connectDB();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'temp')));

app.use('/api/pdf', pdfRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
