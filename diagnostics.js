import app from './api/index.js';
import http from 'http';

const PORT = 5001; // Use a different port for testing
const server = app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  
  http.get(`http://localhost:${PORT}/api/health`, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      console.log('Response:', data);
      server.close();
      process.exit(0);
    });
  }).on('error', (err) => {
    console.error('Error:', err.message);
    server.close();
    process.exit(1);
  });
});
