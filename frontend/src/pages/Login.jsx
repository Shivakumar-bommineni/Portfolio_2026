import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { roleHome } from '../components/RoleRoute';
import { useTheme } from '../context/ThemeContext';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone || !password) { setError('Please fill in all fields'); return; }
    if (phone.replace(/\D/g, '').length !== 10) { setError('Enter a valid 10-digit phone number'); return; }

    setLoading(true); setError('');
    try {
      const res = await authAPI.login({ phone: `+91${phone.replace(/\D/g, '')}`, password });
      login(res.data.user);
      navigate(roleHome(), { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      height: '100vh', width: '100vw',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', overflow: 'hidden', position: 'relative',
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

      {/* card */}
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
          Sign in to your private dashboard
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1rem', padding: '.625rem .875rem', fontSize: '.8rem' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '.875rem' }}>
            <label className="form-label">Mobile Number</label>
            <div className="phone-group">
              <div className="country-code">🇮🇳 +91</div>
              <input
                type="tel" className="form-input"
                placeholder="10-digit number"
                value={phone}
                onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '')); setError(''); }}
                maxLength={10} inputMode="numeric" autoComplete="tel"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.125rem' }}>
            <div style={{ marginBottom: '.3rem' }}>
              <label className="form-label" style={{ margin: 0 }}>Password</label>
            </div>
            <div className="input-wrapper">
              <span className="input-icon"><IconLock /></span>
              <input
                type={showPwd ? 'text' : 'password'} className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                autoComplete="current-password"
              />
              <button type="button" className="input-action" onClick={() => setShowPwd(!showPwd)} tabIndex={-1}>
                <IconEye open={showPwd} />
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}
            style={{ width: '100%', padding: '.7rem', fontSize: '.9rem' }}>
            {loading ? <><div className="spinner" /> Signing in…</> : 'Sign In →'}
          </button>
        </form>

        <div style={{
          display: 'flex', alignItems: 'center', gap: '.5rem',
          fontSize: '.72rem', color: 'var(--text-muted)',
          padding: '.625rem .875rem',
          background: 'var(--surface-alt)', borderRadius: 8, marginTop: '1.125rem',
        }}>
          <div className="badge-dot" />
          256-bit SSL · Cookie-Based JWT · Secure Access
        </div>
      </div>
    </div>
  );
}
