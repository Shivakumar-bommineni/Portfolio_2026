const jwt = require('jsonwebtoken');

const TOKEN_OPTIONS = { issuer: 'securepay', audience: 'securepay-client' };

const generateAccessToken = (payload) =>
  jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    ...TOKEN_OPTIONS,
    expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m',
  });

const generateRefreshToken = (payload) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    ...TOKEN_OPTIONS,
    expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d',
  });

const generateSessionSelectionToken = (payload) =>
  jwt.sign({ ...payload, purpose: 'session_selection' }, process.env.JWT_ACCESS_SECRET, {
    ...TOKEN_OPTIONS,
    expiresIn: '5m',
  });

const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET, TOKEN_OPTIONS);
  } catch (err) {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  }
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET, TOKEN_OPTIONS);
  } catch (err) {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  }
};

const verifySessionSelectionToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET, TOKEN_OPTIONS);
  } catch (err) {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  }
};

const isProd = () => process.env.NODE_ENV === 'production';

const setCookies = (res, accessToken, refreshToken) => {
  const cookieOpts = {
    httpOnly: true,
    secure: isProd(),
    sameSite: isProd() ? 'strict' : 'lax',
    path: '/',
  };

  // Base cookies
  res.cookie('access_token', accessToken, {
    ...cookieOpts,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie('refresh_token', refreshToken, {
    ...cookieOpts,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/auth/refresh',
  });

  // Namespaced cookies (cp_ prefix from auth-and-mdm guide)
  res.cookie('cp_access_token', accessToken, {
    ...cookieOpts,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie('cp_refresh_token', refreshToken, {
    ...cookieOpts,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
};

const clearCookies = (res) => {
  res.clearCookie('access_token', { path: '/' });
  res.clearCookie('refresh_token', { path: '/api/auth/refresh' });
  res.clearCookie('refresh_token', { path: '/' });
  res.clearCookie('cp_access_token', { path: '/' });
  res.clearCookie('cp_refresh_token', { path: '/' });
  res.clearCookie('cp_user', { path: '/' });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateSessionSelectionToken,
  verifyAccessToken,
  verifyRefreshToken,
  verifySessionSelectionToken,
  setCookies,
  clearCookies,
};
