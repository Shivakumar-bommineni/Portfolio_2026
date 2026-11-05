import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { authAPI } from '../services/api';
import { cookie } from '../utils/cookies';
import {
  TAB_ID, channel, broadcast,
  readAuth, writeAuth,
} from '../utils/tabSession';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => (cookie.get('session_hint') ? 'httponly-session' : null));
  const [user, setUser] = useState(() => readAuth());
  const [isBootstrapping, setIsBootstrapping] = useState(() => !readAuth() && !!cookie.get('session_hint'));
  const loggingOutRef = useRef(false);

  // Clean up legacy tab contention keys
  try {
    localStorage.removeItem('shiv_active_tab');
  } catch (e) {
    // ignore
  }

  // ── Production Auth Bootstrap (HttpOnly Cookie Verification) ───────────
  // Tokens live exclusively in HttpOnly cookies in production for XSS defense.
  // JavaScript never reads the raw token. On reload, if a session_hint cookie exists,
  // we probe /api/auth/me using withCredentials (browser automatically carries the HttpOnly cookie).
  // If valid, state is restored with the sentinel 'httponly-session'.
  // If expired, silent refresh is attempted before deciding user is logged out.
  useEffect(() => {
    if (!cookie.get('session_hint')) {
      setIsBootstrapping(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        let res;
        try {
          res = await authAPI.getMe({ suppressAuthExpiry: true });
        } catch (probeErr) {
          if (probeErr?.response?.status !== 401) throw probeErr;

          const errCode = probeErr?.response?.data?.code || probeErr?.response?.data?.error;
          if (errCode === 'SESSION-REVOKED') {
            try { await authAPI.logout(); } catch { }
            throw probeErr;
          }

          // Access token expired; attempt silent refresh with HttpOnly refresh cookie
          await authAPI.refreshToken({ suppressAuthExpiry: true });
          res = await authAPI.getMe({ suppressAuthExpiry: true });
        }

        if (cancelled || !res?.data?.user) return;
        const fetchedUser = res.data.user;

        setToken('httponly-session');
        setUser(fetchedUser);
        writeAuth(fetchedUser);
      } catch (err) {
        // Genuinely not logged in or session expired
        cookie.remove('session_hint');
        setToken(null);
        setUser(null);
        writeAuth(null);
      } finally {
        if (!cancelled) {
          setIsBootstrapping(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // ── Cross-tab BroadcastChannel listener (Smooth multi-tab sync) ──────────
  useEffect(() => {
    if (!channel) return;
    const handleMsg = ({ data }) => {
      if (data.tabId === TAB_ID) return; // ignore own messages

      if (data.type === 'LOGOUT') {
        cookie.remove('session_hint');
        setToken(null);
        setUser(null);
        writeAuth(null);
        window.location.replace('/login');
      }

      if (data.type === 'LOGIN') {
        if (data.user) {
          cookie.set('session_hint', '1', { days: 30 });
          setToken('httponly-session');
          setUser(data.user);
          writeAuth(data.user);
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
          setToken(null);
          setUser(null);
          window.location.replace('/login');
        } else {
          try {
            const u = JSON.parse(e.newValue);
            setUser(u);
            setToken('httponly-session');
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
    cookie.set('session_hint', '1', { days: 30 });
    setToken('httponly-session');
    // Strip raw tokens: in production, tokens are strictly HttpOnly cookies and must never reside in localStorage!
    const { accessToken, token: t, refreshToken, ...safeUser } = userData || {};
    setUser(safeUser);
    writeAuth(safeUser);
    broadcast('LOGIN', { user: safeUser });
  };

  const logout = async (skipApi = false) => {
    if (loggingOutRef.current) return;
    loggingOutRef.current = true;

    cookie.remove('session_hint');
    setToken(null);
    setUser(null);
    writeAuth(null);
    broadcast('LOGOUT');

    if (!skipApi) {
      try {
        await authAPI.logout();
      } catch {
        // ignore
      }
    }
    loggingOutRef.current = false;
  };

  const claimSession = useCallback(() => true, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: Boolean(token || user),
        isBootstrapping,
        loading: isBootstrapping,
        blockedTab: false,
        login,
        logout,
        claimSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
