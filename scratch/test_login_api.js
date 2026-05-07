import fetch from 'node-fetch';

async function test() {
  try {
    const res = await fetch('https://chem-aurum.vercel.app/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'test', password: 'test' })
    });
    console.log('Status:', res.status);
    const data = await res.text();
    console.log('Response:', data);
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
}

test();
