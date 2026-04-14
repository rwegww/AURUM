import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './lib/supabase.js';

// Route Imports
import aiRouter from './_routes/ai.js';
import authRouter from './_routes/auth.js';
import userRouter from './_routes/user.js';
import arenaRouter from './_routes/arena.js';
import adminRouter from './_routes/admin.js';
import lessonsRouter from './_routes/lessons.js';
import materialsRouter from './_routes/materials.js';
import mediaRouter from './_routes/media.js';
import elementsRouter from './_routes/elements.js';
import labRouter from './_routes/lab.js';
import analyzeRouter from './_routes/analyze_v3.js';
import missionsRouter from './_routes/missions.js';
import classesRouter from './_routes/classes.js';
import discussionsRouter from './_routes/discussions.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes Mounting
app.use('/api/ai', aiRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/arena', arenaRouter);
app.use('/api/admin', adminRouter);
app.use('/api/lessons', lessonsRouter);
app.use('/api/materials', materialsRouter);
app.use('/api/media', mediaRouter);
app.use('/api/elements', elementsRouter);
app.use('/api/lab', labRouter);
app.use('/api/analyze', analyzeRouter);
app.use('/api/missions', missionsRouter);
app.use('/api/classes', classesRouter);
app.use('/api/discussions', discussionsRouter);

// Basic Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Aurum API is running (Full-Router)',
    timestamp: new Date().toISOString(),
    node_version: process.version
  });
});

// Diagnostic route for environment variables (Masked for security)
app.get('/api/debug-env', (req, res) => {
  const mask = (str) => str ? `${str.substring(0, 4)}...${str.substring(str.length - 4)}` : 'MISSING';
  res.json({
    status: 'Operational',
    node_env: process.env.NODE_ENV,
    SUPABASE_URL: mask(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL),
    OPENAI_API_READY: !!process.env.OPENAI_API_KEY,
    active_model: 'gpt-4o-mini',
    timestamp: new Date().toISOString()
  });
});

// Fallback for non-existent API routes
app.use('/api', (req, res) => {
  console.warn(`[404] Resource not found: ${req.originalUrl}`);
  res.status(404).json({ error: 'Endpoint not found', path: req.originalUrl });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({ 
    message: 'Internal Server Error', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// Consolidated Server Listener
if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '127.0.0.1', () => {
    console.log(`🚀 Aurum API running on http://127.0.0.1:${PORT}`);
    console.log(`🔗 Health Check: http://127.0.0.1:${PORT}/api/health`);
  });
}

export default app;
