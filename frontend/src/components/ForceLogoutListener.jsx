import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ForceLogoutListener() {
  const { logout } = useAuth();
  const [active, setActive] = useState(false);
  const [reason, setReason] = useState('Another device recently logged in and replaced your active session.');
  const [countdown, setCountdown] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const handleForceLogout = (e) => {
      const msg = e.detail?.reason || 'Another device recently logged in and replaced your active session.';
      setReason(msg);
      setActive(true);
      setCountdown(10);
    };

    window.addEventListener('app:force-logout', handleForceLogout);
    return () => window.removeEventListener('app:force-logout', handleForceLogout);
  }, []);

  useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handlePerformLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [active]);

  const handlePerformLogout = async () => {
    setActive(false);
    if (logout) {
      await logout(true); // skip remote api call since session is already revoked
    }
    navigate('/login', { replace: true });
  };

  if (!active) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: 'var(--surface, #ffffff)',
          border: '1px solid var(--border, #e2e8f0)',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <ShieldAlert style={{ width: 26, height: 26 }} />
        </div>

        <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 8px', color: 'var(--text, #0f172a)' }}>
          Session Terminated
        </h3>

        <p style={{ fontSize: '13px', color: 'var(--text-sec, #475569)', lineHeight: 1.5, margin: '0 0 16px' }}>
          {reason}
        </p>

        {/* Progress bar */}
        <div
          style={{
            height: 4,
            background: 'var(--surface-alt, #f1f5f9)',
            borderRadius: 999,
            overflow: 'hidden',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              height: '100%',
              background: '#ef4444',
              width: `${(countdown / 10) * 100}%`,
              transition: 'width 1s linear',
            }}
          />
        </div>

        <p style={{ fontSize: '12px', color: 'var(--text-muted, #94a3b8)', margin: '0 0 20px' }}>
          Redirecting to login in <strong>{countdown}s</strong>
        </p>

        <button
          onClick={handlePerformLogout}
          style={{
            width: '100%',
            padding: '10px 16px',
            background: 'var(--grad, linear-gradient(135deg, #2563eb, #7c3aed))',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <LogOut style={{ width: 15, height: 15 }} /> Log In Again Now
        </button>
      </div>
    </div>
  );
}

