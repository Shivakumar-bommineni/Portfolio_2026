import { useState, useEffect } from 'react';
import { Laptop, Smartphone, Monitor, ShieldAlert, ArrowLeft, Clock, MapPin, Globe } from 'lucide-react';
import { authAPI } from '../services/api';
import { getDeviceId, getDeviceInfo, getUserPinpointLocation } from '../utils/device';

export default function SessionSelectionScreen({
  sessionSelectionToken,
  activeSessions = [],
  onSuccess,
  onCancel,
}) {
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes (300s)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onCancel) onCancel();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onCancel]);

  const formatSeconds = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSelectSession = async (session) => {
    setLoadingId(session.sessionId);
    setError('');
    try {
      const deviceId = getDeviceId();
      const deviceInfo = getDeviceInfo();
      const location = await getUserPinpointLocation();

      const res = await authAPI.forceLogoutAndLogin({
        sessionSelectionToken,
        sessionIdToRevoke: session.sessionId,
        deviceId,
        deviceInfo,
        location,
      });

      if (res.data?.success && res.data?.user) {
        onSuccess(res.data.user);
      } else {
        setError(res.data?.message || 'Failed to replace device session');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Session replacement timed out or failed. Please try again.');
    } finally {
      setLoadingId(null);
    }
  };

  const getDeviceIcon = (info = '') => {
    const lower = info.toLowerCase();
    if (lower.includes('android') || lower.includes('iphone')) {
      return <Smartphone style={{ width: 22, height: 22 }} />;
    }
    if (lower.includes('mac') || lower.includes('laptop')) {
      return <Laptop style={{ width: 22, height: 22 }} />;
    }
    return <Monitor style={{ width: 22, height: 22 }} />;
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '460px',
        background: 'var(--surface, #ffffff)',
        border: '1px solid var(--border, #e2e8f0)',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: 'var(--shadow-lg, 0 20px 40px rgba(0,0,0,0.1))',
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
        <div
          style={{
            padding: '8px',
            borderRadius: '10px',
            background: 'rgba(245, 158, 11, 0.12)',
            color: '#f59e0b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ShieldAlert style={{ width: 22, height: 22 }} />
        </div>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text, #0f172a)' }}>
            Active Session Limit Reached
          </h2>
          <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 600 }}>
            3 of 3 Active Devices
          </span>
        </div>
      </div>

      <p style={{ fontSize: '13px', color: 'var(--text-sec, #475569)', lineHeight: 1.5, margin: '0 0 1rem' }}>
        Your account has reached the maximum concurrency limit of <strong>3 active devices</strong>. To log in on this browser, select an active session below to terminate and replace.
      </p>

      {/* Countdown timer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--surface-alt, #f1f5f9)',
          padding: '8px 12px',
          borderRadius: '10px',
          fontSize: '12px',
          color: 'var(--text-sec, #475569)',
          marginBottom: '1.25rem',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock style={{ width: 14, height: 14 }} /> Selection expires in:
        </span>
        <strong style={{ color: timeLeft < 60 ? '#ef4444' : 'var(--primary, #2563eb)' }}>
          {formatSeconds(timeLeft)}
        </strong>
      </div>

      {error && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#ef4444',
            padding: '10px 12px',
            borderRadius: '10px',
            fontSize: '12px',
            marginBottom: '1rem',
          }}
        >
          {error}
        </div>
      )}

      {/* Device List */}
      <div style={{ display: 'grid', gap: '10px', marginBottom: '1.5rem' }}>
        {activeSessions.map((session) => (
          <div
            key={session.sessionId}
            style={{
              border: '1px solid var(--border, #e2e8f0)',
              borderRadius: '14px',
              padding: '14px',
              background: 'var(--surface, #ffffff)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              transition: 'border-color 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div
                style={{
                  padding: '8px',
                  borderRadius: '10px',
                  background: 'var(--surface-alt, #f1f5f9)',
                  color: 'var(--primary, #2563eb)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {getDeviceIcon(session.deviceInfo)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text, #0f172a)' }}>
                  {session.deviceInfo}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '11px',
                    color: 'var(--text-muted, #94a3b8)',
                    marginTop: '4px',
                    flexWrap: 'wrap',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin style={{ width: 12, height: 12 }} /> {session.location}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Globe style={{ width: 12, height: 12 }} /> {session.ipAddress}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSelectSession(session)}
              disabled={loadingId !== null}
              style={{
                width: '100%',
                padding: '8px 12px',
                background: 'rgba(239, 68, 68, 0.08)',
                color: '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: loadingId !== null ? 'default' : 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
              onMouseEnter={(e) => {
                if (!loadingId) {
                  e.currentTarget.style.background = '#ef4444';
                  e.currentTarget.style.color = '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                if (!loadingId) {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
                  e.currentTarget.style.color = '#ef4444';
                }
              }}
            >
              {loadingId === session.sessionId ? 'Replacing device...' : 'Log out device & continue'}
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={onCancel}
        style={{
          width: '100%',
          padding: '8px',
          background: 'transparent',
          border: 'none',
          color: 'var(--text-muted, #94a3b8)',
          fontSize: '12px',
          fontWeight: 500,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
        }}
      >
        <ArrowLeft style={{ width: 14, height: 14 }} /> Cancel and return to login
      </button>
    </div>
  );
}

