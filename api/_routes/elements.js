import express from 'express';
import { auth, requireRole } from '../_middleware/auth.js';
import { elements as staticElements } from '../../src/data/elements.js';

const router = express.Router();

const toApiElement = (element) => ({
  atomic_number: element.number,
  number: element.number,
  symbol: element.symbol,
  name: element.name,
  atomic_mass: Number.parseFloat(element.weight) || null,
  weight: element.weight,
  state: element.state || 'unknown',
  category: element.category || 'unknown',
  color_hex: element.colorHex || null,
  electron_configuration: Array.isArray(element.shells) ? element.shells.join('-') : null,
  shells: element.shells || [],
  description: element.desc || element.description || null,
  desc: element.desc || element.description || null,
  x: element.x,
  y: element.y,
});

router.get('/', async (_req, res) => {
  try {
    res.status(200).json({
      success: true,
      elements: staticElements.map(toApiElement)
    });
  } catch (error) {
    console.error('Error loading periodic elements:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/seed', auth, requireRole('admin'), async (_req, res) => {
  res.status(410).json({
    success: false,
    message: 'Periodic elements are served from static app data; database seeding is no longer supported.'
  });
});

export default router;
