const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
require("dotenv").config();

const { Pool } = require("pg");

const isProduction = process.env.NODE_ENV === "production";

// Support both standard cloud DATABASE_URL and separate credentials
const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl:
        process.env.DB_SSL === "false" ? false : { rejectUnauthorized: false },
      max: parseInt(process.env.DB_POOL_MAX || "20", 10),
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    }
  : {
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      database: process.env.DB_NAME || "Securepaydb",
      user: process.env.DB_USER || "postgres",
      password:
        process.env.DB_PASSWORD !== undefined
          ? String(process.env.DB_PASSWORD)
          : "postgres",
      ssl:
        isProduction && process.env.DB_SSL !== "false"
          ? { rejectUnauthorized: false }
          : false,
      max: parseInt(process.env.DB_POOL_MAX || "20", 10),
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    };

const pool = new Pool(poolConfig);

pool.on("error", (err) => {
  console.error("Unexpected database client error:", err.message);
});

const query = async (text, params) => {
  const res = await pool.query(text, params);
  return res;
};

module.exports = { pool, query };
