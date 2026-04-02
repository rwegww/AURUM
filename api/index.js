import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import lessonRoutes from './routes/lessons.js';
import userRoutes from './routes/user.js';
import mediaRoutes from './routes/media.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

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

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Chemistry Odyssey API is running on Supabase' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({ 
    message: 'Internal Server Error', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

export default app;

// Local Server Listener (only for 'npm run server')
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  // Use 127.0.0.1 explicitly to match Vite's proxy target and avoid IPv6 issues on Windows
  app.listen(PORT, '127.0.0.1', () => {
    console.log(`🚀 Chemistry Odyssey API running on http://127.0.0.1:${PORT}`);
    console.log(`🔗 Health Check: http://127.0.0.1:${PORT}/api/health`);
  });
}
