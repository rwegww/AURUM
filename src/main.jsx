import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { injectSpeedInsights } from '@vercel/speed-insights'
import '@/styles/App.css'
import '@/styles/motion.css'
import './i18n'

// Silence Three.js deprecation warnings globally
const originalWarn = console.warn;
console.warn = (...args) => {
  const msg = args.join(' ');
  if (msg.includes('THREE.Clock') && msg.includes('deprecated')) return;
  if (msg.includes('PCFSoftShadowMap') && msg.includes('deprecated')) return;
  originalWarn(...args);
};

import App from './App.jsx'

import { SpeedInsights } from "@vercel/speed-insights/react";
// Initialize Vercel Speed Insights
injectSpeedInsights()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <SpeedInsights />
  </StrictMode>,
)
