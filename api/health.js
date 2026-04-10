export default function handler(req, res) {
  res.status(200).json({ 
    status: 'ok', 
    service: 'Chemistry Odyssey Standalone Health',
    timestamp: new Date().toISOString(),
    node_version: process.version,
    env_keys: Object.keys(process.env).filter(k => k.includes('SUPABASE') || k.includes('VITE_')).map(k => k.substring(0, 10) + '...')
  });
}
