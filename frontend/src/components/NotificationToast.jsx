import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, X } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { playChime } from '../utils/playChime';
import { getNotificationLink } from '../utils/notificationNavigation';

export default function NotificationToast() {
  const { realtimeNotification, clearRealtimeNotification, markRead } = useNotifications();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const navigate = useNavigate();

  useEffect(() => {
    if (!realtimeNotification) return;

    setVisible(true);
    setProgress(100);
    playChime();

    const duration = 5000;
    const startedAt = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      setProgress(Math.max(0, 100 - (elapsed / duration) * 100));
    }, 50);

    const timer = setTimeout(() => {
      setVisible(false);
      clearRealtimeNotification();
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [realtimeNotification, clearRealtimeNotification]);

  if (!visible || !realtimeNotification) return null;

  const handleTap = () => {
    markRead(realtimeNotification.id);
    const destination = getNotificationLink(realtimeNotification);
    if (destination) navigate(destination);
    setVisible(false);
    clearRealtimeNotification();
  };

  return (
    <div
      onClick={handleTap}
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        width: '340px',
        maxWidth: 'calc(100vw - 40px)',
        padding: '14px 16px',
        background: 'var(--surface, #ffffff)',
        color: 'var(--text, #0f172a)',
        border: '1px solid var(--border, #e2e8f0)',
        borderRadius: '16px',
        boxShadow: '0 12px 36px rgba(0,0,0,0.18)',
        cursor: 'pointer',
        animation: 'slideInToast 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div
          style={{
            padding: '8px',
            borderRadius: '10px',
            background: 'var(--primary-lt, rgba(37,99,235,0.1))',
            color: 'var(--primary, #2563eb)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Bell style={{ width: 18, height: 18 }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4
            style={{
              fontSize: '13px',
              fontWeight: 600,
              margin: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {realtimeNotification.title}
          </h4>
          <p
            style={{
              fontSize: '12px',
              color: 'var(--text-sec, #475569)',
              margin: '3px 0 0',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.4,
            }}
          >
            {realtimeNotification.message}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setVisible(false);
            clearRealtimeNotification();
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted, #94a3b8)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X style={{ width: 16, height: 16 }} />
        </button>
      </div>

      <div
        style={{
          marginTop: '10px',
          height: '3px',
          background: 'var(--surface-alt, #f1f5f9)',
          borderRadius: '999px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            background: 'var(--grad, linear-gradient(135deg, #2563eb, #7c3aed))',
            width: `${progress}%`,
            transition: 'width 75ms linear',
          }}
        />
      </div>
    </div>
  );
}

