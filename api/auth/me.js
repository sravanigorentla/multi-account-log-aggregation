import { getUserByToken } from '../../backend/authService.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;

  if (!token) {
    return res.status(401).json({ success: false, message: 'No authorization token provided' });
  }

  try {
    const user = getUserByToken(token);
    return res.status(200).json({
      success: true,
      user
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: err.message || 'Invalid or expired token'
    });
  }
}
