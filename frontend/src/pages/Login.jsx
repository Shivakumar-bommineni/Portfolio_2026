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
    <div className="login-page-container">
      {/* Dynamic ambient floating glowing orbs */}
      <div className="login-orb login-orb-1" />
      <div className="login-orb login-orb-2" />
      <div style={{ position: 'absolute', inset: 0, background: 'var(--grad-soft)', pointerEvents: 'none', opacity: 0.6 }} />

      {/* theme toggle — top right corner */}
      <button className="theme-btn" onClick={toggle} title="Toggle theme"
        style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10 }}>
        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </button>

      {/* back to portfolio — top left */}
      <Link to="/" style={{
        position: 'absolute', top: '1.5rem', left: '1.5rem', zIndex: 10,
        display: 'flex', alignItems: 'center', gap: '.5rem',
        fontSize: '.82rem', color: 'var(--text-muted)', fontWeight: 600,
        textDecoration: 'none', transition: 'all .2s ease',
        background: 'var(--surface-alt)', padding: '.45rem .85rem',
        borderRadius: '10px', border: '1px solid var(--border)',
      }}
        onMouseOver={(e) => {
          e.currentTarget.style.color = 'var(--primary)';
          e.currentTarget.style.transform = 'translateX(-3px)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.color = 'var(--text-muted)';
          e.currentTarget.style.transform = 'translateX(0)';
        }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        Back to Portfolio
      </Link>

      {sessionSelectionData ? (
        <SessionSelectionScreen
          sessionSelectionToken={sessionSelectionData.token}
          activeSessions={sessionSelectionData.sessions}
          onSuccess={handleSessionSelectionSuccess}
          onCancel={() => setSessionSelectionData(null)}
        />
      ) : (
        /* modern card */
        <div className="modern-login-card">
          {/* Top badge & header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
              <div className="sb-mark" style={{ width: 38, height: 38, fontSize: '1rem' }}>
                <span className="sb-mark-text">SB</span>
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '.95rem', lineHeight: 1.2 }}>
                  ShivaKumar<span className="p-brand-accent">_B</span>
                </div>
                <div style={{ fontSize: '.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Private Workspace</div>
              </div>
            </div>

            {/* Active MDM Security Pill */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '.4rem',
              padding: '.25rem .6rem', borderRadius: '20px',
              background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)',
              fontSize: '.68rem', fontWeight: 700, color: '#10b981',
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%', background: '#10b981',
                animation: 'pulseGlow 2s infinite',
              }} />
              MDM Active (3 Devices)
            </div>
          </div>

          <div style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-.4px', marginBottom: '.35rem' }}>
            Owner Login
          </div>
          <div style={{ fontSize: '.84rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.45 }}>
            Access your secure developer dashboard and portfolio manager.
          </div>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              padding: '.75rem 1rem',
              borderRadius: 12,
              fontSize: '.82rem',
              fontWeight: 500,
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '.5rem',
              animation: 'slideInToast .25s ease-out',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            {/* Phone */}
            <div>
              <label style={{ display: 'block', fontSize: '.78rem', fontWeight: 700, color: 'var(--text-sec)', marginBottom: '.4rem' }}>
                Phone Number
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{
                  position: 'absolute', left: '12px', fontSize: '.88rem',
                  fontWeight: 700, color: 'var(--text-muted)'
                }}>+91</span>
                <input
                  className="modern-login-input"
                  type="tel"
                  placeholder="7991234567"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.4rem' }}>
                <label style={{ fontSize: '.78rem', fontWeight: 700, color: 'var(--text-sec)' }}>
                  Password
                </label>
                <Link to="/forgot-password" style={{ fontSize: '.75rem', color: 'var(--primary)', fontWeight: 600 }}>
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  className="modern-login-input"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  style={{ paddingRight: '2.75rem', paddingLeft: '1rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  tabIndex={-1}
                  style={{
                    position: 'absolute', right: '12px',
                    background: 'transparent', border: 'none',
                    color: 'var(--text-muted)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: 4, transition: 'color .15s',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = 'var(--text)'}
                  onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <IconEye open={showPwd} />
                </button>
              </div>
            </div>

            <button
              className="login-btn-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                  <span>Verifying Session...</span>
                </>
              ) : (
                <>
                  <IconLock />
                  <span>Sign In Securely</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
