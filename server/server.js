import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB, isDBConnected } from './config/db.js';
import paperRoutes from './routes/paperRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import experimentRoutes from './routes/experimentRoutes.js';
import { mockStore } from './data/mockStore.js';

// Load environment variables
dotenv.config();

// Attempt DB connection (handles standalone/in-memory mode safely)
await connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    appName: 'MARGIN Research & Thesis Workspace API',
    mode: isDBConnected() ? 'MongoDB Connected' : 'Standalone Dual-Mode (In-Memory Active)',
    database: {
      connected: isDBConnected(),
      configuredUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/margin_db',
    },
    counts: {
      papers: mockStore.getPapers().length,
      notes: mockStore.getNotes().length,
      projects: mockStore.getProjects().length,
      experiments: mockStore.getExperiments().length,
    },
    timestamp: new Date().toISOString(),
  });
});

// Reset endpoint
app.post('/api/reset', (req, res) => {
  const resetData = mockStore.resetStore();
  res.status(200).json(resetData);
});

// REST API Routes
app.use('/api/papers', paperRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/experiments', experimentRoutes);

// Welcome Root route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to MARGIN API — MERN Stack Backend',
    endpoints: [
      '/api/health',
      '/api/papers',
      '/api/notes',
      '/api/projects',
      '/api/experiments',
      '/api/reset',
    ],
    mode: isDBConnected() ? 'MongoDB Active' : 'Standalone In-Memory Store (Instructor Safe Mode)',
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]:', err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`[MARGIN Server]: Running on http://localhost:${PORT} (${process.env.NODE_ENV || 'development'})`);
});

