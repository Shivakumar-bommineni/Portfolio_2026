const { pool } = require('../config/database');
const { createAndSendNotification } = require('../services/notificationService');

// GET /api/notifications
async function getNotifications(req, res) {
  try {
    const userId = req.user.id || req.user.userId;
    const { page = 1, pageSize = 20, isRead, forRole, performedBy, type } = req.query;
    const offset = (Number(page) - 1) * Number(pageSize);

    let conditions = ['user_id = $1'];
    let values = [userId];

    if (isRead !== undefined && isRead !== null && isRead !== '') {
      values.push(isRead === 'true' || isRead === true);
      conditions.push(`is_read = $${values.length}`);
    }
    if (forRole) {
      values.push(forRole);
      conditions.push(`for_role = $${values.length}`);
    }
    if (performedBy) {
      values.push(performedBy);
      conditions.push(`performed_by = $${values.length}`);
    }
    if (type) {
      values.push(type);
      conditions.push(`type = $${values.length}`);
    }

    const whereClause = conditions.join(' AND ');
    const dataQuery = `
      SELECT * FROM notifications 
      WHERE ${whereClause}
      ORDER BY created_at DESC 
      LIMIT $${values.length + 1} OFFSET $${values.length + 2}
    `;
    const countQuery = `SELECT COUNT(*)::int AS total FROM notifications WHERE ${whereClause}`;

    const [dataResult, countResult] = await Promise.all([
      pool.query(dataQuery, [...values, Number(pageSize), offset]),
      pool.query(countQuery, values),
    ]);

    res.json({
      success: true,
      data: dataResult.rows,
      total: countResult.rows[0].total,
      page: Number(page),
      pageSize: Number(pageSize),
    });
  } catch (error) {
    console.error('getNotifications error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve notifications' });
  }
}

// GET /api/notifications/unread-count
async function getUnreadCount(req, res) {
  try {
    const userId = req.user.id || req.user.userId;
    const { forRole } = req.query;

    let query = 'SELECT COUNT(*)::int AS unread FROM notifications WHERE user_id = $1 AND is_read = false';
    const params = [userId];

    if (forRole) {
      query += ' AND for_role = $2';
      params.push(forRole);
    }

    const { rows } = await pool.query(query, params);
    res.json({ success: true, unreadCount: rows[0].unread });
  } catch (error) {
    console.error('getUnreadCount error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch unread count' });
  }
}

// PUT /api/notifications/:id/read
async function markRead(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user.userId;

    await pool.query(
      'UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    res.status(200).json({ success: true, message: 'Marked as read' });
  } catch (error) {
    console.error('markRead error:', error);
    res.status(500).json({ success: false, message: 'Failed to mark notification as read' });
  }
}

// PUT /api/notifications/read-all
async function markAllRead(req, res) {
  try {
    const userId = req.user.id || req.user.userId;
    await pool.query(
      'UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false',
      [userId]
    );
    res.status(200).json({ success: true, message: 'All marked as read' });
  } catch (error) {
    console.error('markAllRead error:', error);
    res.status(500).json({ success: false, message: 'Failed to mark all as read' });
  }
}

// DELETE /api/notifications/:id
async function dismiss(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user.userId;

    await pool.query('DELETE FROM notifications WHERE id = $1 AND user_id = $2', [id, userId]);
    res.status(200).json({ success: true, message: 'Notification dismissed' });
  } catch (error) {
    console.error('dismiss error:', error);
    res.status(500).json({ success: false, message: 'Failed to dismiss notification' });
  }
}

// POST /api/notifications/push-token
async function registerPushToken(req, res) {
  try {
    const userId = req.user.id || req.user.userId;
    const { pushToken, deviceType = 'WEB' } = req.body;

    if (!pushToken) return res.status(400).json({ success: false, error: 'pushToken is required' });

    await pool.query(
      `INSERT INTO user_push_tokens (user_id, push_token, device_type, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (push_token) DO UPDATE SET updated_at = NOW()`,
      [userId, pushToken, deviceType]
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('registerPushToken error:', error);
    res.status(500).json({ success: false, message: 'Failed to register push token' });
  }
}

// DELETE /api/notifications/push-token
async function unregisterPushToken(req, res) {
  try {
    const { pushToken } = req.body;
    if (!pushToken) return res.status(400).json({ success: false, error: 'pushToken is required' });

    await pool.query('DELETE FROM user_push_tokens WHERE push_token = $1', [pushToken]);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('unregisterPushToken error:', error);
    res.status(500).json({ success: false, message: 'Failed to unregister push token' });
  }
}

// GET /api/notifications/settings
async function getSettings(req, res) {
  try {
    const userId = req.user.id || req.user.userId;
    const { rows } = await pool.query(
      'SELECT * FROM user_notification_settings WHERE user_id = $1',
      [userId]
    );

    if (rows.length === 0) {
      // Default settings
      return res.json({
        success: true,
        data: {
          training_assigned: true,
          training_completed: true,
          deadline_reminders: true,
          weekly_summary: false,
          compliance_alerts: true,
          system_updates: false,
          security_alerts: true,
        },
      });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('getSettings error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch settings' });
  }
}

// PUT /api/notifications/settings
async function updateSettings(req, res) {
  try {
    const userId = req.user.id || req.user.userId;
    const {
      training_assigned = true,
      training_completed = true,
      deadline_reminders = true,
      weekly_summary = false,
      compliance_alerts = true,
      system_updates = false,
      security_alerts = true,
    } = req.body;

    const query = `
      INSERT INTO user_notification_settings (
        user_id,
        training_assigned,
        training_completed,
        deadline_reminders,
        weekly_summary,
        compliance_alerts,
        system_updates,
        security_alerts,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      ON CONFLICT (user_id) DO UPDATE SET
        training_assigned = EXCLUDED.training_assigned,
        training_completed = EXCLUDED.training_completed,
        deadline_reminders = EXCLUDED.deadline_reminders,
        weekly_summary = EXCLUDED.weekly_summary,
        compliance_alerts = EXCLUDED.compliance_alerts,
        system_updates = EXCLUDED.system_updates,
        security_alerts = EXCLUDED.security_alerts,
        updated_at = NOW()
      RETURNING *;
    `;

    const { rows } = await pool.query(query, [
      userId,
      training_assigned,
      training_completed,
      deadline_reminders,
      weekly_summary,
      compliance_alerts,
      system_updates,
      security_alerts,
    ]);

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('updateSettings error:', error);
    res.status(500).json({ success: false, message: 'Failed to update settings' });
  }
}

// POST /api/notifications/test (helper endpoint to trigger a notification for testing)
async function sendTestNotification(req, res) {
  try {
    const userId = req.user.id || req.user.userId;
    const {
      title = 'Security Alert: New Device Login',
      message = 'A new session was authenticated from an unrecognized device.',
      type = 'Security',
      metadata = { deviceId: 'win-edge-01', location: 'Hyderabad, IN' },
    } = req.body || {};

    const notification = await createAndSendNotification({
      userId,
      title,
      message,
      type,
      forRole: req.user.role || 'user',
      performedBy: 'system',
      sourceType: 'auth.security',
      metadata,
    });

    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    console.error('sendTestNotification error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  getNotifications,
  getUnreadCount,
  markRead,
  markAllRead,
  dismiss,
  registerPushToken,
  unregisterPushToken,
  getSettings,
  updateSettings,
  sendTestNotification,
};

