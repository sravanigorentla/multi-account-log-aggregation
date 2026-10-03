import { defineConfig } from 'vite';
import { registerUser, loginUser, getUserByToken } from './backend/authService.js';

function apiBackendPlugin() {
  return {
    name: 'api-backend-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api')) {
          return next();
        }

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (req.method === 'OPTIONS') {
          res.statusCode = 200;
          return res.end();
        }

        const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        const pathname = url.pathname.replace(/\/$/, '');

        const readBody = () =>
          new Promise((resolve) => {
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

        try {
          if (pathname === '/api/auth/signup') {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              return res.end(JSON.stringify({ success: false, message: 'Method Not Allowed' }));
            }
            const body = await readBody();
            const result = registerUser(body);
            res.statusCode = 201;
            return res.end(JSON.stringify({ success: true, message: 'Account created successfully', ...result }));
          }

          if (pathname === '/api/auth/login') {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              return res.end(JSON.stringify({ success: false, message: 'Method Not Allowed' }));
            }
            const body = await readBody();
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

          if (pathname === '/api/auth/logout') {
            res.statusCode = 200;
            return res.end(JSON.stringify({ success: true, message: 'Logged out successfully' }));
          }

          if (pathname === '/api/health') {
            res.statusCode = 200;
            return res.end(
              JSON.stringify({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                service: 'CloudTrail Dev API'
              })
            );
          }

          return next();
        } catch (err) {
          res.statusCode = 400;
          return res.end(JSON.stringify({ success: false, message: err.message || 'Server error' }));
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [apiBackendPlugin()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    open: true,
  },
});
