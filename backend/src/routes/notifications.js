const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
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
} = require('../controllers/notificationController');

// All notification routes require authentication
router.use(authenticate);

router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);
router.get('/settings', getSettings);
router.put('/settings', updateSettings);
router.put('/:id/read', markRead);
router.put('/read-all', markAllRead);
router.delete('/:id', dismiss);
router.post('/push-token', registerPushToken);
router.delete('/push-token', unregisterPushToken);
router.post('/test', sendTestNotification);

module.exports = router;

