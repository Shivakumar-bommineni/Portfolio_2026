const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();
const http = require('http');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth');
const superAdminRoutes = require('./routes/superAdmin');
const adminRoutes = require('./routes/admin');
const notesRoutes = require('./routes/notes');
const interviewRoutes = require('./routes/interview');
const portfolioRoutes = require('./routes/portfolio');
const resumeRoutes = require('./routes/resume');
const chatRoutes     = require('./routes/chat');
const learningRoutes = require('./routes/learning');
const todoRoutes     = require('./routes/todos');
const bookmarkRoutes = require('./routes/bookmarks');
const projectRoutes  = require('./routes/projects');
const contactRoutes  = require('./routes/contact');
const notificationRoutes = require('./routes/notifications');
const { initSocket } = require('./services/socketService');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const server = http.createServer(app);

// Initialize Socket.io on the shared HTTP server
initSocket(server);

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'blob:'],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:5174',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, true); // permissive for local dev
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use('/api/auth', authRoutes);
app.use('/api/super-admin', superAdminRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/chat',      chatRoutes);
app.use('/api/learning',  learningRoutes);
app.use('/api/todos',     todoRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/projects',  projectRoutes);
app.use('/api/contact',   contactRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/', (_, res) => res.json({
  message: 'Hi Dev! 👋 shivakumar_dev backend is running.',
  version: '1.0.0',
  status: 'ok',
  docs: '/api/auth',
}));

app.get('/health', (_, res) => res.json({ status: 'ok' }));

app.use((_, res) => res.status(404).json({ success: false, message: 'Route not found' }));
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
if (require.main === module) {
  server.listen(PORT, () =>
    console.log(`🚀 Server + Socket.IO running on http://localhost:${PORT} [${process.env.NODE_ENV || 'development'}]`)
  );
}

module.exports = { app, server };
