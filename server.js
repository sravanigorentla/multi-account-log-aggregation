import http from 'node:http';
import { registerUser, loginUser, getUserByToken, getAllUsersSafe } from './backend/authService.js';

const PORT = process.env.PORT || 5000;

function readBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (_) {
        resolve({});
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname.replace(/\/$/, '');

  try {
    if (pathname === '/api/auth/signup') {
      if (req.method !== 'POST') {
        res.statusCode = 405;
        return res.end(JSON.stringify({ success: false, message: 'Method Not Allowed' }));
      }
      const body = await readBody(req);
      const result = registerUser(body);
      res.statusCode = 201;
      return res.end(JSON.stringify({ success: true, message: 'Account registered successfully', ...result }));
    }

    if (pathname === '/api/auth/login') {
      if (req.method !== 'POST') {
        res.statusCode = 405;
        return res.end(JSON.stringify({ success: false, message: 'Method Not Allowed' }));
      }
      const body = await readBody(req);
      const result = loginUser(body);
      res.statusCode = 200;
      return res.end(JSON.stringify({ success: true, message: 'Authenticated successfully', ...result }));
    }

    if (pathname === '/api/auth/me') {
      if (req.method !== 'GET') {
        res.statusCode = 405;
        return res.end(JSON.stringify({ success: false, message: 'Method Not Allowed' }));
      }
      const authHeader = req.headers.authorization || '';
      const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
      if (!token) {
        res.statusCode = 401;
        return res.end(JSON.stringify({ success: false, message: 'No authorization token provided' }));
      }
      const user = getUserByToken(token);
      res.statusCode = 200;
      return res.end(JSON.stringify({ success: true, user }));
    }

    if (pathname === '/api/auth/users') {
      const users = getAllUsersSafe();
      res.statusCode = 200;
      return res.end(JSON.stringify({ success: true, count: users.length, users }));
    }

    if (pathname === '/api/auth/logout') {
      res.statusCode = 200;
      return res.end(JSON.stringify({ success: true, message: 'Logged out successfully' }));
    }

    if (pathname === '/api/health' || pathname === '/') {
      res.statusCode = 200;
      return res.end(
        JSON.stringify({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          service: 'CloudTrail Multi-Account Backend Server'
        })
      );
    }

    res.statusCode = 404;
    return res.end(JSON.stringify({ success: false, message: 'Endpoint not found' }));
  } catch (err) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ success: false, message: err.message || 'Server error' }));
  }
});

server.listen(PORT, () => {
  console.log(`Backend API server running at http://localhost:${PORT}`);
});
