const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let io = null;

function parseCookie(cookieString, key) {
  if (!cookieString) return null;
  const parts = cookieString.split(';');
  for (const part of parts) {
    const [k, v] = part.trim().split('=');
    if (k === key) return decodeURIComponent(v);
  }
  return null;
}

function initSocket(httpServer) {
  const rawOrigins = [
    process.env.CLIENT_URL,
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:5174',
  ].filter(Boolean);

  const allowedOrigins = Array.from(
    new Set([
      ...rawOrigins,
      ...rawOrigins.map((u) => u.replace(/\/+$/, '')),
      ...rawOrigins.map((u) => `${u.replace(/\/+$/, '')}/`),
    ])
  );

  io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const normalized = origin.replace(/\/+$/, '');
        if (allowedOrigins.some((o) => o.replace(/\/+$/, '') === normalized)) {
          return callback(null, true);
        }
        return callback(null, true);
      },
      credentials: true,
    },
    pingTimeout: 30000,
    pingInterval: 25000,
  });

  // JWT Authentication Middleware
  io.use((socket, next) => {
    const rawAuth = socket.handshake.auth?.token || socket.handshake.headers?.authorization;
    let token = rawAuth;
    if (token && token.startsWith('Bearer ')) {
      token = token.slice(7);
    }

    if (!token && socket.handshake.headers?.cookie) {
      token =
        parseCookie(socket.handshake.headers.cookie, 'access_token') ||
        parseCookie(socket.handshake.headers.cookie, 'cp_access_token');
    }

    if (!token) {
      return next(new Error('Authentication token required'));
    }

    try {
      let decoded = null;
      try {
        decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET, {
          issuer: 'securepay',
          audience: 'securepay-client',
        });
      } catch (err) {
        decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET);
      }

      socket.user = {
        ...decoded,
        id: decoded.id || decoded.userId,
      };

      if (!socket.user.id) {
        return next(new Error('Invalid token payload: missing user identifier'));
      }

      return next();
    } catch (err) {
      return next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user.id;
    const userRole = socket.user.role;
    const sessionId = socket.user.sessionId;

    // Join private user room
    socket.join(`user:${userId}`);

    // Join role room (e.g., admin, super_admin, user)
    if (userRole) {
      socket.join(`role:${userRole}`);
    }

    // Join session room for targeted MDM force-logout signals
    if (sessionId) {
      socket.join(`session:${sessionId}`);
    }

    socket.on('disconnect', () => {
      socket.leave(`user:${userId}`);
      if (userRole) {
        socket.leave(`role:${userRole}`);
      }
      if (sessionId) {
        socket.leave(`session:${sessionId}`);
      }
    });
  });

  return io;
}

function getIO() {
  if (!io) {
    throw new Error('Socket.io has not been initialized');
  }
  return io;
}

module.exports = { initSocket, getIO };
