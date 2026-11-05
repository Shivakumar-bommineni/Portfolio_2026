const { verifyAccessToken, clearCookies } = require('../utils/jwtHelper');
const { query } = require('../config/database');

const authenticate = async (req, res, next) => {
  try {
    const rawAuth = req.headers.authorization;
    let token = null;

    if (rawAuth && rawAuth.startsWith('Bearer ')) {
      token = rawAuth.slice(7);
    } else if (req.cookies) {
      token = req.cookies.access_token || req.cookies.cp_access_token;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const decoded = verifyAccessToken(token);

    // If session ID is present in token, check MDM session status in database
    if (decoded.sessionId) {
      const { rows } = await query(
        'SELECT id, is_active, is_revoked FROM user_sessions WHERE id = $1',
        [decoded.sessionId]
      );

      if (!rows.length || !rows[0].is_active || rows[0].is_revoked) {
        clearCookies(res);
        return res.status(401).json({
          success: false,
          error: 'SESSION-REVOKED',
          code: 'SESSION-REVOKED',
          message: 'Your session has been terminated because another device was logged in.',
        });
      }

      // Update last active time silently
      query('UPDATE user_sessions SET last_active = NOW() WHERE id = $1', [decoded.sessionId]).catch(() => {});
    }

    req.user = decoded;
    req.token = token;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

module.exports = { authenticate };
