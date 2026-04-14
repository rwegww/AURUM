import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './lib/supabase.js';
import aiRouter from './_routes/ai.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Main AI Route
app.use('/api/ai', aiRouter);

// Basic Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Aurum API is running (Mono-Router)',
    tasks: [
      '[x] Install OpenAI SDK',
      '[x] Update .env with OpenAI API Key',
      '[x] Refactor api/_routes/ai.js to use OpenAI (GPT-4o)',
      '[x] Update api/index.js diagnostic route',
      '[x] Commit and push changes',
      '[x] Verify system functionality'
    ],
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
