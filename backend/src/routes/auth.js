const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { otpLimiter, loginLimiter, refreshLimiter } = require('../middleware/rateLimiter');
const ctrl = require('../controllers/authController');

const phoneRule = body('phone')
  .trim()
  .matches(/^\+?[1-9]\d{9,14}$/)
  .withMessage('Enter a valid phone number with country code');

const passwordRule = body('password')
  .isLength({ min: 8, max: 128 })
  .withMessage('Password must be at least 8 characters')
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
  .withMessage('Password must include uppercase, lowercase, number, and special character (@$!%*?&)');

const otpRule = body('otp')
  .trim()
  .isLength({ min: 6, max: 6 })
  .isNumeric()
  .withMessage('Enter a valid 6-digit OTP');

router.post('/send-otp', otpLimiter, [phoneRule], validate, ctrl.sendRegistrationOTP);

router.post('/register',
  [phoneRule, passwordRule, otpRule,
    body('fullName').trim().isLength({ min: 2, max: 100 }).withMessage('Full name must be at least 2 characters'),
    body('email').optional({ nullable: true, checkFalsy: true }).isEmail().normalizeEmail().withMessage('Invalid email address'),
  ],
  validate,
  ctrl.register
);

router.post('/login',
  loginLimiter,
  [phoneRule, body('password').notEmpty().withMessage('Password is required')],
  validate,
  ctrl.login
);

// MDM Session Selection & Replacement
router.post('/sessions/force-logout-and-login', loginLimiter, ctrl.forceLogoutAndLogin);
router.get('/sessions', authenticate, ctrl.getActiveSessions);
router.delete('/sessions/:sessionId', authenticate, ctrl.revokeSession);

router.post('/forgot-password/send-otp', otpLimiter, [phoneRule], validate, ctrl.sendForgotPasswordOTP);

router.post('/forgot-password/reset',
  [phoneRule, otpRule,
    body('newPassword')
      .isLength({ min: 8, max: 128 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
      .withMessage('Password must include uppercase, lowercase, number, and special character'),
  ],
  validate,
  ctrl.resetPassword
);

router.post('/refresh', refreshLimiter, ctrl.refreshToken);
router.post('/logout', authenticate, ctrl.logout);
router.get('/me', authenticate, ctrl.getMe);
router.put('/change-password',
  authenticate,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8, max: 128 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
      .withMessage('New password must include uppercase, lowercase, number, and special character'),
  ],
  validate,
  ctrl.changePassword
);

module.exports = router;
