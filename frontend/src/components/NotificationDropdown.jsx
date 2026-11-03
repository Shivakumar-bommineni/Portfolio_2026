import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { getNotificationLink } from '../utils/notificationNavigation';

export function NotificationDropdown() {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const preview = notifications.slice(0, 5);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleSelect = (notif) => {
    if (!notif.is_read) markRead(notif.id);
    setOpen(false);
    const link = getNotificationLink(notif);
    navigate(link || '/notifications');
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(!open)}
        title="Notifications"
        style={{
          position: 'relative',
          background: open ? 'var(--surface-alt, #f1f5f9)' : 'transparent',
          border: '1px solid var(--border, #e2e8f0)',
          borderRadius: '10px',
          padding: '8px',
          cursor: 'pointer',
          color: 'var(--text, #0f172a)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
        }}
      >
        <Bell
          style={{
            width: 18,
            height: 18,
            color: unreadCount > 0 ? 'var(--primary, #2563eb)' : 'inherit',
            animation: unreadCount > 0 ? 'bellRing 3s ease infinite' : 'none',
          }}
        />
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              display: 'flex',
              height: '16px',
              minWidth: '16px',
              padding: '0 4px',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '999px',
              backgroundColor: '#ef4444',
              color: '#ffffff',
              fontSize: '10px',
              fontWeight: 700,
              boxShadow: '0 0 0 2px var(--surface, #ffffff)',
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            marginTop: '8px',
            width: '320px',
            backgroundColor: 'var(--surface, #ffffff)',
            border: '1px solid var(--border, #e2e8f0)',
            borderRadius: '16px',
            boxShadow: '0 16px 40px rgba(0,0,0,0.14)',
            padding: '8px',
            zIndex: 1000,
            animation: 'fadeInMenu 0.15s ease',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              borderBottom: '1px solid var(--border, #e2e8f0)',
            }}
          >
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text, #0f172a)' }}>
              Notifications
            </span>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary, #2563eb)',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: 0,
                }}
              >
                <CheckCheck style={{ width: 14, height: 14 }} /> Mark all read
              </button>
            )}
          </div>

          <div
            style={{
              maxHeight: '280px',
              overflowY: 'auto',
              padding: '4px 0',
            }}
          >
            {preview.length === 0 ? (
              <p
                style={{
                  padding: '24px 12px',
                  fontSize: '12px',
                  textAlign: 'center',
                  color: 'var(--text-muted, #94a3b8)',
                  margin: 0,
                }}
              >
                No notifications yet
              </p>
            ) : (
              preview.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleSelect(n)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                    marginBottom: '2px',
                    backgroundColor: !n.is_read
                      ? 'var(--primary-lt, rgba(37,99,235,0.08))'
                      : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = !n.is_read
                      ? 'var(--primary-lt, rgba(37,99,235,0.14))'
                      : 'var(--surface-alt, #f1f5f9)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = !n.is_read
                      ? 'var(--primary-lt, rgba(37,99,235,0.08))'
                      : 'transparent';
                  }}
                >
                  <p
                    style={{
                      fontSize: '12px',
                      fontWeight: n.is_read ? 500 : 600,
                      color: 'var(--text, #0f172a)',
                      margin: 0,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {n.title}
                  </p>
                  <p
                    style={{
                      fontSize: '11px',
                      color: 'var(--text-sec, #475569)',
                      margin: '2px 0 0',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {n.message}
                  </p>
                </div>
              ))
            )}
          </div>

          <button
            onClick={() => {
              setOpen(false);
              navigate('/notifications');
            }}
            style={{
              width: '100%',
              marginTop: '4px',
              padding: '8px',
              textAlign: 'center',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--primary, #2563eb)',
              backgroundColor: 'var(--primary-lt, rgba(37,99,235,0.08))',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'background 0.15s ease',
            }}
          >
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
}

export default NotificationDropdown;

