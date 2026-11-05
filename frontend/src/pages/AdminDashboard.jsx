import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';

const Badge = ({ active }) => (
  <span className={`chip ${active ? 'chip-green' : ''}`}
    style={!active ? { background: '#fee2e2', color: '#dc2626' } : {}}>
    {active ? 'Active' : 'Inactive'}
  </span>
);

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('stats');

  const handleLogout = async () => { await logout(); navigate('/login'); };

  const loadStats = useCallback(async () => {
    const res = await adminAPI.getStats();
    setStats(res.data.stats);
  }, []);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    const res = await adminAPI.getUsers({ search });
    setUsers(res.data.users);
    setLoading(false);
  }, [search]);

  useEffect(() => { loadStats(); }, [loadStats]);
  useEffect(() => { if (tab === 'users') loadUsers(); }, [tab, loadUsers]);

  const handleToggle = async (id) => {
    await adminAPI.toggleUser(id);
    loadUsers();
  };

  const initials = user?.fullName?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'A';

  return (
    <div className="dashboard-bg">
      <nav className="topbar">
        <div className="topbar-logo">
          <div className="logo-icon" style={{ width: 32, height: 32, borderRadius: 8 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
            </svg>
          </div>
          ShivaKumar<span style={{ color: 'var(--primary)' }}>_B</span>
          <span style={{ background: '#2563eb', color: 'white', fontSize: '.65rem', fontWeight: 700, padding: '.15rem .5rem', borderRadius: '100px', marginLeft: '.5rem' }}>
            ADMIN
          </span>
        </div>
        <div className="topbar-right">
          <div className="avatar">{initials}</div>
          <span className="topbar-name">{user?.fullName}</span>
          <button className="logout-btn" onClick={handleLogout}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      </nav>

      <div style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '0 2rem', display: 'flex' }}>
        {[{ key: 'stats', label: 'Overview' }, { key: 'users', label: 'Manage Users' }].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{
              padding: '.875rem 1.25rem', border: 'none', background: 'none',
              fontWeight: 600, fontSize: '.875rem', cursor: 'pointer',
              color: tab === t.key ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: tab === t.key ? '2.5px solid var(--primary)' : '2.5px solid transparent',
              fontFamily: 'inherit',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="dashboard-content">

        {tab === 'stats' && (
          <>
            <div className="welcome-banner">
              <h2>Welcome, {user?.fullName?.split(' ')[0]}!</h2>
              <p>Manage your assigned users from this panel.</p>
            </div>
            <div className="stats-grid">
              {stats ? (
                <>
                  <div className="stat-card">
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1, marginBottom: '.25rem' }}>{stats.totalUsers}</div>
                    <div style={{ fontWeight: 700, fontSize: '.9rem' }}>Total Users</div>
                  </div>
                  <div className="stat-card">
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--success)', lineHeight: 1, marginBottom: '.25rem' }}>{stats.activeUsers}</div>
                    <div style={{ fontWeight: 700, fontSize: '.9rem' }}>Active Users</div>
                  </div>
                  <div className="stat-card">
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: '#f59e0b', lineHeight: 1, marginBottom: '.25rem' }}>{stats.newUsersThisWeek}</div>
                    <div style={{ fontWeight: 700, fontSize: '.9rem' }}>New This Week</div>
                  </div>
                </>
              ) : (
                <div style={{ gridColumn: '1/-1', padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</div>
              )}
            </div>

            <div className="section-title">Account Info</div>
            <div className="info-card">
              <div className="info-row">
                <span className="info-key">Name</span>
                <span className="info-value">{user?.fullName}</span>
              </div>
              <div className="info-row">
                <span className="info-key">Phone</span>
                <span className="info-value">{user?.phone}</span>
              </div>
              <div className="info-row">
                <span className="info-key">Role</span>
                <span className="info-value"><span className="chip chip-blue">Admin</span></span>
              </div>
            </div>
          </>
        )}

        {tab === 'users' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', gap: '1rem' }}>
              <div className="section-title" style={{ margin: 0 }}>Users</div>
              <input className="form-input" style={{ paddingLeft: '1rem', maxWidth: '280px' }}
                placeholder="Search by name, phone, email…"
                value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="info-card">
              {loading ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</div>
              ) : users.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No users found.</div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.875rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)' }}>
                      {['Name', 'Phone', 'Email', 'Status', 'Joined', 'Action'].map((h) => (
                        <th key={h} style={{ padding: '.75rem 1rem', textAlign: 'left', fontWeight: 700, color: 'var(--text-muted)', fontSize: '.75rem', textTransform: 'uppercase', letterSpacing: '.05em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '.75rem 1rem', fontWeight: 600 }}>{u.fullName}</td>
                        <td style={{ padding: '.75rem 1rem', color: 'var(--text-muted)' }}>{u.phone}</td>
                        <td style={{ padding: '.75rem 1rem', color: 'var(--text-muted)' }}>{u.email || '—'}</td>
                        <td style={{ padding: '.75rem 1rem' }}><Badge active={u.isActive} /></td>
                        <td style={{ padding: '.75rem 1rem', color: 'var(--text-muted)' }}>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                        <td style={{ padding: '.75rem 1rem' }}>
                          <button onClick={() => handleToggle(u.id)}
                            style={{ padding: '.3rem .75rem', border: '1.5px solid var(--border)', borderRadius: '6px', background: 'white', cursor: 'pointer', fontSize: '.75rem', fontWeight: 600 }}>
                            {u.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
