import './env.js';
import express from 'express';
import cors from 'cors';

// Route Imports
import authRouter from './_routes/auth.js';
import userRouter from './_routes/user.js';
import arenaRouter from './_routes/arena.js';
import adminRouter from './_routes/admin.js';
import lessonsRouter from './_routes/lessons.js';
import materialsRouter from './_routes/materials.js';
import elementsRouter from './_routes/elements.js';
import labRouter from './_routes/lab.js';
import missionsRouter from './_routes/missions.js';
import classesRouter from './_routes/classes.js';
import discussionsRouter from './_routes/discussions.js';

const app = express();

// Middleware
const configuredOrigins = [
  process.env.FRONTEND_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  process.env.URL, // Netlify primary URL
  process.env.DEPLOY_URL, // Netlify deploy preview URL
  'https://chem-aurum.vercel.app',
  ...(process.env.CORS_ORIGINS || '').split(','),
].filter(Boolean).map((origin) => origin.trim());

app.use(cors({
  origin(origin, callback) {
    if (!origin || process.env.NODE_ENV !== 'production' || configuredOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
}));
app.use(express.json());

// API Routes Mounting
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/arena', arenaRouter);
app.use('/api/admin', adminRouter);
app.use('/api/lessons', lessonsRouter);
app.use('/api/materials', materialsRouter);
app.use('/api/elements', elementsRouter);
app.use('/api/lab', labRouter);
app.use('/api/missions', missionsRouter);
app.use('/api/classes', classesRouter);
app.use('/api/discussions', discussionsRouter);

// Analyze route — lazy-loaded per-request to prevent Vercel cold-start crash
// (pdf-parse, word-extractor, multer are heavy native modules that may fail on serverless)
let _analyzeRouter = null;
let _analyzeLoadError = null;
app.use('/api/analyze', async (req, res, next) => {
  if (_analyzeLoadError) {
    return res.status(503).json({ message: 'Dịch vụ phân tích tài liệu tạm thời không khả dụng.', error: _analyzeLoadError });
  }
  if (!_analyzeRouter) {
    try {
      const mod = await import('./_routes/analyze_v3.js');
      _analyzeRouter = mod.default;
      console.log('✅ Analyze router lazy-loaded on first request.');
    } catch (err) {
      _analyzeLoadError = err.message;
      console.error('⚠️ Analyze router failed to load:', err.message);
      return res.status(503).json({ message: 'Dịch vụ phân tích tài liệu tạm thời không khả dụng.', error: err.message });
    }
  }
  return _analyzeRouter(req, res, next);
});

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
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  const mask = (str) => str ? `${str.substring(0, 4)}...${str.substring(str.length - 4)}` : 'MISSING';
  res.json({
    status: 'Operational',
    node_env: process.env.NODE_ENV,
    SUPABASE_URL: mask(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL),
    OPENAI_API_READY: !!process.env.OPENAI_API_KEY,
    SMTP_CONFIGURED: !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS),
    SMTP_HOST: process.env.SMTP_HOST || 'MISSING',
    SMTP_USER: process.env.SMTP_USER ? mask(process.env.SMTP_USER) : 'MISSING',
    active_model: 'gpt-4o-mini',
    timestamp: new Date().toISOString()
  });
});

// Fallback for non-existent API routes
app.use('/api', (req, res) => {
  console.warn(`[404] Resource not found: ${req.originalUrl}`);
  res.status(404).json({ error: 'Endpoint not found', path: req.originalUrl });
});

// Body parser error handler (catches express.json() failures)
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed' || err.status === 400) {
    return res.status(400).json({ message: 'Invalid JSON body', error: err.message });
  }
  next(err);
});

// Global Error Handler
app.use((err, req, res, _next) => {
  console.error('❌ Server Error:', err);
  const showDetails = process.env.NODE_ENV !== 'production';
  res.status(500).json({ 
    message: 'Internal Server Error', 
    ...(showDetails ? {
      error: err.message,
      type: err.type || err.constructor?.name
    } : {})
  });
});


// Consolidated Server Listener
if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  const HOST = process.env.API_HOST || '127.0.0.1';
  app.listen(PORT, HOST, () => {
    console.log(`🚀 Aurum API running on http://${HOST}:${PORT}`);
    console.log(`🔗 Health Check: http://${HOST}:${PORT}/api/health`);
    
    // Local Cron Simulation (runs every 60 seconds to dispatch reminders automatically)
    console.log('⏰ Local Cron Simulation started (checks every 60 seconds).');
    setInterval(async () => {
      try {
        const response = await fetch(`http://127.0.0.1:${PORT}/api/user/cron-send-reminders`);
        const result = await response.json();
        if (result.details && result.details.length > 0) {
          console.log('[Local Cron] Simulation run completed:', result.message);
        }
      } catch (err) {
        console.error('[Local Cron] Simulation failed to ping route:', err.message);
      }
    }, 60000);
  });
}

export default app;
