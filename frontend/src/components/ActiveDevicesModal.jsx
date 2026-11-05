import { useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { Monitor, Smartphone, Laptop, MapPin, Globe, Clock, ShieldCheck, Trash2, X, RefreshCw } from 'lucide-react';

export default function ActiveDevicesModal({ onClose }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revokingId, setRevokingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadSessions = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await authAPI.getActiveSessions();
      if (res.data?.success) {
        setSessions(res.data.activeSessions || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load active device sessions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleRevoke = async (sessionId) => {
    setRevokingId(sessionId);
    setError('');
    setSuccess('');
    try {
      const res = await authAPI.revokeSession(sessionId);
      if (res.data?.success) {
        setSuccess('Device session revoked successfully.');
        setSessions((prev) => prev.filter((s) => s.sessionId !== sessionId));
      } else {
        setError(res.data?.message || 'Failed to revoke device session.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to revoke device session.');
    } finally {
      setRevokingId(null);
    }
  };

  const getDeviceIcon = (info = '') => {
    const lower = info.toLowerCase();
    if (lower.includes('android') || lower.includes('iphone') || lower.includes('mobile')) {
      return <Smartphone style={{ width: 22, height: 22 }} />;
    }
    if (lower.includes('mac') || lower.includes('laptop')) {
      return <Laptop style={{ width: 22, height: 22 }} />;
    }
    return <Monitor style={{ width: 22, height: 22 }} />;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Unknown';
    try {
      const d = new Date(dateStr);
      return d.toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{ zIndex: 1100, padding: '1rem' }}
    >
      <div
        className="modal"
        style={{
          maxWidth: '540px',
          width: '100%',
          maxHeight: '90vh',
          borderRadius: '20px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--surface)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.65rem' }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: 'rgba(16, 185, 129, 0.12)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck style={{ width: 22, height: 22 }} />
            </div>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)' }}>
                Active Devices & Login Locations
              </div>
              <div style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>
                MDM Security · Max 3 Authorized Devices
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '.4rem',
              borderRadius: 8,
            }}
          >
            <X style={{ width: 20, height: 20 }} />
          </button>
        </div>

        {/* Quota bar */}
        <div
          style={{
            background: 'var(--surface-alt)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '.75rem 1rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ fontSize: '.82rem', fontWeight: 600, color: 'var(--text)' }}>
            Active Sessions: <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{sessions.length}</span> / 3 Max
          </div>
          <button
            onClick={loadSessions}
            disabled={loading}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '.35rem',
              fontSize: '.75rem',
              fontWeight: 600,
            }}
          >
            <RefreshCw style={{ width: 14, height: 14, animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            Refresh
          </button>
        </div>

        {error && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#b91c1c',
              padding: '.65rem .85rem',
              borderRadius: 10,
              fontSize: '.8rem',
              marginBottom: '1rem',
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              color: '#047857',
              padding: '.65rem .85rem',
              borderRadius: 10,
              fontSize: '.8rem',
              marginBottom: '1rem',
            }}
          >
            {success}
          </div>
        )}

        {/* Device List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '.75rem', paddingRight: '.25rem' }}>
          {loading && sessions.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '.85rem' }}>
              Scanning active device sessions...
            </div>
          ) : sessions.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '.85rem' }}>
              No active devices found.
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.sessionId}
                style={{
                  background: session.isCurrent ? 'rgba(37, 99, 235, 0.04)' : 'var(--surface-alt)',
                  border: session.isCurrent ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                  borderRadius: '14px',
                  padding: '.9rem 1rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '.85rem', flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: session.isCurrent ? 'var(--primary-lt)' : 'var(--border)',
                      color: session.isCurrent ? 'var(--primary)' : 'var(--text-sec)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {getDeviceIcon(session.deviceInfo)}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', flexWrap: 'wrap', marginBottom: '.3rem' }}>
                      <span style={{ fontSize: '.86rem', fontWeight: 700, color: 'var(--text)' }}>
                        {session.deviceInfo}
                      </span>
                      {session.isCurrent && (
                        <span
                          style={{
                            fontSize: '.68rem',
                            fontWeight: 700,
                            padding: '.15rem .45rem',
                            borderRadius: '100px',
                            background: '#10b981',
                            color: '#fff',
                          }}
                        >
                          This Device
                        </span>
                      )}
                    </div>

                    {/* Location */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '.35rem',
                        fontSize: '.76rem',
                        color: 'var(--text-sec)',
                        marginBottom: '.25rem',
                      }}
                    >
                      <MapPin style={{ width: 13, height: 13, color: '#ef4444', flexShrink: 0 }} />
                      <span style={{ fontWeight: 600 }}>{session.location || 'Unknown Location'}</span>
                    </div>

                    {/* IP and Time Details */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '.75rem',
                        fontSize: '.72rem',
                        color: 'var(--text-muted)',
                        flexWrap: 'wrap',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '.25rem' }}>
                        <Globe style={{ width: 12, height: 12 }} />
                        {session.ipAddress}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '.25rem' }}>
                        <Clock style={{ width: 12, height: 12 }} />
                        Active {formatDate(session.lastActive)}
                      </span>
                    </div>
                  </div>
                </div>

                {!session.isCurrent && (
                  <button
                    onClick={() => handleRevoke(session.sessionId)}
                    disabled={revokingId === session.sessionId}
                    title="Revoke session and log out this device"
                    style={{
                      background: 'rgba(239, 68, 68, 0.08)',
                      color: '#ef4444',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      padding: '.45rem .75rem',
                      borderRadius: '8px',
                      fontSize: '.74rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '.35rem',
                      flexShrink: 0,
                    }}
                  >
                    <Trash2 style={{ width: 13, height: 13 }} />
                    {revokingId === session.sessionId ? 'Revoking...' : 'Revoke'}
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '.55rem 1.25rem', fontSize: '.84rem' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

