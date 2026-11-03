import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Trash2,
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle2,
  Sparkles,
  Sliders,
  ArrowLeft,
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { getNotificationLink } from '../utils/notificationNavigation';
import { notificationAPI } from '../services/api';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'Security', label: 'Security' },
  { id: 'Approval', label: 'Approvals' },
  { id: 'settings', label: 'Preferences' },
];

const PREF_GROUPS = [
  {
    category: 'Activity & Modules',
    items: [
      { id: 'training_assigned', label: 'Training Assigned', desc: 'When a new curriculum or resource is assigned' },
      { id: 'training_completed', label: 'Training Completed', desc: 'When milestones or resources are finished' },
      { id: 'deadline_reminders', label: 'Deadline Reminders', desc: 'Reminders 3 days prior to due dates' },
    ],
  },
  {
    category: 'System & Security',
    items: [
      { id: 'security_alerts', label: 'Security & MDM Alerts', desc: 'Unrecognized logins, multi-tab locks, or suspicious activity' },
      { id: 'compliance_alerts', label: 'Compliance & Project Alerts', desc: 'Payment milestones and deadline thresholds' },
      { id: 'system_updates', label: 'System Updates', desc: 'Release notices and major feature enhancements' },
    ],
  },
];

export default function NotificationsPage() {
  const { notifications, unreadCount, markRead, markAllRead, dismiss, fetchNotifications } = useNotifications();
  const [activeTab, setActiveTab] = useState('all');
  const [sendingTest, setSendingTest] = useState(false);
  const [prefs, setPrefs] = useState({
    training_assigned: true,
    training_completed: true,
    deadline_reminders: true,
    weekly_summary: false,
    compliance_alerts: true,
    system_updates: false,
    security_alerts: true,
  });
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    notificationAPI.getSettings()
      .then((res) => {
        if (res.data?.data) {
          setPrefs((prev) => ({ ...prev, ...res.data.data }));
        }
      })
      .catch(() => {});
  }, []);

  const filtered = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.is_read;
    if (activeTab === 'Security') return n.type === 'Security';
    if (activeTab === 'Approval') return n.type === 'Approval';
    return true;
  });

  const handleTriggerTest = async () => {
    setSendingTest(true);
    try {
      await notificationAPI.sendTest({
        title: 'Security Alert: Device Verification',
        message: 'A new session was authenticated. Review your connected devices.',
        type: 'Security',
        metadata: { resourceType: 'active_devices', link: '/dashboard' },
      });
    } catch (err) {
      console.error('Test notification failed:', err);
    } finally {
      setSendingTest(false);
    }
  };

  const handleSavePreferences = async () => {
    setSavingPrefs(true);
    try {
      await notificationAPI.updateSettings(prefs);
      setSavedMessage('Preferences saved successfully!');
      setTimeout(() => setSavedMessage(''), 3000);
    } catch (err) {
      setSavedMessage('Failed to save preferences.');
    } finally {
      setSavingPrefs(false);
    }
  };

  const togglePref = (key) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg, #f8fafc)', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Top bar with back to dashboard */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <Link
            to="/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              color: 'var(--text-sec, #475569)',
              padding: '6px 12px',
              background: 'var(--surface, #ffffff)',
              border: '1px solid var(--border, #e2e8f0)',
              borderRadius: '10px',
              fontWeight: 500,
            }}
          >
            <ArrowLeft style={{ width: 15, height: 15 }} /> Back to Dashboard
          </Link>

          <button
            onClick={handleTriggerTest}
            disabled={sendingTest}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#ffffff',
              background: 'var(--grad, linear-gradient(135deg, #2563eb, #7c3aed))',
              border: 'none',
              borderRadius: '10px',
              cursor: sendingTest ? 'default' : 'pointer',
              opacity: sendingTest ? 0.7 : 1,
            }}
          >
            <Sparkles style={{ width: 14, height: 14 }} />
            {sendingTest ? 'Sending...' : 'Test Real-time Push'}
          </button>
        </div>

        {/* Header Title & Actions */}
        <div
          style={{
            background: 'var(--surface, #ffffff)',
            border: '1px solid var(--border, #e2e8f0)',
            borderRadius: '18px',
            padding: '24px',
            marginBottom: '1.5rem',
            boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.06))',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0, color: 'var(--text, #0f172a)' }}>
                Notifications Center
              </h1>
              <p style={{ fontSize: '13px', color: 'var(--text-sec, #475569)', margin: '4px 0 0' }}>
                Real-time alerts, security triggers, and workflow updates
              </p>
            </div>

            {unreadCount > 0 && activeTab !== 'settings' && (
              <button
                onClick={markAllRead}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--primary, #2563eb)',
                  background: 'var(--primary-lt, rgba(37,99,235,0.08))',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                }}
              >
                <CheckCheck style={{ width: 16, height: 16 }} /> Mark all read ({unreadCount})
              </button>
            )}
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '20px', borderTop: '1px solid var(--border, #e2e8f0)', paddingTop: '16px', overflowX: 'auto' }}>
            {TABS.map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '6px 14px',
                    fontSize: '12px',
                    fontWeight: 600,
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    background: isSelected ? 'var(--text, #0f172a)' : 'var(--surface-alt, #f1f5f9)',
                    color: isSelected ? 'var(--surface, #ffffff)' : 'var(--text-sec, #475569)',
                  }}
                >
                  {tab.label}
                  {tab.id === 'unread' && unreadCount > 0 && (
                    <span
                      style={{
                        marginLeft: '6px',
                        padding: '1px 6px',
                        borderRadius: '999px',
                        background: isSelected ? 'rgba(255,255,255,0.2)' : 'var(--primary, #2563eb)',
                        color: '#ffffff',
                        fontSize: '10px',
                      }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Section */}
        {activeTab === 'settings' ? (
          <div
            style={{
              background: 'var(--surface, #ffffff)',
              border: '1px solid var(--border, #e2e8f0)',
              borderRadius: '18px',
              padding: '24px',
              boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.06))',
            }}
          >
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600, margin: 0, color: 'var(--text, #0f172a)' }}>
                Notification Preferences
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-sec, #475569)', margin: '4px 0 0' }}>
                Control which notifications you receive in real-time and through desktop push alerts.
              </p>
            </div>

            <div style={{ display: 'grid', gap: '20px' }}>
              {PREF_GROUPS.map((group) => (
                <div
                  key={group.category}
                  style={{
                    border: '1px solid var(--border, #e2e8f0)',
                    borderRadius: '12px',
                    padding: '16px',
                  }}
                >
                  <h3 style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 12px', color: 'var(--primary, #2563eb)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {group.category}
                  </h3>
                  <div style={{ display: 'grid', gap: '14px' }}>
                    {group.items.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '16px',
                        }}
                      >
                        <div>
                          <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text, #0f172a)', margin: 0 }}>
                            {item.label}
                          </p>
                          <p style={{ fontSize: '12px', color: 'var(--text-sec, #475569)', margin: '2px 0 0' }}>
                            {item.desc}
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={Boolean(prefs[item.id])}
                          onChange={() => togglePref(item.id)}
                          style={{
                            width: '18px',
                            height: '18px',
                            cursor: 'pointer',
                            accentColor: 'var(--primary, #2563eb)',
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={handleSavePreferences}
                disabled={savingPrefs}
                style={{
                  padding: '8px 20px',
                  background: 'var(--primary, #2563eb)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: savingPrefs ? 'default' : 'pointer',
                  opacity: savingPrefs ? 0.7 : 1,
                }}
              >
                {savingPrefs ? 'Saving...' : 'Save Preferences'}
              </button>
              {savedMessage && (
                <span style={{ fontSize: '12px', color: 'var(--success, #10b981)', fontWeight: 600 }}>
                  {savedMessage}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '10px' }}>
            {filtered.length === 0 ? (
              <div
                style={{
                  background: 'var(--surface, #ffffff)',
                  border: '1px solid var(--border, #e2e8f0)',
                  borderRadius: '18px',
                  padding: '48px 24px',
                  textAlign: 'center',
                  color: 'var(--text-muted, #94a3b8)',
                }}
              >
                <Bell style={{ width: 36, height: 36, margin: '0 auto 12px', opacity: 0.3 }} />
                <p style={{ fontSize: '14px', margin: 0, fontWeight: 500 }}>No notifications found in this view</p>
              </div>
            ) : (
              filtered.map((item) => {
                const isUnread = !item.is_read;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (isUnread) markRead(item.id);
                      const target = getNotificationLink(item);
                      if (target) navigate(target);
                    }}
                    style={{
                      background: isUnread
                        ? 'var(--primary-lt, rgba(37,99,235,0.06))'
                        : 'var(--surface, #ffffff)',
                      border: `1px solid ${isUnread ? 'rgba(37,99,235,0.3)' : 'var(--border, #e2e8f0)'}`,
                      borderRadius: '14px',
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '14px', flex: 1, minWidth: 0 }}>
                      <div style={{ marginTop: '2px', flexShrink: 0 }}>
                        {item.type === 'Security' ? (
                          <ShieldAlert style={{ width: 22, height: 22, color: '#f59e0b' }} />
                        ) : item.type === 'Warning' ? (
                          <AlertTriangle style={{ width: 22, height: 22, color: '#ef4444' }} />
                        ) : item.type === 'Approval' ? (
                          <CheckCircle2 style={{ width: 22, height: 22, color: '#10b981' }} />
                        ) : (
                          <Info style={{ width: 22, height: 22, color: 'var(--primary, #2563eb)' }} />
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <h4
                            style={{
                              fontSize: '14px',
                              fontWeight: isUnread ? 700 : 600,
                              margin: 0,
                              color: 'var(--text, #0f172a)',
                            }}
                          >
                            {item.title}
                          </h4>
                          {isUnread && (
                            <span
                              style={{
                                fontSize: '10px',
                                fontWeight: 700,
                                color: 'var(--primary, #2563eb)',
                                background: 'var(--primary-lt, rgba(37,99,235,0.12))',
                                padding: '1px 6px',
                                borderRadius: '6px',
                              }}
                            >
                              NEW
                            </span>
                          )}
                        </div>

                        <p
                          style={{
                            fontSize: '13px',
                            color: 'var(--text-sec, #475569)',
                            margin: '4px 0 0',
                            lineHeight: 1.5,
                          }}
                        >
                          {item.message}
                        </p>

                        <span
                          style={{
                            fontSize: '11px',
                            color: 'var(--text-muted, #94a3b8)',
                            marginTop: '8px',
                            display: 'block',
                          }}
                        >
                          {item.created_at ? new Date(item.created_at).toLocaleString() : 'Just now'}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dismiss(item.id);
                        }}
                        title="Dismiss notification"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-muted, #94a3b8)',
                          padding: '6px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#ef4444';
                          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'var(--text-muted, #94a3b8)';
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <Trash2 style={{ width: 16, height: 16 }} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}

