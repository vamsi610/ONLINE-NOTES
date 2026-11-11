import express from 'express';
import dotenv from 'dotenv';
import { connectDB, getDBStatus } from './config/db.ts';
import authRoutes from './routes/authRoutes.ts';
import noteRoutes from './routes/noteRoutes.ts';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple CORS header setup
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// Database Health Check Endpoint
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'online',
    appName: 'Online Notes Management System API',
    mongoDBConnected: getDBStatus(),
    timestamp: new Date().toISOString(),
  });
});

// Connect to MongoDB and start server if run directly
if (process.env.NODE_ENV !== 'test') {
  connectDB().then((res) => {
    console.log(`[Database Init] ${res.message}`);
  });

  if (process.env.STANDALONE_SERVER === 'true' || !process.env.VITE) {
    app.listen(PORT, () => {
      console.log(`🚀 Online Notes Management System Backend running on port ${PORT}`);
      console.log(`👉 Access API at http://localhost:${PORT}/api/health`);
    });
  }
}

export default app;
