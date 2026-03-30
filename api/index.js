import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import lessonRoutes from './routes/lessons.js';
import userRoutes from './routes/user.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Database Connection
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
  }
};

// Routes
app.use('/api/auth', async (req, res, next) => { await connectDB(); next(); }, authRoutes);
app.use('/api/lessons', async (req, res, next) => { await connectDB(); next(); }, lessonRoutes);
app.use('/api/user', async (req, res, next) => { await connectDB(); next(); }, userRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Chemistry Odyssey API is running' });
});

export default app;
