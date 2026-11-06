import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { notesAPI, interviewAPI, portfolioAPI, authAPI } from '../services/api';
import NotificationDropdown from '../components/NotificationDropdown';
import ActiveDevicesModal from '../components/ActiveDevicesModal';

/* ── Icons ── */
const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 01-3.46 0"></path>
  </svg>
);
const SunIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
  </svg>
);
const MoonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
  </svg>
);

const NAV_ITEMS = [
  {
    key: 'home', to: '/dashboard', label: 'Dashboard',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    key: 'notes', to: '/notes', label: 'Notes',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
  {
    key: 'interview', to: '/interview', label: 'Interview Prep',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
  {
    key: 'resume', to: '/resume', label: 'Resume Builder',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>
      </svg>
    ),
  },
  {
    key: 'portfolio-editor', to: '/portfolio-editor', label: 'Edit Portfolio',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    ),
  },
  {
    key: 'learning', to: '/learning', label: 'Learning Tracker',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
      </svg>
    ),
  },
  {
    key: 'todos', to: '/todos', label: 'Todo Board',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
      </svg>
    ),
  },
  {
    key: 'bookmarks', to: '/bookmarks', label: 'Bookmarks',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
      </svg>
    ),
  },
  {
    key: 'projects', to: '/projects', label: 'Projects',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
      </svg>
    ),
  },
  {
    key: 'notifications', to: '/notifications', label: 'Notifications',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 01-3.46 0"></path>
      </svg>
    ),
  },
];

