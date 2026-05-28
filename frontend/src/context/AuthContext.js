// context/AuthContext.js
// Provides { user, token, login, logout } to all components via useAuth()
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const [user,  setUser]  = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('laurus_token'));
  const [ready, setReady] = useState(false); // has initial auth check finished?

  // On mount: verify stored token and restore user
  useEffect(() => {
    if (!token) { setReady(true); return; }
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(u  => setUser(u))
      .catch(() => { localStorage.removeItem('laurus_token'); setToken(null); })
      .finally(() => setReady(true));
  }, []); // eslint-disable-line

  const login = useCallback((userData, jwt) => {
    localStorage.setItem('laurus_token', jwt);
    setToken(jwt);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('laurus_token');
    setToken(null);
    setUser(null);
  }, []);

  // authFetch — convenience wrapper that injects Authorization header
  const authFetch = useCallback((url, opts = {}) =>
    fetch(url, {
      ...opts,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(opts.headers || {}) },
      body: opts.body && typeof opts.body === 'object' ? JSON.stringify(opts.body) : opts.body,
    }), [token]);

  return (
    <Ctx.Provider value={{ user, token, isAdmin: user?.role === 'admin', login, logout, authFetch, ready }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
