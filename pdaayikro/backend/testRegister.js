const http = require('http');
const data = JSON.stringify({
  fullName: 'Test User',
  email: 'testuser@example.com',
  phone: '9999999999',
  password: 'password123',
  previousPercentage: 50
});

const options = {
  hostname: 'localhost',
  port: 5057,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('STATUS', res.statusCode);
    console.log('BODY', body);
    process.exit(0);
  });
});

req.on('error', (e) => {
  console.error('REQ ERROR', e);
  process.exit(1);
});

req.write(data);
req.end();
