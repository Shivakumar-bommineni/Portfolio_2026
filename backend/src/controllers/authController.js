const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { query } = require('../config/database');
const {
  generateAccessToken,
  generateRefreshToken,
  generateSessionSelectionToken,
  verifyRefreshToken,
  verifySessionSelectionToken,
  setCookies,
  clearCookies,
} = require('../utils/jwtHelper');
const { generateOTP, hashOTP, verifyOTP } = require('../utils/otpGenerator');
const { sendOTPSMS } = require('../utils/smsService');
const { getIO } = require('../services/socketService');
const { createAndSendNotification } = require('../services/notificationService');

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_DURATION_MS = 30 * 60 * 1000;    // 30 minutes
const OTP_EXPIRY_MS = 5 * 60 * 1000;         // 5 minutes
const MAX_OTP_ATTEMPTS = 3;
const REFRESH_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const MAX_ACTIVE_SESSIONS = 3;

function resolveClientLocationAndIp(req, clientProvidedLocation) {
  const rawIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || req.ip || '127.0.0.1';
  const ipAddress = typeof rawIp === 'string' ? rawIp.split(',')[0].trim() : '127.0.0.1';

  const vercelCity = req.headers['x-vercel-ip-city'];
  const vercelRegion = req.headers['x-vercel-ip-country-region'];
  const vercelCountry = req.headers['x-vercel-ip-country'];
  const cloudflareCountry = req.headers['cf-ipcountry'];

  let location = clientProvidedLocation;
  if (!location || location === 'Local Network' || location === 'Unknown Location') {
    if (vercelCity || vercelCountry) {
      location = [vercelCity, vercelRegion, vercelCountry].filter(Boolean).join(', ');
    } else if (cloudflareCountry) {
      location = cloudflareCountry;
    } else if (ipAddress === '127.0.0.1' || ipAddress === '::1') {
      location = 'Localhost (Development)';
    } else {
      location = 'Hyderabad, Telangana, India';
    }
  }

  return { ipAddress, location };
}               // MDM Active Session Limit

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const issueTokens = async (res, user, session) => {
  const payload = {
    userId: user.id,
    phone: user.phone,
    role: user.role || 'user',
    sessionId: session?.id || null,
  };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await query('DELETE FROM refresh_tokens WHERE user_id = $1 AND expires_at < NOW()', [user.id]);
  await query(
    'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
    [user.id, hashToken(refreshToken), new Date(Date.now() + REFRESH_EXPIRY_MS)]
  );

  if (session?.id) {
    await query(
      'UPDATE user_sessions SET refresh_token_hash = $1, last_active = NOW() WHERE id = $2',
      [hashToken(refreshToken), session.id]
    );
  }

  setCookies(res, accessToken, refreshToken);
  return {
    id: user.id,
    phone: user.phone,
    fullName: user.full_name,
    email: user.email,
    role: user.role || 'user',
    sessionId: session?.id || null,
    accessToken, // Dual-mode delivery for clients storing token locally
    refreshToken,
  };
};

const sendRegistrationOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    const existing = await query('SELECT id FROM users WHERE phone = $1', [phone]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Phone number already registered' });
    }

    await query(
      "UPDATE otps SET is_used = TRUE WHERE phone = $1 AND purpose = 'register' AND is_used = FALSE",
      [phone]
    );

    const otp = generateOTP();
    await query(
      'INSERT INTO otps (phone, otp_hash, purpose, expires_at) VALUES ($1, $2, $3, $4)',
      [phone, await hashOTP(otp), 'register', new Date(Date.now() + OTP_EXPIRY_MS)]
    );

    await sendOTPSMS(phone, otp);
    res.json({ success: true, message: 'OTP sent successfully. Valid for 5 minutes.' });
  } catch (err) {
    console.error('sendRegistrationOTP:', err);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
};

