import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY_TOKEN = 'cloudtrail_auth_token';
const STORAGE_KEY_USER = 'cloudtrail_auth_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      return saved ? JSON.parse(saved) : null;
    } catch (_) {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_TOKEN) || null;
    } catch (_) {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(true);

  // Validate session on initial mount
  useEffect(() => {
    async function verifySession() {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
            localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(data.user));
          }
        } else {
          // Token invalid or expired
          logout();
        }
      } catch (err) {
        // Network error: keep cached session if available
        console.warn('Session verification fallback to local cache:', err);
      } finally {
        setIsLoading(false);
      }
    }

    verifySession();
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Login failed. Please check your credentials.');
    }

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem(STORAGE_KEY_TOKEN, data.token);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(data.user));

    return data.user;
  };

  // Signup handler
  const signup = async ({ name, email, password, role, organization }) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password, role, organization })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Registration failed. Please check your details.');
    }

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem(STORAGE_KEY_TOKEN, data.token);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(data.user));

    return data.user;
  };

  // Demo 1-Click Login
  const demoLogin = async (roleType = 'admin') => {
    if (roleType === 'admin') {
      return await login('admin@cloudtrail.aws', 'Admin@123');
    } else {
      return await login('alex.rivera@cloudtrail.aws', 'Admin@123');
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (_) {}

    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    localStorage.removeItem(STORAGE_KEY_USER);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        demoLogin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
