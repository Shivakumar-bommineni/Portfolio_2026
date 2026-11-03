import { createContext, useContext, useCallback, useEffect, useRef, useState } from 'react';
import { notificationAPI } from '../services/api';
import { useAuth } from './AuthContext';

export const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const isAuthenticated = Boolean(user);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [realtimeNotification, setRealtimeNotification] = useState(null);

  const forRole = user?.role || 'user';
  const seenIds = useRef(new Set());

  // Fetch initial notifications and counter
  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const [listRes, countRes] = await Promise.all([
        notificationAPI.getAll({ page: 1, pageSize: 50 }),
        notificationAPI.getUnreadCount(),
      ]);

      const items = listRes.data?.data || [];
      setNotifications(items);
      setUnreadCount(countRes.data?.unreadCount || 0);

      // Populate seenIds
      items.forEach((item) => {
        if (item.id) seenIds.current.add(item.id);
      });
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
      setRealtimeNotification(null);
      seenIds.current.clear();
    }
  }, [isAuthenticated, fetchNotifications]);

  // Mark single item read
  const markRead = useCallback(async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
    try {
      await notificationAPI.markRead(id);
    } catch (e) {
      // ignore
    }
  }, []);

  // Mark all items read
  const markAllRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
    try {
      await notificationAPI.markAllRead();
    } catch (e) {
      // ignore
    }
  }, []);

  // Dismiss / delete item
  const dismiss = useCallback(async (id) => {
    setNotifications((prev) => {
      const target = prev.find((n) => n.id === id);
      if (target && !target.is_read) {
        setUnreadCount((c) => Math.max(0, c - 1));
      }
      return prev.filter((n) => n.id !== id);
    });
    try {
      await notificationAPI.dismiss(id);
    } catch (e) {
      // ignore
    }
  }, []);

  // Receive from Socket / Push
  const addNotification = useCallback((item) => {
    if (!item?.id || seenIds.current.has(item.id)) return;
    seenIds.current.add(item.id);

    setNotifications((prev) => [item, ...prev]);
    if (!item.is_read) {
      setUnreadCount((c) => c + 1);
    }
    setRealtimeNotification(item);
  }, []);

  const clearRealtimeNotification = useCallback(() => {
    setRealtimeNotification(null);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        realtimeNotification,
        forRole,
        fetchNotifications,
        markRead,
        markAllRead,
        dismiss,
        addNotification,
        clearRealtimeNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return ctx;
}

