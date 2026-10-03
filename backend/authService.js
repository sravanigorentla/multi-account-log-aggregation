import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const JWT_SECRET = process.env.JWT_SECRET || 'cloudtrail-multi-account-jwt-secret-key-2026';
const USERS_FILE = path.resolve(process.cwd(), 'data', 'users.json');

// Helper: Hash password with salt
function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

// Helper: Verify password
function verifyPassword(password, hash, salt) {
  try {
    const checkHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(checkHash, 'hex'));
  } catch (_) {
    return false;
  }
}

// Helper: Base64URL encode/decode
function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str) {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf8');
}

// Helper: Generate Token (JWT format)
export function createToken(payload, expiresInSeconds = 86400 * 7) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const fullPayload = { ...payload, exp, iat: Math.floor(Date.now() / 1000) };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

// Helper: Verify Token
export function verifyToken(token) {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signature] = parts;
    const expectedSig = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${headerB64}.${payloadB64}`)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    if (signature !== expectedSig) {
      return null;
    }

    const payload = JSON.parse(base64UrlDecode(payloadB64));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }

    return payload;
  } catch (err) {
    return null;
  }
}

// Seed default admin credentials: admin@cloudtrail.aws / Admin@123
const defaultSalt = 'a9f24c3e80d9f4b1625e1975e52c8a14';
const defaultHash = crypto.pbkdf2Sync('Admin@123', defaultSalt, 100000, 64, 'sha512').toString('hex');

const initialUsers = [
  {
    id: 'usr-admin-001',
    name: 'Sravani K.',
    email: 'admin@cloudtrail.aws',
    role: 'Cloud Security Admin',
    organization: 'AWS SecOps Central',
    salt: defaultSalt,
    passwordHash: defaultHash,
    createdAt: '2026-01-15T09:00:00Z',
    avatarInitials: 'SK'
  },
  {
    id: 'usr-sec-002',
    name: 'Alex Rivera',
    email: 'alex.rivera@cloudtrail.aws',
    role: 'Lead Cloud Architect',
    organization: 'FinTech Cloud Infrastructure',
    salt: defaultSalt,
    passwordHash: defaultHash,
    createdAt: '2026-02-10T11:30:00Z',
    avatarInitials: 'AR'
  }
];

let users = [...initialUsers];

// Read from JSON file if available
try {
  if (fs.existsSync(USERS_FILE)) {
    const raw = fs.readFileSync(USERS_FILE, 'utf8');
    const loaded = JSON.parse(raw);
    if (Array.isArray(loaded) && loaded.length > 0) {
      users = loaded;
    }
  } else {
    try {
      const dataDir = path.dirname(USERS_FILE);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
    } catch (_) {}
  }
} catch (_) {}

function saveUsers() {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
  } catch (_) {}
}

function sanitizeUser(user) {
  const { passwordHash, salt, ...safeUser } = user;
  return safeUser;
}

function getInitials(name) {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function registerUser({ name, email, password, role = 'Cloud Security Analyst', organization = 'AWS Multi-Account Core' }) {
  if (!name || !email || !password) {
    throw new Error('Name, email, and password are required');
  }

  const cleanEmail = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    throw new Error('Please enter a valid email address');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    throw new Error('An account with this email address already exists');
  }

  const { hash, salt } = hashPassword(password);
  const newUser = {
    id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: name.trim(),
    email: cleanEmail,
    role: role.trim() || 'Cloud Security Analyst',
    organization: organization.trim() || 'AWS Enterprise',
    salt,
    passwordHash: hash,
    createdAt: new Date().toISOString(),
    avatarInitials: getInitials(name)
  };

  users.push(newUser);
  saveUsers();

  const safe = sanitizeUser(newUser);
  const token = createToken({ id: safe.id, email: safe.email, role: safe.role, name: safe.name });

  return { user: safe, token };
}

export function loginUser({ email, password }) {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const cleanEmail = email.trim().toLowerCase();
  const user = users.find((u) => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const valid = verifyPassword(password, user.passwordHash, user.salt);
  if (!valid) {
    throw new Error('Invalid email or password');
  }

  const safe = sanitizeUser(user);
  const token = createToken({ id: safe.id, email: safe.email, role: safe.role, name: safe.name });

  return { user: safe, token };
}

export function getUserByToken(token) {
  const payload = verifyToken(token);
  if (!payload || !payload.id) {
    throw new Error('Invalid or expired authentication token');
  }

  const user = users.find((u) => u.id === payload.id);
  if (!user) {
    throw new Error('User not found');
  }

  return sanitizeUser(user);
}

export function getAllUsersSafe() {
  return users.map(sanitizeUser);
}
