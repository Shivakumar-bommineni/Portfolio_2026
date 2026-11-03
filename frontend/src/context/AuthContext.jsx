import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';
import {
  TAB_ID, channel, broadcast,
  readAuth, writeAuth,
} from '../utils/tabSession';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(() => readAuth());
  const [loading, setLoading] = useState(!readAuth());

  // Clean up legacy tab contention keys
  try {
    localStorage.removeItem('shiv_active_tab');
  } catch (e) {
    // ignore
  }

  // ── Server session verification ──────────────────────────────────────────
  const checkAuth = useCallback(async (silent = false) => {
    try {
      const res = await authAPI.getMe();
      const u = res.data.user;
      const current = readAuth();
      const merged = { ...current, ...u };
      writeAuth(merged);
      setUser(merged);
      if (!silent) setLoading(false);
    } catch (err) {
      if (err.response?.status === 401) {
        writeAuth(null);
        setUser(null);
      }
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();

    // Re-verify silently whenever tab regains focus
    const onVisibility = () => {
      if (document.visibilityState === 'visible') checkAuth(true);
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [checkAuth]);

  // ── Cross-tab BroadcastChannel listener (Smooth multi-tab sync) ──────────
  useEffect(() => {
    if (!channel) return;
    const handleMsg = ({ data }) => {
      if (data.tabId === TAB_ID) return; // ignore own messages

      if (data.type === 'LOGOUT') {
        writeAuth(null);
        setUser(null);
        window.location.replace('/login');
      }

      if (data.type === 'LOGIN') {
        // Another tab logged in — sync local auth silently without blocking
        if (data.user) {
          writeAuth(data.user);
          setUser(data.user);
        }
      }
    };
    channel.addEventListener('message', handleMsg);
    return () => channel.removeEventListener('message', handleMsg);
  }, []);

  // ── Cross-tab storage listener for sync ─────────────────────────────────
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'shiv_auth_user') {
        if (e.newValue === null) {
          setUser(null);
          window.location.replace('/login');
        } else {
          try {
            const u = JSON.parse(e.newValue);
            setUser(u);
          } catch (err) {
            // ignore
          }
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // ── Public auth API ──────────────────────────────────────────────────────
  const login = (userData) => {
    writeAuth(userData);
    setUser(userData);
    broadcast('LOGIN', { user: userData });
  };

  const logout = async (skipApi = false) => {
    writeAuth(null);
    setUser(null);
    broadcast('LOGOUT');
    if (!skipApi) {
      try { await authAPI.logout(); } catch { /* ignore */ }
    }
  };

  // Backwards compatible no-op claimSession
  const claimSession = useCallback(() => true, []);

  return (
    <AuthContext.Provider value={{ user, loading, blockedTab: false, login, logout, claimSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
