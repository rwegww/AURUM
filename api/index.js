import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Initialize environment variables ASAP
dotenv.config();

import authRoutes from './routes/auth.js';
import lessonRoutes from './routes/lessons.js';
import userRoutes from './routes/user.js';
import mediaRoutes from './routes/media.js';
import adminRoutes from './routes/admin.js';
import arenaRoutes from './routes/arena.js';
import elementsRoutes from './routes/elements.js';
import materialsRoutes from './routes/materials.js';
import labRoutes from './routes/lab.js';
import missionsRoutes from './routes/missions.js';
import discussionsRouter from './routes/discussions.js';
import classesRoutes from './routes/classes.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
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

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Chemistry Odyssey API is running' });
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

const PORT = process.env.PORT || 5000;

// Consolidated Server Listener
if (process.env.NODE_ENV === 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} else {
  // Use 127.0.0.1 explicitly to match Vite's proxy target and avoid IPv6 issues on Windows
  app.listen(PORT, '127.0.0.1', () => {
    console.log(`🚀 Chemistry Odyssey API running on http://127.0.0.1:${PORT}`);
    console.log(`🔗 Health Check: http://127.0.0.1:${PORT}/api/health`);
  });
}

export default app;

