const { pool } = require('../config/database');
const { getIO } = require('./socketService');
const { sendPushNotification } = require('./firebaseService');

async function createAndSendNotification({
  userId,
  title,
  message,
  type = 'Info',
  forRole = 'admin',
  performedBy = 'system',
  sourceType = 'system.general',
  metadata = {},
}) {
  if (!userId) {
    throw new Error('userId is required to create a notification');
  }

  // 1. Insert into Database
  const insertQuery = `
    INSERT INTO notifications (user_id, title, message, type, for_role, performed_by, source_type, metadata_json)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;
  const { rows } = await pool.query(insertQuery, [
    userId,
    title,
    message,
    type,
    forRole,
    performedBy,
    sourceType,
    JSON.stringify(metadata || {}),
  ]);
  const notification = rows[0];

  // 2. Real-time In-App Push via Socket.IO
  try {
    const io = getIO();
    io.to(`user:${userId}`).emit('ReceiveNotification', notification);
    io.to(`user:${userId}`).emit('UnreadCountUpdated');
  } catch (err) {
    console.warn('[NotificationService] Socket.io emit skipped:', err.message);
  }

  // 3. Desktop Background Push via FCM
  try {
    const { rows: tokenRows } = await pool.query(
      'SELECT push_token FROM user_push_tokens WHERE user_id = $1',
      [userId]
    );
    const tokens = tokenRows.map((r) => r.push_token);

    if (tokens.length > 0) {
      const pushRes = await sendPushNotification(tokens, {
        title,
        message,
        data: {
          notificationId: String(notification.id),
          type: String(notification.type || ''),
          forRole: String(notification.for_role || ''),
          sourceType: String(notification.source_type || ''),
          metadataJson: JSON.stringify(metadata || {}),
        },
      });

      // Cleanup stale tokens if detected
      if (pushRes?.staleTokens?.length) {
        await pool.query(
          'DELETE FROM user_push_tokens WHERE push_token = ANY($1)',
          [pushRes.staleTokens]
        );
      }
    }
  } catch (err) {
    console.error('[NotificationService] FCM push error:', err.message);
  }

  return notification;
}

module.exports = { createAndSendNotification };