const DEV_LINKS = [
  { label: 'GitHub', url: 'https://github.com/shivakumar-bommineni-git/', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.05-.02-2.06-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 013-.4c1.02.005 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.9-.01 3.29 0 .32.21.7.82.58C20.56 21.79 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg> },
  { label: 'MDN Docs', url: 'https://developer.mozilla.org', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg> },
  { label: 'DevDocs', url: 'https://devdocs.io', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
];

export function DashSidebar({ active, onOpenDevices }) {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const initials = user?.fullName?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'SB';

  const handleLogout = async () => {
    setMobileOpen(false);
    await logout();
    navigate('/', { replace: true });
  };

  const handleNav = (to) => {
    setMobileOpen(false);
    navigate(to);
  };

  return (
    <>
      {/* Mobile Floating Menu Button (visible only on <= 900px) */}
      <div style={{ position: 'fixed', top: '12px', left: '12px', zIndex: 85 }}>
        <button
          className="dash-mobile-toggle-btn"
          onClick={() => setMobileOpen(true)}
          aria-label="Open Workspace Menu"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
          <span>Menu</span>
        </button>
      </div>

      {/* Backdrop overlay for mobile drawer */}
      {mobileOpen && (
        <div
          className="dash-sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* The Sidebar Container */}
      <div className={`dash-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Mobile drawer header with close button */}
        <div className="dash-sidebar-mobile-header">
          <span style={{ fontSize: '.88rem', fontWeight: 800, color: 'var(--text)' }}>
            Workspace Menu
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '.25rem',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Identity — single unified header */}
        <div className="dash-profile" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', height: 'auto', padding: '1.25rem 1.5rem', gap: '.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', width: '100%' }}>
            <div className="sb-mark" style={{ width: 36, height: 36, borderRadius: 10, fontSize: '.9rem', flexShrink: 0, background: 'var(--grad)', boxShadow: '0 4px 12px rgba(37,99,235,0.25)' }}>SB</div>
            <div className="dash-profile-info" style={{ flex: 1, minWidth: 0 }}>
              <div className="dash-profile-name" style={{ fontSize: '.95rem', fontWeight: 800 }}>
                ShivaKumar<span className="p-brand-accent">_B</span>
              </div>
              <div className="dash-profile-role" style={{ color: 'var(--text-muted)', fontSize: '.72rem', fontWeight: 600 }}>
                Developer Workspace
              </div>
            </div>
          </div>

          {/* MDM Protected Live Pill */}
          <div
            className="glass-pill glass-pill-success"
            style={{ fontSize: '.68rem', padding: '.2rem .6rem', cursor: onOpenDevices ? 'pointer' : 'default' }}
            onClick={() => {
              if (onOpenDevices) {
                setMobileOpen(false);
                onOpenDevices();
              }
            }}
            title="Click to view active devices & login locations"
          >
            <span className="pulse-dot" style={{ background: '#10b981' }} />
            <span>MDM Active · Max 3 Devices</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="dash-nav">
          <div className="dash-nav-label">Main Menu</div>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`dash-nav-item ${active === item.key ? 'active' : ''}`}
              onClick={() => handleNav(item.to)}
            >
              <span className="dash-nav-icon">{item.icon}</span>
              <span className="dash-nav-text">{item.label}</span>
              {active === item.key && <span className="dash-nav-pip" />}
            </button>
          ))}

          <div className="dash-nav-label" style={{ marginTop: '.5rem' }}>Quick Links</div>
          {DEV_LINKS.map((r) => (
            <a
              key={r.label}
              href={r.url}
              target="_blank"
              rel="noreferrer"
              className="dash-nav-item"
              style={{ textDecoration: 'none' }}
              onClick={() => setMobileOpen(false)}
            >
              <span className="dash-nav-icon">{r.icon}</span>
              <span className="dash-nav-text">{r.label}</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: 'auto', opacity: .4 }}>
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
          ))}
        </nav>

        {/* Footer pinned */}
        <div className="dash-sidebar-footer">
          <button className="dash-nav-item" onClick={toggle}>
            <span className="dash-nav-icon">{theme === 'dark' ? <SunIcon /> : <MoonIcon />}</span>
            <span className="dash-nav-text">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <Link
            to="/"
            className="dash-nav-item"
            style={{ textDecoration: 'none' }}
            onClick={() => setMobileOpen(false)}
          >
            <span className="dash-nav-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </span>
            <span className="dash-nav-text">View Portfolio</span>
          </Link>
          <button className="dash-nav-item dash-signout" onClick={handleLogout}>
            <span className="dash-nav-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </span>
            <span className="dash-nav-text">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
}

/* ── Quick Action Card ── */
function ActionCard({ icon, gradient, title, desc, to, onClick }) {
  const navigate = useNavigate();
  return (
    <div className="action-card" onClick={() => onClick ? onClick() : navigate(to)}>
      <div className="action-card-icon" style={{ background: gradient }}>{icon}</div>
      <div className="action-card-body">
        <div className="action-card-title">{title}</div>
        <div className="action-card-desc">{desc}</div>
      </div>
      <div className="action-card-arrow">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </div>
    </div>
  );
}

/* ── Stat Card ── */
function StatCard({ num, label, sub, color, icon, onClick }) {
  return (
    <div className="stat-card-v2" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default', padding: '1.5rem', background: '#fff', borderRadius: '16px', border: '1px solid var(--border)', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
      {/* Background Blob */}
      <div style={{ position: 'absolute', right: '-15%', top: 0, bottom: 0, width: '60%', background: `radial-gradient(ellipse at right center, ${color}30 0%, transparent 70%)` }} />
      
      {/* Icon */}
      <div style={{ position: 'absolute', right: '1.25rem', top: '1.5rem', width: 42, height: 42, borderRadius: '50%', border: `1.5px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
        {icon}
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, paddingBottom: '1.25rem' }}>
        <div style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1, color: 'var(--text)', marginBottom: '1rem' }}>{num}</div>
        <div style={{ fontSize: '.9rem', fontWeight: 800, color: 'var(--text-sec)' }}>{label}</div>
        <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '.25rem' }}>{sub}</div>
      </div>

      {/* Accent Line */}
      <div style={{ position: 'absolute', left: '1.5rem', bottom: '1.25rem', height: 3, width: 36, background: color, borderRadius: 2 }} />

      {/* Arrow Bottom Right */}
      {onClick && (
        <div style={{ position: 'absolute', right: '1.25rem', bottom: '1.25rem', width: 28, height: 28, borderRadius: '50%', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color, transition: 'transform .2s' }} className="stat-arrow">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="19" x2="19" y2="5"/><polyline points="9 5 19 5 19 15"/></svg>
        </div>
      )}
    </div>
  );
}

