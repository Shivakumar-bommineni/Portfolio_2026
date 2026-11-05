import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { superAdminAPI } from '../services/api';

const TAB = { OVERVIEW: 'overview', ADMINS: 'admins', USERS: 'users', LOGS: 'logs' };

const Topbar = ({ user, onLogout }) => (
  <nav className="topbar">
    <div className="topbar-logo">
      <div className="logo-icon" style={{ width: 32, height: 32, borderRadius: 8 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
          <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
        </svg>
      </div>
      ShivaKumar<span style={{ color: '#7c3aed' }}>_B</span>
      <span style={{ background: '#7c3aed', color: 'white', fontSize: '.65rem', fontWeight: 700, padding: '.15rem .5rem', borderRadius: '100px', marginLeft: '.5rem' }}>
        SUPER ADMIN
      </span>
    </div>
    <div className="topbar-right">
      <div className="avatar" style={{ background: 'linear-gradient(135deg,#7c3aed,#5b21b6)' }}>
        {(user?.fullName || 'S').charAt(0).toUpperCase()}
      </div>
      <span className="topbar-name">{user?.fullName}</span>
      <button className="logout-btn" onClick={onLogout}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Logout
      </button>
    </div>
  </nav>
);

const StatCard = ({ label, value, sub, color }) => (
  <div className="stat-card">
    <div style={{ fontSize: '2rem', fontWeight: 900, color: color || 'var(--text)', lineHeight: 1, marginBottom: '.25rem' }}>{value}</div>
    <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '.9rem' }}>{label}</div>
    {sub && <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', marginTop: '.15rem' }}>{sub}</div>}
  </div>
);

const Badge = ({ active }) => (
  <span className={`chip ${active ? 'chip-green' : ''}`}
    style={!active ? { background: '#fee2e2', color: '#dc2626' } : {}}>
    {active ? 'Active' : 'Inactive'}
  </span>
);

export default function SuperAdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState(TAB.OVERVIEW);
  const [stats, setStats] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [createForm, setCreateForm] = useState({ phone: '', fullName: '', email: '' });
  const [createMsg, setCreateMsg] = useState(null);
  const [createLoading, setCreateLoading] = useState(false);

  const handleLogout = async () => { await logout(); navigate('/login'); };

  const loadStats = useCallback(async () => {
    const res = await superAdminAPI.getStats();
    setStats(res.data.stats);
  }, []);

  const loadAdmins = useCallback(async () => {
    setLoading(true);
    const res = await superAdminAPI.getAdmins();
    setAdmins(res.data.admins);
    setLoading(false);
  }, []);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    const res = await superAdminAPI.getUsers({ search });
    setUsers(res.data.users);
    setLoading(false);
  }, [search]);

  const loadLogs = useCallback(async () => {
    setLoading(true);
    const res = await superAdminAPI.getAuditLogs();
    setLogs(res.data.logs);
    setLoading(false);
  }, []);

  useEffect(() => { loadStats(); }, [loadStats]);
  useEffect(() => {
    if (tab === TAB.ADMINS) loadAdmins();
    if (tab === TAB.USERS) loadUsers();
    if (tab === TAB.LOGS) loadLogs();
  }, [tab, loadAdmins, loadUsers, loadLogs]);

  const handleToggleAdmin = async (id) => {
    await superAdminAPI.toggleAdmin(id);
    loadAdmins();
  };
  const handleDeleteAdmin = async (id, name) => {
    if (!window.confirm(`Delete admin "${name}"? This cannot be undone.`)) return;
    await superAdminAPI.deleteAdmin(id);
    loadAdmins();
  };
  const handleToggleUser = async (id) => {
    await superAdminAPI.toggleUser(id);
    loadUsers();
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setCreateLoading(true); setCreateMsg(null);
    try {
      const res = await superAdminAPI.createAdmin({ ...createForm, phone: `+91${createForm.phone.replace(/\D/g, '')}` });
      setCreateMsg({ type: 'success', text: `Admin created! Temp password: ${res.data.tempPassword}` });
      setCreateForm({ phone: '', fullName: '', email: '' });
      loadAdmins();
    } catch (err) {
      setCreateMsg({ type: 'error', text: err.response?.data?.message || 'Failed to create admin' });
    } finally { setCreateLoading(false); }
  };

  const tabs = [
    { key: TAB.OVERVIEW, label: 'Overview' },
    { key: TAB.ADMINS,   label: `Admins (${admins.length || '—'})` },
    { key: TAB.USERS,    label: 'Users' },
    { key: TAB.LOGS,     label: 'Audit Logs' },
  ];

  return (
    <div className="dashboard-bg">
      <Topbar user={user} onLogout={handleLogout} />

      {/* Tab Bar */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '0 2rem', display: 'flex', gap: '0' }}>
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{
              padding: '.875rem 1.25rem', border: 'none', background: 'none',
              fontWeight: 600, fontSize: '.875rem', cursor: 'pointer',
              color: tab === t.key ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: tab === t.key ? '2.5px solid var(--primary)' : '2.5px solid transparent',
              fontFamily: 'inherit', transition: 'all .2s',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="dashboard-content">

        {/* ── OVERVIEW ── */}
        {tab === TAB.OVERVIEW && (
          <>
            <div className="welcome-banner" style={{ background: 'linear-gradient(135deg,#4c1d95,#7c3aed)' }}>
              <h2>Super Admin Panel</h2>
              <p>Full control over all admins and users on the platform.</p>
            </div>
            <div className="stats-grid">
              {stats ? (
                <>
                  <StatCard label="Total Users"       value={stats.totalUsers}       sub="Registered accounts"         color="var(--primary)" />
                  <StatCard label="Total Admins"      value={stats.totalAdmins}      sub="Active admin accounts"       color="#7c3aed" />
                  <StatCard label="Active Users"      value={stats.activeUsers}      sub="Currently active"            color="var(--success)" />
                  <StatCard label="New This Week"     value={stats.newUsersThisWeek} sub="Registrations in 7 days"    color="#f59e0b" />
                </>
              ) : (
                <div style={{ gridColumn: '1/-1', padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading stats…</div>
              )}
            </div>
          </>
        )}

        {/* ── ADMINS ── */}
        {tab === TAB.ADMINS && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div className="section-title" style={{ margin: 0 }}>Admin Accounts</div>
              <button className="btn btn-primary" style={{ width: 'auto', padding: '.625rem 1.25rem', fontSize: '.875rem' }}
                onClick={() => setShowCreateAdmin(!showCreateAdmin)}>
                + Create Admin
              </button>
            </div>

            {showCreateAdmin && (
              <div className="info-card" style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '.9rem' }}>Create New Admin</div>
                {createMsg && (
                  <div className={`alert ${createMsg.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: '.875rem' }}>
                    {createMsg.text}
                  </div>
                )}
                <form onSubmit={handleCreateAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input className="form-input" style={{ paddingLeft: '1rem' }} placeholder="Admin full name"
                        value={createForm.fullName} onChange={(e) => setCreateForm(p => ({ ...p, fullName: e.target.value }))} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone *</label>
                      <div className="phone-group">
                        <div className="country-code">🇮🇳 +91</div>
                        <input type="tel" className="form-input" placeholder="10-digit number" inputMode="numeric"
                          value={createForm.phone} onChange={(e) => setCreateForm(p => ({ ...p, phone: e.target.value.replace(/\D/g, '') }))}
                          maxLength={10} required />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email (optional)</label>
                      <input type="email" className="form-input" style={{ paddingLeft: '1rem' }} placeholder="admin@email.com"
                        value={createForm.email} onChange={(e) => setCreateForm(p => ({ ...p, email: e.target.value }))} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '.75rem' }}>
                    <button type="submit" className="btn btn-primary" style={{ width: 'auto', padding: '.625rem 1.5rem', fontSize: '.875rem' }} disabled={createLoading}>
                      {createLoading ? <><div className="spinner" /> Creating…</> : 'Create Admin'}
                    </button>
                    <button type="button" className="btn" style={{ width: 'auto', padding: '.625rem 1rem', fontSize: '.875rem', background: 'var(--bg)', border: '1.5px solid var(--border)', color: 'var(--text-muted)' }}
                      onClick={() => { setShowCreateAdmin(false); setCreateMsg(null); }}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="info-card">
              {loading ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</div>
              ) : admins.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No admins yet. Create one above.</div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.875rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)' }}>
                      {['Name', 'Phone', 'Email', 'Status', 'Created', 'Actions'].map((h) => (
                        <th key={h} style={{ padding: '.75rem 1rem', textAlign: 'left', fontWeight: 700, color: 'var(--text-muted)', fontSize: '.75rem', textTransform: 'uppercase', letterSpacing: '.05em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((a) => (
                      <tr key={a.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '.75rem 1rem', fontWeight: 600 }}>{a.fullName}</td>
                        <td style={{ padding: '.75rem 1rem', color: 'var(--text-muted)' }}>{a.phone}</td>
                        <td style={{ padding: '.75rem 1rem', color: 'var(--text-muted)' }}>{a.email || '—'}</td>
                        <td style={{ padding: '.75rem 1rem' }}><Badge active={a.isActive} /></td>
                        <td style={{ padding: '.75rem 1rem', color: 'var(--text-muted)' }}>{new Date(a.createdAt).toLocaleDateString('en-IN')}</td>
                        <td style={{ padding: '.75rem 1rem' }}>
                          <div style={{ display: 'flex', gap: '.5rem' }}>
                            <button onClick={() => handleToggleAdmin(a.id)} style={{ padding: '.3rem .75rem', border: '1.5px solid var(--border)', borderRadius: '6px', background: 'white', cursor: 'pointer', fontSize: '.75rem', fontWeight: 600 }}>
                              {a.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button onClick={() => handleDeleteAdmin(a.id, a.fullName)} style={{ padding: '.3rem .75rem', border: '1.5px solid #fecaca', borderRadius: '6px', background: '#fff5f5', color: '#dc2626', cursor: 'pointer', fontSize: '.75rem', fontWeight: 600 }}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* ── USERS ── */}
        {tab === TAB.USERS && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', gap: '1rem' }}>
              <div className="section-title" style={{ margin: 0 }}>All Users</div>
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
                      {['Name', 'Phone', 'Email', 'Verified', 'Status', 'Joined', 'Action'].map((h) => (
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
                        <td style={{ padding: '.75rem 1rem' }}><Badge active={u.isPhoneVerified} /></td>
                        <td style={{ padding: '.75rem 1rem' }}><Badge active={u.isActive} /></td>
                        <td style={{ padding: '.75rem 1rem', color: 'var(--text-muted)' }}>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                        <td style={{ padding: '.75rem 1rem' }}>
                          <button onClick={() => handleToggleUser(u.id)} style={{ padding: '.3rem .75rem', border: '1.5px solid var(--border)', borderRadius: '6px', background: 'white', cursor: 'pointer', fontSize: '.75rem', fontWeight: 600 }}>
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

        {/* ── AUDIT LOGS ── */}
        {tab === TAB.LOGS && (
          <>
            <div className="section-title">Audit Logs</div>
            <div className="info-card">
              {loading ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</div>
              ) : logs.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No logs yet.</div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.875rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)' }}>
                      {['Action', 'Performed By', 'Role', 'When'].map((h) => (
                        <th key={h} style={{ padding: '.75rem 1rem', textAlign: 'left', fontWeight: 700, color: 'var(--text-muted)', fontSize: '.75rem', textTransform: 'uppercase', letterSpacing: '.05em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((l) => (
                      <tr key={l.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '.75rem 1rem' }}>
                          <span style={{ background: '#eff6ff', color: 'var(--primary)', padding: '.2rem .5rem', borderRadius: '6px', fontSize: '.75rem', fontWeight: 700 }}>
                            {l.action}
                          </span>
                        </td>
                        <td style={{ padding: '.75rem 1rem', fontWeight: 600 }}>{l.actor_name || '—'}</td>
                        <td style={{ padding: '.75rem 1rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{l.actor_role || '—'}</td>
                        <td style={{ padding: '.75rem 1rem', color: 'var(--text-muted)' }}>
                          {new Date(l.created_at).toLocaleString('en-IN')}
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
