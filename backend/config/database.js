const { Pool } = require('pg');

// PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// Test database connection
pool.on('connect', () => {
  console.log('✅ [DATABASE] Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ [DATABASE] Unexpected error on idle client:', err.message);
  console.error('Full error:', err);
  process.exit(-1);
});

// Log when queries are executed
const originalQuery = pool.query.bind(pool);
pool.query = function(...args) {
  console.log('🔍 [DATABASE] Executing query:', args[0]);
  return originalQuery(...args)
    .then(result => {
      console.log('✅ [DATABASE] Query successful, rows:', result.rowCount);
      return result;
    })
    .catch(err => {
      console.error('❌ [DATABASE] Query failed:', err.message);
      throw err;
    });
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
