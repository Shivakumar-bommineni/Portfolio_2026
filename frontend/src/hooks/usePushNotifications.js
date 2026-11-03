import { useEffect, useCallback } from 'react';
import { notificationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export function usePushNotifications() {
  const { user } = useAuth();
  const isAuthenticated = Boolean(user);

  const register = useCallback(async () => {
    if (typeof window === 'undefined') return;
    if (!('Notification' in window) || !('serviceWorker' in navigator)) return;

    try {
      const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
      if (!vapidKey) {
        // Skip registration until user provides VAPID key
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return;

      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      const { getMessaging, getToken } = await import('firebase/messaging');
      const { initializeApp } = await import('firebase/app');

      const app = initializeApp({
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummy",
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "portal.firebaseapp.com",
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "portal-stage",
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
        appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123:web:xyz",
      });
      const messaging = getMessaging(app);

      const token = await getToken(messaging, {
        serviceWorkerRegistration: registration,
        vapidKey,
      });

      if (token) {
        await notificationAPI.registerPushToken({
          pushToken: token,
          deviceType: 'WEB',
        });
      }
    } catch (err) {
      console.warn('Push notification registration warning:', err.message);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      register();
    }
  }, [isAuthenticated, register]);
}

