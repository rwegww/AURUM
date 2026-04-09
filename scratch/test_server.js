import http from 'http';
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'ok', msg: 'Simple server works' }));
});
server.listen(5000, '127.0.0.1', () => {
  console.log('Simple server running on http://127.0.0.1:5000');
});