const register = async (req, res) => {
  try {
    const { phone, password, fullName, email, otp } = req.body;

    const otpRow = await query(
      "SELECT * FROM otps WHERE phone=$1 AND purpose='register' AND is_used=FALSE AND expires_at>NOW() ORDER BY created_at DESC LIMIT 1",
      [phone]
    );

    if (!otpRow.rows.length) {
      return res.status(400).json({ success: false, message: 'OTP expired or not found. Please request a new OTP.' });
    }

    const record = otpRow.rows[0];
    if (record.attempts >= MAX_OTP_ATTEMPTS) {
      await query('UPDATE otps SET is_used=TRUE WHERE id=$1', [record.id]);
      return res.status(400).json({ success: false, message: 'Too many OTP attempts. Please request a new OTP.' });
    }

    if (!(await verifyOTP(otp, record.otp_hash))) {
      await query('UPDATE otps SET attempts=attempts+1 WHERE id=$1', [record.id]);
      const left = MAX_OTP_ATTEMPTS - record.attempts - 1;
      return res.status(400).json({ success: false, message: `Invalid OTP. ${left} attempt(s) remaining.` });
    }

    await query('UPDATE otps SET is_used=TRUE WHERE id=$1', [record.id]);

    const result = await query(
      'INSERT INTO users (phone, password_hash, full_name, email, is_phone_verified) VALUES ($1,$2,$3,$4,TRUE) RETURNING *',
      [phone, await bcrypt.hash(password, 12), fullName, email || null]
    );

    const newUser = result.rows[0];

    // Create initial session for registration
    const deviceId = req.body.deviceId || crypto.randomUUID();
    const deviceInfo = req.body.deviceInfo || req.headers['user-agent'] || 'Web Browser';
    const { ipAddress, location } = resolveClientLocationAndIp(req, req.body.location);

    const sessionResult = await query(
      `INSERT INTO user_sessions (user_id, device_id, device_info, location, ip_address, is_active, is_revoked)
       VALUES ($1, $2, $3, $4, $5, TRUE, FALSE)
       RETURNING *`,
      [newUser.id, deviceId, deviceInfo, location, ipAddress]
    );

    const userData = await issueTokens(res, newUser, sessionResult.rows[0]);
    res.status(201).json({ success: true, message: 'Registration successful', user: userData });
  } catch (err) {
    console.error('register:', err);
    if (err.code === '23505') {
      return res.status(400).json({ success: false, message: 'Phone or email already exists' });
    }
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
};

const login = async (req, res) => {
  try {
    const { phone, password, deviceId, deviceInfo, location } = req.body;

    const result = await query('SELECT * FROM users WHERE phone=$1 AND is_active=TRUE', [phone]);
    if (!result.rows.length) {
      return res.status(401).json({ success: false, message: 'Invalid phone or password' });
    }

    const user = result.rows[0];

    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      const mins = Math.ceil((new Date(user.locked_until) - Date.now()) / 60000);
      return res.status(423).json({ success: false, message: `Account locked. Try again in ${mins} minute(s).` });
    }

    if (!(await bcrypt.compare(password, user.password_hash))) {
      const attempts = user.failed_login_attempts + 1;
      const isLocked = attempts >= MAX_LOGIN_ATTEMPTS;
      await query(
        'UPDATE users SET failed_login_attempts=$1, locked_until=$2 WHERE id=$3',
        [attempts, isLocked ? new Date(Date.now() + LOCK_DURATION_MS) : null, user.id]
      );
      const msg = isLocked
        ? 'Account locked for 30 minutes due to repeated failed attempts.'
        : `Invalid phone or password. ${MAX_LOGIN_ATTEMPTS - attempts} attempt(s) remaining.`;
      return res.status(isLocked ? 423 : 401).json({ success: false, message: msg });
    }

    await query(
      'UPDATE users SET failed_login_attempts=0, locked_until=NULL, updated_at=NOW() WHERE id=$1',
      [user.id]
    );

    // ── MDM / Session Limit Enforcement (Max 3 Devices) ───────────
    const incomingDeviceId = deviceId || crypto.createHash('md5').update(`${req.ip}_${req.headers['user-agent']}`).digest('hex');
    const clientDeviceInfo = deviceInfo || req.headers['user-agent'] || 'Web Browser';
    const { ipAddress, location: clientLocation } = resolveClientLocationAndIp(req, location);

    // Query active unrevoked sessions
    const { rows: activeSessions } = await query(
      `SELECT * FROM user_sessions 
       WHERE user_id = $1 AND is_active = TRUE AND is_revoked = FALSE 
       ORDER BY last_active DESC`,
      [user.id]
    );

    // Check if current device already has an active session
    const existingSession = activeSessions.find((s) => s.device_id === incomingDeviceId);

    if (existingSession) {
      // Refresh current device session
      await query(
        `UPDATE user_sessions 
         SET last_active = NOW(), location = $1, ip_address = $2, device_info = $3
         WHERE id = $4`,
        [clientLocation, ipAddress, clientDeviceInfo, existingSession.id]
      );
      const userData = await issueTokens(res, user, existingSession);
      return res.json({ success: true, message: 'Login successful', user: userData });
    }

    // New device: check if max session limit is reached
    if (activeSessions.length >= MAX_ACTIVE_SESSIONS) {
      const sessionSelectionToken = generateSessionSelectionToken({
        userId: user.id,
        phone: user.phone,
      });

      const formattedSessions = activeSessions.map((s) => ({
        sessionId: s.id,
        deviceId: s.device_id,
        deviceInfo: s.device_info || 'Unknown Device',
        location: s.location || 'Unknown Location',
        ipAddress: s.ip_address || '127.0.0.1',
        loginTime: s.created_at,
        lastActive: s.last_active,
      }));

      return res.status(409).json({
        success: false,
        requiresSessionSelection: true,
        message: 'Active session limit reached (maximum 3 devices). Select a device session to terminate and replace.',
        sessionSelectionToken,
        activeSessions: formattedSessions,
      });
    }

    // Active session count is < 3: create new session
    const { rows: newSessionRows } = await query(
      `INSERT INTO user_sessions (user_id, device_id, device_info, location, ip_address, is_active, is_revoked)
       VALUES ($1, $2, $3, $4, $5, TRUE, FALSE)
       RETURNING *`,
      [user.id, incomingDeviceId, clientDeviceInfo, clientLocation, ipAddress]
    );
    const newSession = newSessionRows[0];

    // Send security notification about new device login
    createAndSendNotification({
      userId: user.id,
      title: 'Security Alert: New Device Login',
      message: `New login from ${clientDeviceInfo} (${clientLocation}). Active devices: ${activeSessions.length + 1}/${MAX_ACTIVE_SESSIONS}.`,
      type: 'Security',
      metadata: { deviceId: incomingDeviceId, sessionId: newSession.id },
    }).catch(() => {});

    const userData = await issueTokens(res, user, newSession);
    return res.json({ success: true, message: 'Login successful', user: userData });
  } catch (err) {
    console.error('login:', err);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};

const forceLogoutAndLogin = async (req, res) => {
  try {
    const { sessionSelectionToken, sessionIdToRevoke, deviceId, deviceInfo, location } = req.body;

    if (!sessionSelectionToken || !sessionIdToRevoke) {
      return res.status(400).json({ success: false, message: 'sessionSelectionToken and sessionIdToRevoke are required' });
    }

    let decoded;
    try {
      decoded = verifySessionSelectionToken(sessionSelectionToken);
    } catch {
      return res.status(401).json({ success: false, message: 'Session selection expired. Please sign in again.' });
    }

    const userResult = await query('SELECT * FROM users WHERE id = $1 AND is_active = TRUE', [decoded.userId]);
    if (!userResult.rows.length) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const user = userResult.rows[0];

    // Find session to revoke
    const { rows: revokeTarget } = await query(
      'SELECT * FROM user_sessions WHERE id = $1 AND user_id = $2',
      [sessionIdToRevoke, user.id]
    );

    if (!revokeTarget.length) {
      return res.status(404).json({ success: false, message: 'Target session not found' });
    }
    const oldSession = revokeTarget[0];

    // 1. Mark old session as revoked
    await query(
      'UPDATE user_sessions SET is_active = FALSE, is_revoked = TRUE, revoked_at = NOW() WHERE id = $1',
      [sessionIdToRevoke]
    );

    // 2. Real-time remote termination on displaced device via Socket.io
    try {
      const io = getIO();
      io.to(`session:${sessionIdToRevoke}`).emit('ForceLogout', {
        reason: 'Another device logged in and replaced this session.',
        displacedBy: deviceInfo || 'Another Device',
      });
    } catch (e) {
      console.warn('Socket emit ForceLogout failed:', e.message);
    }

    // 3. Send security notification
    createAndSendNotification({
      userId: user.id,
      title: 'Security Alert: Device Displaced',
      message: `Session for "${oldSession.device_info || 'Device'}" was terminated because a new device logged in.`,
      type: 'Security',
      metadata: { revokedSessionId: sessionIdToRevoke },
    }).catch(() => {});

    // 4. Create new session for this incoming device
    const incomingDeviceId = deviceId || crypto.createHash('md5').update(`${req.ip}_${req.headers['user-agent']}`).digest('hex');
    const clientDeviceInfo = deviceInfo || req.headers['user-agent'] || 'Web Browser';
    const { ipAddress, location: clientLocation } = resolveClientLocationAndIp(req, location);

    const { rows: newSessionRows } = await query(
      `INSERT INTO user_sessions (user_id, device_id, device_info, location, ip_address, is_active, is_revoked)
       VALUES ($1, $2, $3, $4, $5, TRUE, FALSE)
       RETURNING *`,
      [user.id, incomingDeviceId, clientDeviceInfo, clientLocation, ipAddress]
    );
    const newSession = newSessionRows[0];

    const userData = await issueTokens(res, user, newSession);
    res.json({
      success: true,
      message: 'Session replaced and login successful',
      user: userData,
    });
  } catch (err) {
    console.error('forceLogoutAndLogin:', err);
    res.status(500).json({ success: false, message: 'Failed to replace session' });
  }
};

const getActiveSessions = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const currentSessionId = req.user.sessionId;

    const { rows } = await query(
      `SELECT id, device_id, device_info, location, ip_address, created_at, last_active, is_active
       FROM user_sessions 
       WHERE user_id = $1 AND is_active = TRUE AND is_revoked = FALSE 
       ORDER BY last_active DESC`,
      [userId]
    );

    const sessions = rows.map((s) => ({
      sessionId: s.id,
      deviceId: s.device_id,
      deviceInfo: s.device_info || 'Unknown Device',
      location: s.location || 'Unknown Location',
      ipAddress: s.ip_address || '127.0.0.1',
      loginTime: s.created_at,
      lastActive: s.last_active,
      isCurrent: s.id === currentSessionId,
    }));

    res.json({ success: true, activeSessions: sessions, maxAllowed: MAX_ACTIVE_SESSIONS });
  } catch (err) {
    console.error('getActiveSessions:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve active sessions' });
  }
};

