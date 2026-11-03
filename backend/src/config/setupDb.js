require('dotenv').config();
const { pool } = require('./database');

const setup = async (closePool = false) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        phone VARCHAR(20) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE,
        role VARCHAR(20) DEFAULT 'user' NOT NULL,
        is_phone_verified BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        failed_login_attempts INTEGER DEFAULT 0,
        locked_until TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user' NOT NULL;`);

    await client.query(`
      CREATE TABLE IF NOT EXISTS otps (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        phone VARCHAR(20) NOT NULL,
        otp_hash VARCHAR(255) NOT NULL,
        purpose VARCHAR(50) NOT NULL,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        is_used BOOLEAN DEFAULT FALSE,
        attempts INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        token_hash VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
        actor_role VARCHAR(20),
        action VARCHAR(100) NOT NULL,
        target_id UUID,
        target_type VARCHAR(50),
        details JSONB,
        ip_address VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await client.query(`CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_otps_phone ON otps(phone);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_otps_expires ON otps(expires_at);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);`);

    // ── MDM & Active User Sessions (Max 3 Devices) ────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        device_id VARCHAR(255) NOT NULL,
        device_info VARCHAR(255),
        location VARCHAR(255),
        ip_address VARCHAR(50),
        refresh_token_hash VARCHAR(255),
        is_active BOOLEAN DEFAULT TRUE,
        is_revoked BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        revoked_at TIMESTAMP WITH TIME ZONE
      );
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON user_sessions(user_id, is_active, is_revoked);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_user_sessions_device ON user_sessions(device_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_id);`);

    await client.query(`
      CREATE TABLE IF NOT EXISTS notes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        content TEXT DEFAULT '',
        tags TEXT[] DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS interview_questions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        question TEXT NOT NULL,
        answer TEXT DEFAULT '',
        category VARCHAR(100) DEFAULT 'General',
        difficulty VARCHAR(20) DEFAULT 'medium',
        is_mastered BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await client.query(`CREATE INDEX IF NOT EXISTS idx_notes_user ON notes(user_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_iq_user ON interview_questions(user_id);`);

    await client.query(`
      CREATE TABLE IF NOT EXISTS portfolio_config (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
        config JSONB NOT NULL DEFAULT '{}',
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS resume_data (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
        data JSONB NOT NULL DEFAULT '{}',
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // ── Learning Tracker ─────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS learning_resources (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) DEFAULT 'course',
        url TEXT DEFAULT '',
        total_units INTEGER DEFAULT 0,
        completed_units INTEGER DEFAULT 0,
        status VARCHAR(20) DEFAULT 'active',
        notes TEXT DEFAULT '',
        tags TEXT[] DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_learning_user ON learning_resources(user_id);`);

    // ── Todo Board ────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT DEFAULT '',
        priority VARCHAR(10) DEFAULT 'medium',
        status VARCHAR(20) DEFAULT 'todo',
        due_date DATE,
        tags TEXT[] DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_todos_user ON todos(user_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_todos_status ON todos(status);`);

    // ── Bookmark Manager ─────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS bookmarks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        url TEXT NOT NULL,
        title VARCHAR(500) DEFAULT '',
        description TEXT DEFAULT '',
        favicon TEXT DEFAULT '',
        tags TEXT[] DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);`);

    // ── Project / Freelance Tracker ──────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        client VARCHAR(255) DEFAULT '',
        description TEXT DEFAULT '',
        status VARCHAR(30) DEFAULT 'active',
        start_date DATE,
        end_date DATE,
        rate NUMERIC(10,2) DEFAULT 0,
        rate_type VARCHAR(20) DEFAULT 'fixed',
        payment_status VARCHAR(30) DEFAULT 'pending',
        total_amount NUMERIC(10,2) DEFAULT 0,
        tech_stack TEXT[] DEFAULT '{}',
        invoice_data JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_projects_user ON projects(user_id);`);

    // ── Notifications System ─────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'Info',
        for_role VARCHAR(50),
        performed_by VARCHAR(100),
        source_type VARCHAR(100),
        metadata_json JSONB DEFAULT '{}',
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_notifications_user_isread ON notifications(user_id, is_read);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON notifications(user_id, created_at DESC);`);

    // Device Push Tokens for FCM
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_push_tokens (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        push_token TEXT NOT NULL UNIQUE,
        device_type VARCHAR(20) DEFAULT 'WEB',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_user_push_tokens_user ON user_push_tokens(user_id);`);

    // User Notification Preferences
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_notification_settings (
        user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        training_assigned BOOLEAN DEFAULT TRUE,
        training_completed BOOLEAN DEFAULT TRUE,
        deadline_reminders BOOLEAN DEFAULT TRUE,
        weekly_summary BOOLEAN DEFAULT FALSE,
        compliance_alerts BOOLEAN DEFAULT TRUE,
        system_updates BOOLEAN DEFAULT FALSE,
        security_alerts BOOLEAN DEFAULT TRUE,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await client.query('COMMIT');
    console.log('✅ Database tables created/updated successfully');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Database migration error:', err.message);
    throw err;
  } finally {
    client.release();
    if (closePool) {
      await pool.end();
    }
  }
};

if (require.main === module) {
  setup(true).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { setup };
