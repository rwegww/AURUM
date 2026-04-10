import './_init.js';
import express from 'express';
import cors from 'cors';

import authRoutes from './_routes/auth.js';
import lessonRoutes from './_routes/lessons.js';
import userRoutes from './_routes/user.js';
import mediaRoutes from './_routes/media.js';
import adminRoutes from './_routes/admin.js';
import arenaRoutes from './_routes/arena.js';
import elementsRoutes from './_routes/elements.js';
import materialsRoutes from './_routes/materials.js';
import labRoutes from './_routes/lab.js';
import missionsRoutes from './_routes/missions.js';
import discussionsRouter from './_routes/discussions.js';
import classesRoutes from './_routes/classes.js';
import analyzeRoutes from './_routes/analyze_v3.js';


const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes with additional error isolation
try {
  app.use('/api/auth', authRoutes);
  app.use('/api/lessons', lessonRoutes);
  app.use('/api/user', userRoutes);
  app.use('/api/media', mediaRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/arena', arenaRoutes);
  app.use('/api/elements', elementsRoutes);
  app.use('/api/materials', materialsRoutes);
  app.use('/api/lab', labRoutes);
  app.use('/api/missions', missionsRoutes);
  app.use('/api/discussions', discussionsRouter);
  app.use('/api/classes', classesRoutes);
  app.use('/api/analyze', analyzeRoutes);
} catch (routeError) {
  console.error('❌ CRITICAL: Error mounting routes during startup:', routeError);
}


app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Chemistry Odyssey API is running (Mono-Router)',
    timestamp: new Date().toISOString(),
    node_version: process.version
  });
});

// Diagnostic route for environment variables (Masked for security)
app.get('/api/debug-env', (req, res) => {
  const mask = (str) => str ? `${str.substring(0, 4)}...${str.substring(str.length - 4)}` : 'MISSING';
  res.json({
    node_env: process.env.NODE_ENV,
    SUPABASE_URL: mask(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL),
    SUPABASE_KEY_FOUND: !!(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY),
    JWT_SECRET_FOUND: !!process.env.JWT_SECRET,
    CLOUDINARY_CONFIGURED: !!process.env.CLOUDINARY_CLOUD_NAME,
    FIREBASE_CONFIGURED: !!process.env.FIREBASE_PROJECT_ID
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
// Vercel handles the listener in production, but we need it for local development
if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  // Use 127.0.0.1 explicitly to match Vite's proxy target and avoid IPv6 issues on Windows
  app.listen(PORT, '127.0.0.1', () => {
    console.log(`🚀 Chemistry Odyssey API running on http://127.0.0.1:${PORT}`);
    console.log(`🔗 Health Check: http://127.0.0.1:${PORT}/api/health`);
  });
}

export default app;