const revokeSession = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { sessionId } = req.params;

    const { rows } = await query(
      'SELECT * FROM user_sessions WHERE id = $1 AND user_id = $2',
      [sessionId, userId]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    await query(
      'UPDATE user_sessions SET is_active = FALSE, is_revoked = TRUE, revoked_at = NOW() WHERE id = $1',
      [sessionId]
    );

    // Emit real-time ForceLogout
    try {
      const io = getIO();
      io.to(`session:${sessionId}`).emit('ForceLogout', {
        reason: 'Session was manually revoked from your account settings.',
      });
    } catch (e) {
      // ignore
    }

    res.json({ success: true, message: 'Session revoked successfully' });
  } catch (err) {
    console.error('revokeSession:', err);
    res.status(500).json({ success: false, message: 'Failed to revoke session' });
  }
};

const sendForgotPasswordOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    const userResult = await query('SELECT id FROM users WHERE phone=$1 AND is_active=TRUE', [phone]);

    if (userResult.rows.length > 0) {
      await query(
        "UPDATE otps SET is_used=TRUE WHERE phone=$1 AND purpose='forgot_password' AND is_used=FALSE",
        [phone]
      );
      const otp = generateOTP();
      await query(
        'INSERT INTO otps (phone, otp_hash, purpose, expires_at) VALUES ($1,$2,$3,$4)',
        [phone, await hashOTP(otp), 'forgot_password', new Date(Date.now() + OTP_EXPIRY_MS)]
      );
      await sendOTPSMS(phone, otp);
    }

    res.json({ success: true, message: 'If this number is registered, an OTP has been sent.' });
  } catch (err) {
    console.error('sendForgotPasswordOTP:', err);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { phone, otp, newPassword } = req.body;

    const otpRow = await query(
      "SELECT * FROM otps WHERE phone=$1 AND purpose='forgot_password' AND is_used=FALSE AND expires_at>NOW() ORDER BY created_at DESC LIMIT 1",
      [phone]
    );

    if (!otpRow.rows.length) {
      return res.status(400).json({ success: false, message: 'OTP expired or not requested.' });
    }

    const record = otpRow.rows[0];
    if (record.attempts >= MAX_OTP_ATTEMPTS) {
      await query('UPDATE otps SET is_used=TRUE WHERE id=$1', [record.id]);
      return res.status(400).json({ success: false, message: 'Too many attempts. Please request a new OTP.' });
    }

    if (!(await verifyOTP(otp, record.otp_hash))) {
      await query('UPDATE otps SET attempts=attempts+1 WHERE id=$1', [record.id]);
      return res.status(400).json({ success: false, message: 'Invalid OTP.' });
    }

    await query('UPDATE otps SET is_used=TRUE WHERE id=$1', [record.id]);

    const userResult = await query('SELECT id FROM users WHERE phone=$1', [phone]);
    if (!userResult.rows.length) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const userId = userResult.rows[0].id;
    await query(
      'UPDATE users SET password_hash=$1, failed_login_attempts=0, locked_until=NULL, updated_at=NOW() WHERE id=$2',
      [await bcrypt.hash(newPassword, 12), userId]
    );
    await query('DELETE FROM refresh_tokens WHERE user_id=$1', [userId]);

    // Revoke all existing sessions on password reset
    await query('UPDATE user_sessions SET is_active=FALSE, is_revoked=TRUE, revoked_at=NOW() WHERE user_id=$1', [userId]);

    clearCookies(res);
    res.json({ success: true, message: 'Password reset successful. Please log in.' });
  } catch (err) {
    console.error('resetPassword:', err);
    res.status(500).json({ success: false, message: 'Password reset failed' });
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refresh_token || req.cookies.cp_refresh_token || req.body.refreshToken;
    if (!token) return res.status(401).json({ success: false, message: 'Refresh token required' });

    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch {
      clearCookies(res);
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    // Check MDM session status
    let session = null;
    if (decoded.sessionId) {
      const sessionResult = await query(
        'SELECT * FROM user_sessions WHERE id = $1',
        [decoded.sessionId]
      );
      if (!sessionResult.rows.length || !sessionResult.rows[0].is_active || sessionResult.rows[0].is_revoked) {
        clearCookies(res);
        return res.status(401).json({
          success: false,
          error: 'SESSION-REVOKED',
          code: 'SESSION-REVOKED',
          message: 'Your session was terminated from another device.',
        });
      }
      session = sessionResult.rows[0];
    }

    const stored = await query(
      'SELECT * FROM refresh_tokens WHERE user_id=$1 AND token_hash=$2 AND expires_at>NOW()',
      [decoded.userId, hashToken(token)]
    );

    if (!stored.rows.length) {
      clearCookies(res);
      return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
    }

    const userResult = await query('SELECT * FROM users WHERE id=$1 AND is_active=TRUE', [decoded.userId]);
    if (!userResult.rows.length) return res.status(401).json({ success: false, message: 'User not found' });

    await query('DELETE FROM refresh_tokens WHERE id=$1', [stored.rows[0].id]);
    const userData = await issueTokens(res, userResult.rows[0], session);
    res.json({ success: true, user: userData });
  } catch (err) {
    console.error('refreshToken:', err);
    clearCookies(res);
    res.status(401).json({ success: false, message: 'Session expired' });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.cookies.refresh_token || req.cookies.cp_refresh_token;
    if (token) {
      await query('DELETE FROM refresh_tokens WHERE token_hash=$1', [hashToken(token)]);
    }

    // Revoke current session in database
    if (req.user?.sessionId) {
      await query(
        'UPDATE user_sessions SET is_active=FALSE, is_revoked=TRUE, revoked_at=NOW() WHERE id=$1',
        [req.user.sessionId]
      );
    }
  } finally {
    clearCookies(res);
    res.json({ success: true, message: 'Logged out successfully' });
  }
};

