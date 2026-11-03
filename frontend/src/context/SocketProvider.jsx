import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';

export function SocketProvider({ children }) {
  const { user, logout } = useAuth();
  const { addNotification, fetchNotifications } = useNotifications();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    // Connect to backend via proxy or VITE_API_URL or production default
    const defaultSocketUrl = import.meta.env.PROD
      ? 'https://portfolio-2026-arz2.onrender.com'
      : 'http://localhost:5000';
    const socketUrl = import.meta.env.VITE_API_URL || defaultSocketUrl;
    const token = user?.accessToken || user?.token;
    const socket = io(socketUrl, {
      auth: { token },
      query: { token },
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      // connected successfully
    });

    socket.on('ReceiveNotification', (notification) => {
      addNotification(notification);
    });

    socket.on('UnreadCountUpdated', () => {
      fetchNotifications();
    });

    socket.on('ForceLogout', (payload) => {
      window.dispatchEvent(new CustomEvent('app:force-logout', { detail: payload }));
      if (logout) logout(true);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user, addNotification, fetchNotifications, logout]);

  return children;
}

