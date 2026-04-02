import fetch from 'node-fetch';

async function test() {
  const timestamp = Date.now();
  const username = 'user' + timestamp;
  const email = 'email' + timestamp + '@test.com';
  const password = 'Password123!';

  console.log('--- Step 1: Register ---');
  const regRes = await fetch('http://127.0.0.1:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });
  console.log('Register Status:', regRes.status);

  console.log('\n--- Step 2: Login with Email ---');
  const loginEmailRes = await fetch('http://127.0.0.1:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: email, password })
  });
  const dataEmail = await loginEmailRes.json();
  console.log('Login Email Status:', loginEmailRes.status);
  console.log('User found:', JSON.stringify(dataEmail.user, null, 2));
  console.log('Input email:', email);
}

test();