const getMe = async (req, res) => {
  try {
    const result = await query(
      'SELECT id, phone, full_name, email, role, is_phone_verified, created_at FROM users WHERE id=$1',
      [req.user.userId]
    );
    if (!result.rows.length) return res.status(404).json({ success: false, message: 'User not found' });
    const u = result.rows[0];
    res.json({
      success: true,
      user: {
        id: u.id,
        phone: u.phone,
        fullName: u.full_name,
        email: u.email,
        role: u.role,
        isPhoneVerified: u.is_phone_verified,
        createdAt: u.created_at,
        sessionId: req.user.sessionId || null,
        accessToken: req.token || null,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch user' });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current password and new password are required.' });
    }

    const userResult = await query('SELECT * FROM users WHERE id = $1', [userId]);
    if (!userResult.rows.length) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({ success: false, message: 'New password must be different from your current password.' });
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    await query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [newHash, userId]);

    // Send in-app security notification
    try {
      await createAndSendNotification({
        userId: user.id,
        title: 'Security Notice: Password Updated',
        message: 'Your account password was successfully changed from your dashboard session.',
        type: 'Security',
        metadata: { action: 'change_password', timestamp: new Date().toISOString() },
      });
    } catch {
      // ignore
    }

    res.json({ success: true, message: 'Password successfully changed.' });
  } catch (err) {
    console.error('changePassword error:', err);
    res.status(500).json({ success: false, message: 'Failed to update password.' });
  }
};

module.exports = {
  sendRegistrationOTP,
  register,
  login,
  forceLogoutAndLogin,
  getActiveSessions,
  revokeSession,
  sendForgotPasswordOTP,
  resetPassword,
  refreshToken,
  logout,
  getMe,
  changePassword,
};
