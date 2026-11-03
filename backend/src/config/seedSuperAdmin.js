const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();

const bcrypt = require('bcryptjs');
const { pool, query } = require('./database');

const seed = async (closePool = false) => {
  const phone = process.env.SUPER_ADMIN_PHONE || '+917991234567';
  const password = process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin@123';
  const name = process.env.SUPER_ADMIN_NAME || 'Shivakumar Admin';

  try {
    const existing = await query('SELECT id, role FROM users WHERE phone = $1', [phone]);
    if (existing.rows.length > 0) {
      if (existing.rows[0].role === 'super_admin') {
        console.log('ℹ️  Super admin user verified in database.');
      } else {
        await query("UPDATE users SET role = 'super_admin', updated_at = NOW() WHERE phone = $1", [phone]);
        console.log('✅ Existing user promoted to super_admin.');
      }
      if (closePool) await pool.end();
      return;
    }

    const hash = await bcrypt.hash(password, 12);
    await query(
      `INSERT INTO users (phone, password_hash, full_name, role, is_phone_verified)
       VALUES ($1, $2, $3, 'super_admin', TRUE)`,
      [phone, hash, name]
    );

    console.log('✅ Super admin created successfully:');
    console.log(`   Phone   : ${phone}`);
    console.log(`   Name    : ${name}`);
    console.log(`   Password: ${password}`);
  } catch (err) {
    console.error('❌ Super admin seeding error:', err.message);
  } finally {
    if (closePool) {
      await pool.end();
    }
  }
};

if (require.main === module) {
  seed(true).catch((err) => {
    console.error('❌', err.message);
    process.exit(1);
  });
}

module.exports = { seed };
