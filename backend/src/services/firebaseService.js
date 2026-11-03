const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

let isFirebaseConfigured = false;

const serviceAccountPath = path.resolve(__dirname, '../config/firebase-service-account.json');

try {
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = require(serviceAccountPath);
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
    isFirebaseConfigured = true;
    console.log('🔥 Firebase Admin initialized successfully');
  } else if (process.env.FIREBASE_CONFIG) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
    isFirebaseConfigured = true;
    console.log('🔥 Firebase Admin initialized from FIREBASE_CONFIG');
  } else {
    console.warn('⚠️ [Firebase FCM] firebase-service-account.json not found. Push notifications will be skipped until configured.');
  }
} catch (err) {
  console.warn('⚠️ [Firebase FCM] Failed to initialize Firebase Admin:', err.message);
}

/**
 * Dispatch Multicast Web Push Notification to active user tokens
 */
async function sendPushNotification(tokens, { title, message, data = {} }) {
  if (!isFirebaseConfigured) {
    return { successCount: 0, staleTokens: [] };
  }

  if (!tokens || tokens.length === 0) return null;

  const payload = {
    tokens,
    notification: {
      title,
      body: message,
    },
    data: {
      ...data,
      click_action: data.link || '/notifications',
    },
    webpush: {
      fcmOptions: {
        link: data.link || '/notifications',
      },
    },
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(payload);

    // Prune stale/expired tokens automatically
    const staleTokens = [];
    response.responses.forEach((resp, index) => {
      if (!resp.success) {
        const errCode = resp.error?.code;
        if (
          errCode === 'messaging/registration-token-not-registered' ||
          errCode === 'messaging/invalid-registration-token'
        ) {
          staleTokens.push(tokens[index]);
        }
      }
    });

    return { successCount: response.successCount, staleTokens };
  } catch (error) {
    console.error('[Firebase FCM] Multicast delivery failed:', error.message);
    return null;
  }
}

module.exports = { sendPushNotification };