function ChangePasswordModal({ onClose }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword) {
      setError('Please enter your current password.');
      return;
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }
    const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;
    if (!pwdRegex.test(newPassword)) {
      setError('New password must include uppercase, lowercase, number, and special character (@$!%*?&).');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    if (currentPassword === newPassword) {
      setError('New password must be different from current password.');
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.changePassword({ currentPassword, newPassword });
      setSuccess(res.data?.message || 'Password changed successfully!');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()} style={{ zIndex: 1000 }}>
      <div className="modal" style={{ maxWidth: 440, borderRadius: 20, padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--primary-lt)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)' }}>Change Password</div>
              <div style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>Secure your developer workspace</div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '.4rem', borderRadius: 8 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '.75rem .9rem', borderRadius: 10, fontSize: '.82rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', padding: '.75rem .9rem', borderRadius: 10, fontSize: '.82rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ flexShrink: 0 }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '.78rem', fontWeight: 700, color: 'var(--text)', marginBottom: '.35rem' }}>Current Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showCurrent ? 'text' : 'password'}
                className="input"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                style={{ width: '100%', paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                style={{ position: 'absolute', right: '.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
              >
                {showCurrent ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '.78rem', fontWeight: 700, color: 'var(--text)', marginBottom: '.35rem' }}>New Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showNew ? 'text' : 'password'}
                className="input"
                placeholder="At least 8 chars (A-Z, a-z, 0-9, symbol)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                style={{ width: '100%', paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                style={{ position: 'absolute', right: '.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
              >
                {showNew ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '.78rem', fontWeight: 700, color: 'var(--text)', marginBottom: '.35rem' }}>Confirm New Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirm ? 'text' : 'password'}
                className="input"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{ width: '100%', paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                style={{ position: 'absolute', right: '.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
              >
                {showConfirm ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
          </div>

          <div style={{ fontSize: '.72rem', color: 'var(--text-muted)', background: 'var(--surface-alt)', padding: '.6rem .75rem', borderRadius: 8, lineHeight: 1.5 }}>
            Must contain at least 8 characters with 1 uppercase, 1 lowercase, 1 digit, and 1 special symbol (@$!%*?&).
          </div>

          <div style={{ display: 'flex', gap: '.6rem', marginTop: '.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn btn-secondary"
              style={{ flex: 1, padding: '.65rem' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ flex: 1.5, padding: '.65rem', fontWeight: 700 }}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ notes: 0, mastered: 0, total_iq: 0, projects: 0 });
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDevices, setShowDevices] = useState(false);
  const profileRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    if (showProfile) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [showProfile]);

  useEffect(() => {
    const load = async () => {
      try {
        const [nr, ir, pr] = await Promise.all([notesAPI.getAll(), interviewAPI.getAll(), portfolioAPI.get()]);
        const notes = nr.data.notes || [];
        const iq = ir.data.questions || [];
        const projects = pr.data.config?.projects || pr.data.portfolio?.projects || [];
        setStats({ notes: notes.length, total_iq: iq.length, mastered: iq.filter((q) => q.is_mastered).length, projects: projects.length });
      } catch { /* silently fail */ }
    };
    load();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  
  // Format display name and initials (replaces generic 'Super' with 'Shivakumar' or user's real name)
  const isSuper = user?.fullName && user.fullName.toLowerCase().includes('super');
  const displayName = isSuper ? 'Shivakumar' : (user?.fullName?.split(' ')[0] || 'Shivakumar');
  const avatarInitials = isSuper ? 'SB' : (user?.fullName?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'SB');
  const masteredPct = stats.total_iq > 0 ? Math.round((stats.mastered / stats.total_iq) * 100) : 0;

  const techStack = [
    { label: 'React', color: '#61dafb', bg: 'rgba(97,218,251,.12)' },
    { label: 'Node.js', color: '#68a063', bg: 'rgba(104,160,99,.12)' },
    { label: 'Next.js', color: 'var(--text)', bg: 'var(--surface-alt)' },
    { label: 'PostgreSQL', color: '#336791', bg: 'rgba(51,103,145,.12)' },
    { label: 'TypeScript', color: '#3178c6', bg: 'rgba(49,120,198,.12)' },
    { label: 'Express', color: 'var(--text-sec)', bg: 'var(--surface-alt)' },
    { label: 'Docker', color: '#2496ed', bg: 'rgba(36,150,237,.12)' },
    { label: 'Tailwind', color: '#38bdf8', bg: 'rgba(56,189,248,.12)' },
  ];

  const devResources = [
    { label: 'React Docs', url: 'https://react.dev', icon: '⚛️', color: '#61dafb' },
    { label: 'Node.js Docs', url: 'https://nodejs.org/docs', icon: '🟢', color: '#68a063' },
    { label: 'Next.js Docs', url: 'https://nextjs.org/docs', icon: '▲', color: '#888' },
    { label: 'PostgreSQL', url: 'https://www.postgresql.org/docs', icon: '🐘', color: '#336791' },
    { label: 'MDN Web Docs', url: 'https://developer.mozilla.org', icon: '📚', color: '#ff6900' },
    { label: 'DevDocs.io', url: 'https://devdocs.io', icon: '🔍', color: '#3d9dff' },
  ];

  return (
    <div className="dash-layout">
      <DashSidebar active="home" onOpenDevices={() => setShowDevices(true)} />
      <div className="dash-main">
        {/* Top bar */}
        <header className="dash-topbar" style={{ padding: '0 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', fontSize: '.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              <span style={{ cursor: 'pointer' }}>Workspace</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
              <span style={{ color: 'var(--text)', fontWeight: 700 }}>Dashboard</span>
            </div>

            {/* Cloud & Database Live Badge */}
            <div className="glass-pill glass-pill-primary" style={{ display: 'none', md: 'inline-flex' }}>
              <span className="pulse-dot" style={{ background: '#3b82f6' }} />
              <span>Neon DB · Live</span>
            </div>
          </div>

          <div className="dash-topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', position: 'relative' }}>
            
            {/* Direct Link to Live Portfolio */}
            <Link to="/" target="_blank" rel="noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: '.4rem',
              fontSize: '.78rem', fontWeight: 700, color: 'var(--text-sec)',
              padding: '.35rem .75rem', borderRadius: 8,
              background: 'var(--surface-alt)', border: '1px solid var(--border)',
              textDecoration: 'none', transition: 'all .15s',
            }}
              onMouseOver={(e) => { e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
              onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-sec)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
              <span>Public Portfolio</span>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </Link>

            {/* Notification Bell */}
            <NotificationDropdown />

            {/* Theme Toggle */}
            <div onClick={toggle} style={{ cursor: 'pointer', color: 'var(--text-sec)', padding: '.25rem' }}>
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </div>

            {/* User Pill */}
            <div ref={profileRef} style={{ position: 'relative' }}>
              <div 
                onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '.625rem',
                  background: showProfile ? 'var(--surface-alt)' : 'transparent', 
                  border: showProfile ? '1px solid var(--primary)' : '1px solid var(--border)',
                  borderRadius: 100, padding: '.25rem .875rem .25rem .25rem',
                  cursor: 'pointer', marginLeft: '.25rem',
                  backgroundColor: 'var(--surface)', transition: 'all .2s'
                }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', background: 'var(--grad)',
                  color: '#fff', fontSize: '.8rem', fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {avatarInitials}
                </div>
                <span style={{ fontSize: '.85rem', fontWeight: 700, color: 'var(--text)' }}>
                  {displayName}
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" style={{ transform: showProfile ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}><polyline points="6 9 12 15 18 9"/></svg>
              </div>

              {/* Profile Popover */}
              {showProfile && (
                <div style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: '1rem',
                  width: 300, background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 18, boxShadow: '0 20px 50px rgba(0,0,0,0.12)',
                  zIndex: 100, padding: '1.25rem',
                  animation: 'fadeInMenu .2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                }}>
                  {/* User Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--grad)', color: '#fff', fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(37,99,235,0.25)' }}>
                      {avatarInitials}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontWeight: 800, color: 'var(--text)', fontSize: '.95rem', marginBottom: '.15rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {user?.fullName || 'Shivakumar Bommineni'}
                      </div>
                      <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '.35rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        <span>{user?.email || 'shiv.b@hyd.chrpindia.com'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Active Security Summary Card */}
                  <div style={{
                    background: 'var(--surface-alt)',
                    borderRadius: 12,
                    padding: '.75rem .9rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '.35rem',
                    fontSize: '.75rem',
                    border: '1px solid var(--border)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Status</span>
                      <span style={{ fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '.3rem' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
                        MDM Protected
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Concurrency</span>
                      <span style={{ fontWeight: 700, color: 'var(--text)' }}>3 Devices Allowed</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                    <button 
                      onClick={() => { setShowProfile(false); setShowDevices(true); }}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem', padding: '.65rem', background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', fontSize: '.84rem', fontWeight: 600, cursor: 'pointer', transition: 'all .15s' }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                      Active Devices & Locations
                    </button>
                    <button 
                      onClick={() => { setShowProfile(false); setShowChangePassword(true); }}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem', padding: '.65rem', background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', fontSize: '.84rem', fontWeight: 600, cursor: 'pointer', transition: 'all .15s' }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      Change Password
                    </button>
                    <div style={{ display: 'flex', gap: '.5rem' }}>
                      <button 
                        onClick={() => { setShowProfile(false); navigate('/portfolio-editor'); }}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.4rem', padding: '.65rem', background: 'transparent', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-sec)', fontSize: '.84rem', fontWeight: 600, cursor: 'pointer', transition: 'all .15s' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                        Settings
                      </button>
                      <button onClick={async () => { await logout(); navigate('/', { replace: true }); }} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.4rem', padding: '.65rem', background: '#ef4444', border: 'none', borderRadius: 10, color: '#fff', fontSize: '.84rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)' }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        <div className="dash-content">

          {/* Welcome Banner */}
          <div className="dash-welcome-banner">
            <div className="dash-welcome-bg" />
            <div className="dash-welcome-content">
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '.8rem', fontWeight: 600, opacity: .7, marginBottom: '.375rem' }}>
                  {greeting} 👋
                </div>
                <div style={{ fontSize: '1.7rem', fontWeight: 900, letterSpacing: '-.5px', lineHeight: 1.2, marginBottom: '.5rem' }}>
                  Welcome back, <br />{displayName}!
                </div>
                <div style={{ fontSize: '.875rem', opacity: .75, maxWidth: 360, lineHeight: 1.6 }}>
                  Your personal developer workspace — notes, prep, portfolio, all in one place.
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
                  <button onClick={() => navigate('/portfolio-editor')} style={{
                    padding: '.55rem 1.1rem', borderRadius: 10,
                    background: '#fff', color: '#4f46e5',
                    fontSize: '.82rem', fontWeight: 800, border: 'none',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '.4rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'transform .15s',
                  }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Edit Portfolio
                  </button>
                  <button onClick={() => navigate('/notes')} style={{
                    padding: '.55rem 1.1rem', borderRadius: 10,
                    background: 'rgba(255,255,255,0.18)', color: '#fff',
                    fontSize: '.82rem', fontWeight: 700, border: '1px solid rgba(255,255,255,0.3)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '.4rem',
                    backdropFilter: 'blur(8px)',
                  }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Quick Note
                  </button>
                </div>
              </div>
              <div className="dash-welcome-avatar">{avatarInitials}</div>
            </div>
          </div>

          {/* Stats */}
          <div className="stats-row-v2" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
            <StatCard
              num={stats.projects || 0}
              label="Total Projects"
              sub="Live in your portfolio"
              color="#10b981"
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>}
              onClick={() => navigate('/portfolio-editor')}
            />
            <StatCard
              num={stats.notes || 0}
              label="Saved Notes"
              sub="Personal snippets & ideas"
              color="#3b82f6"
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
              onClick={() => navigate('/notes')}
            />
            <StatCard
              num={stats.total_iq || 0}
              label="Interview Q&A"
              sub="Questions in your bank"
              color="#f59e0b"
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>}
              onClick={() => navigate('/interview')}
            />
            <StatCard
              num={stats.mastered || 0}
              label="Mastered Modules"
              sub={`${masteredPct}% completion rate`}
              color="#8b5cf6"
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
              onClick={() => navigate('/interview')}
            />
          </div>

          {/* Mastered progress bar */}
          {stats.total_iq > 0 && (
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', padding: '1rem 1.25rem', marginBottom: '1.75rem',
              display: 'flex', alignItems: 'center', gap: '1rem',
            }}>
              <div style={{ fontSize: '.8rem', fontWeight: 700, color: 'var(--text-sec)', minWidth: 120 }}>
                Interview Progress
              </div>
              <div style={{ flex: 1, height: 8, background: 'var(--surface-alt)', borderRadius: 100, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${masteredPct}%`, background: 'linear-gradient(90deg,#10b981,#34d399)', borderRadius: 100, transition: 'width .6s ease' }} />
              </div>
              <div style={{ fontSize: '.82rem', fontWeight: 800, color: 'var(--success)', minWidth: 40, textAlign: 'right' }}>
                {masteredPct}%
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div style={{ marginBottom: '1.125rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontWeight: 800, fontSize: '.875rem' }}>Quick Actions</div>
            <span style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>Your workspace tools</span>
          </div>
          <div className="actions-grid">
            <ActionCard
              gradient="linear-gradient(135deg,#3b82f6,#2563eb)"
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>}
              title="Write a Note"
              desc="Capture ideas, code snippets, and thoughts"
              to="/notes"
            />
            <ActionCard
              gradient="linear-gradient(135deg,#8b5cf6,#7c3aed)"
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
              title="Interview Prep"
              desc="Practice Q&A by category and difficulty"
              to="/interview"
            />
            <ActionCard
              gradient="linear-gradient(135deg,#f59e0b,#d97706)"
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
              title="Build Resume"
              desc="Create and print your professional resume"
              to="/resume"
            />
            <ActionCard
              gradient="linear-gradient(135deg,#10b981,#059669)"
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>}
              title="Edit Portfolio"
              desc="Update your public portfolio content & colors"
              to="/portfolio-editor"
            />
          </div>

          {/* Tech Stack */}
          <div style={{ marginTop: '2rem', marginBottom: '1.125rem', fontWeight: 800, fontSize: '.875rem' }}>Tech Stack</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.625rem', marginBottom: '2rem' }}>
            {techStack.map((t) => (
              <div key={t.label} style={{
                display: 'flex', alignItems: 'center', gap: '.4rem',
                padding: '.35rem .875rem', borderRadius: 100,
                background: t.bg, border: `1px solid ${t.color}30`,
                fontSize: '.8rem', fontWeight: 700, color: t.color,
              }}>
                {t.label}
              </div>
            ))}
          </div>

          {/* Dev Resources */}
          <div style={{ marginBottom: '1.125rem', fontWeight: 800, fontSize: '.875rem' }}>Developer Resources</div>
          <div className="dev-resources-grid">
            {devResources.map((r) => (
              <a key={r.label} href={r.url} target="_blank" rel="noreferrer" className="dev-resource-card">
                <div className="dev-resource-icon">{r.icon}</div>
                <span className="dev-resource-label">{r.label}</span>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="dev-resource-arrow">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </a>
            ))}
          </div>

          {/* Footer note */}
          <div style={{
            marginTop: '2.5rem', padding: '1rem 1.5rem',
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: '1rem',
          }}>
            <div className="badge-dot" style={{ width: 8, height: 8 }} />
            <span style={{ fontSize: '.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Portfolio is live and publicly accessible · All tools are private and secure
            </span>
          </div>
        </div>
      </div>

      {showDevices && (
        <ActiveDevicesModal onClose={() => setShowDevices(false)} />
      )}

      {showChangePassword && (
        <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
      )}
    </div>
  );
}
