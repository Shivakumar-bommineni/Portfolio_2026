const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();

const { server } = require('./app');
const { setup } = require('./config/setupDb');
const { seed } = require('./config/seedSuperAdmin');
const { pool } = require('./config/database');

const PORT = parseInt(process.env.PORT || '5000', 10);
const NODE_ENV = process.env.NODE_ENV || 'development';

async function bootstrap() {
  console.log('───────────────────────────────────────────────────');
  console.log(`🚀 Starting SecurePay Backend in [${NODE_ENV}] mode`);
  console.log('───────────────────────────────────────────────────');

  // 1. Automated Database Setup (Tables & Indexes)
  try {
    console.log('📦 Running automated database schema migrations...');
    await setup(false);
  } catch (err) {
    console.error('❌ Failed to run database setup:', err.message);
    console.error('   Please verify database connection credentials.');
    process.exit(1);
  }

  // 2. Automated Seed Super Admin
  try {
    console.log('🌱 Checking / Seeding default admin user...');
    await seed(false);
  } catch (err) {
    console.warn('⚠️ Seeding skipped or encountered non-critical notice:', err.message);
  }

  // 3. Start Server & Real-time WebSockets
  server.listen(PORT, '0.0.0.0', () => {
    console.log('───────────────────────────────────────────────────');
    console.log(`✅ Server + Socket.IO Live on port: ${PORT}`);
    console.log(`🌐 Health check endpoint: http://localhost:${PORT}/health`);
    console.log(`🔐 MDM Session Enforcement: Active (Max 3 devices)`);
    console.log(`🔔 Notifications Engine: Active (Socket.IO + FCM)`);
    console.log('───────────────────────────────────────────────────');
  });

  // Graceful shutdown
  const shutdown = (signal) => {
    console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      console.log('🔒 HTTP & Socket.IO server closed.');
      pool.end(() => {
        console.log('💾 Database pool closed.');
        process.exit(0);
      });
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch((err) => {
  console.error('💥 Fatal error during bootstrap:', err);
  process.exit(1);
});

