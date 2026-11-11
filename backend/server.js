const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables from .env
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/notes', require('./routes/noteRoutes'));

// Root & Health Check
app.get('/', (req, res) => {
  res.send('Online Notes Management System API is running...');
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    appName: 'Online Notes Management System API',
    database: 'MongoDB',
    timestamp: new Date().toISOString(),
  });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 Online Notes Management System Backend`);
  console.log(`🌐 Server running at: http://localhost:${PORT}`);
  console.log(`📚 API Docs / Health: http://localhost:${PORT}/api/health`);
  console.log(`===============================================`);
});
