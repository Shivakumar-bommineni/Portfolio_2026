import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { roleHome } from '../components/RoleRoute';
import { useTheme } from '../context/ThemeContext';
import SessionSelectionScreen from '../components/SessionSelectionScreen';
import { getDeviceId, getDeviceInfo, getUserPinpointLocation } from '../utils/device';

const SunIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
  </svg>
);
const MoonIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
  </svg>
);
const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);
const IconEye = ({ open }) => open ? (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
) : (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme, toggle } = useTheme();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionSelectionData, setSessionSelectionData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone || !password) { setError('Please fill in all fields'); return; }
    if (phone.replace(/\D/g, '').length !== 10) { setError('Enter a valid 10-digit phone number'); return; }

    setLoading(true);
    setError('');
    setSessionSelectionData(null);

    try {
      const deviceId = getDeviceId();
      const deviceInfo = getDeviceInfo();
      const location = await getUserPinpointLocation();

      const res = await authAPI.login({
        phone: `+91${phone.replace(/\D/g, '')}`,
        password,
        deviceId,
        deviceInfo,
        location,
      });

      login(res.data.user);
      navigate(roleHome(), { replace: true });
    } catch (err) {
      if (err.response?.status === 409 || err.response?.data?.requiresSessionSelection) {
        setSessionSelectionData({
          token: err.response.data.sessionSelectionToken,
          sessions: err.response.data.activeSessions || [],
        });
      } else {
        setError(err.response?.data?.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSessionSelectionSuccess = (userData) => {
    login(userData);
    navigate(roleHome(), { replace: true });
  };

  return (
    <div style={{
      height: '100vh', width: '100vw',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', overflow: 'hidden', position: 'relative',
      padding: '1rem',
    }}>
      {/* subtle background gradient */}
      <div style={{ position: 'absolute', inset: 0, background: 'var(--grad-soft)', pointerEvents: 'none' }} />

      {/* theme toggle — top right corner */}
      <button className="theme-btn" onClick={toggle} title="Toggle theme"
        style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', zIndex: 10 }}>
        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </button>

      {/* back to portfolio — top left */}
      <Link to="/" style={{
        position: 'absolute', top: '1.25rem', left: '1.25rem', zIndex: 10,
        display: 'flex', alignItems: 'center', gap: '.375rem',
        fontSize: '.78rem', color: 'var(--text-muted)', fontWeight: 500,
        textDecoration: 'none', transition: 'color .15s',
      }}
        onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
        onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        Portfolio
      </Link>

      {sessionSelectionData ? (
        <SessionSelectionScreen
          sessionSelectionToken={sessionSelectionData.token}
          activeSessions={sessionSelectionData.sessions}
          onSuccess={handleSessionSelectionSuccess}
          onCancel={() => setSessionSelectionData(null)}
        />
      ) : (
        /* card */
        <div style={{
          position: 'relative', zIndex: 1,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 20,
          padding: '2rem 2rem 1.625rem',
          width: '100%', maxWidth: 400,
          boxShadow: 'var(--shadow-lg)',
        }}>
          {/* logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '1.625rem' }}>
            <div className="sb-mark">
              <span className="sb-mark-text">SB</span>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '.95rem', lineHeight: 1.2 }}>
                ShivaKumar<span className="p-brand-accent">_B</span>
              </div>
              <div style={{ fontSize: '.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>Private Access</div>
            </div>
          </div>

          <div style={{ fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-.4px', marginBottom: '.25rem' }}>
            Welcome back
          </div>
          <div style={{ fontSize: '.82rem', color: 'var(--text-muted)', marginBottom: '1.375rem' }}>
            Sign in to your private dashboard (Max 3 Active Devices)
          </div>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#ef4444',
              padding: '10px 12px',
              borderRadius: 10,
              fontSize: '12px',
              marginBottom: '1.25rem',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Phone */}
            <div>
              <label style={{ display: 'block', fontSize: '.75rem', fontWeight: 600, color: 'var(--text-sec)', marginBottom: '.375rem' }}>
                Phone Number
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{
                  position: 'absolute', left: '12px', fontSize: '.84rem',
                  fontWeight: 600, color: 'var(--text-muted)'
                }}>+91</span>
                <input
                  type="tel"
                  placeholder="9876543210"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '.625rem .75rem .625rem 3rem',
                    fontSize: '.84rem',
                    borderRadius: 10,
                    border: '1px solid var(--border)',
                    background: 'var(--surface-alt)',
                    color: 'var(--text)',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.375rem' }}>
                <label style={{ fontSize: '.75rem', fontWeight: 600, color: 'var(--text-sec)' }}>
                  Password
                </label>
                <Link to="/forgot-password" style={{ fontSize: '.72rem', color: 'var(--primary)', fontWeight: 600 }}>
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '.625rem 2.5rem .625rem .75rem',
                    fontSize: '.84rem',
                    borderRadius: 10,
                    border: '1px solid var(--border)',
                    background: 'var(--surface-alt)',
                    color: 'var(--text)',
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  tabIndex={-1}
                  style={{
                    position: 'absolute', right: '10px',
                    background: 'transparent', border: 'none',
                    color: 'var(--text-muted)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: 4,
                  }}
                >
                  <IconEye open={showPwd} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '.5rem',
                padding: '.75rem',
                borderRadius: 10,
                border: 'none',
                background: 'var(--grad, linear-gradient(135deg, #2563eb, #7c3aed))',
                color: '#fff',
                fontSize: '.84rem',
                fontWeight: 700,
                cursor: loading ? 'default' : 'pointer',
                opacity: loading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '.5rem',
              }}
            >
              <IconLock />
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
