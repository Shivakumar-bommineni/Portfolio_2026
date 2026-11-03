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

    // Connect to backend via proxy or VITE_API_URL
    const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const socket = io(socketUrl, {
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

