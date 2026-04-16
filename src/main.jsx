import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/App.css'
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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
