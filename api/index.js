import { registerUser, loginUser, getUserByToken } from '../backend/authService.js';

async function parseBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (req.body && typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch (_) {}
  }
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (_) {
        resolve({});
      }
    });
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname.replace(/\/$/, '');

  try {
    if (pathname.endsWith('/auth/signup') || pathname.endsWith('/signup')) {
      if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });
      const body = await parseBody(req);
      const result = registerUser(body);
      return res.status(201).json({ success: true, message: 'Account created successfully', ...result });
    }

    if (pathname.endsWith('/auth/login') || pathname.endsWith('/login')) {
      if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });
      const body = await parseBody(req);
      const result = loginUser(body);
      return res.status(200).json({ success: true, message: 'Authenticated successfully', ...result });
    }

    if (pathname.endsWith('/auth/me') || pathname.endsWith('/me')) {
      if (req.method !== 'GET') return res.status(405).json({ message: 'Method Not Allowed' });
      const authHeader = req.headers.authorization || '';
      const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
      if (!token) return res.status(401).json({ success: false, message: 'No authorization token provided' });
      const user = getUserByToken(token);
      return res.status(200).json({ success: true, user });
    }

    if (pathname.endsWith('/auth/logout') || pathname.endsWith('/logout')) {
      return res.status(200).json({ success: true, message: 'Logged out successfully' });
    }

    if (pathname.endsWith('/health') || pathname === '/api') {
      return res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'CloudTrail Auth API'
      });
    }

    return res.status(404).json({ success: false, message: `Route not found: ${pathname}` });
  } catch (err) {
    const status = err.message && (err.message.includes('Invalid') || err.message.includes('required') || err.message.includes('already exists')) ? 400 : 500;
    return res.status(status).json({ success: false, message: err.message || 'Server error' });
  }
}
