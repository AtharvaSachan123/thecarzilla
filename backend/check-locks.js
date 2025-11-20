require('dotenv').config();
const { pool } = require('./config/database');

async function checkLocks() {
  console.log('🔍 Checking for database locks and table structure...\n');
  
  try {
    const client = await pool.connect();
    
    // Check table structure
    console.log('📋 OTPs table structure:');
    const structure = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'otps'
      ORDER BY ordinal_position;
    `);
    console.table(structure.rows);
    
    // Check for locks
    console.log('\n🔒 Checking for locks:');
    const locks = await client.query(`
      SELECT 
        l.locktype,
        l.relation::regclass,
        l.mode,
        l.granted,
        a.usename,
        a.query,
        a.state
      FROM pg_locks l
      JOIN pg_stat_activity a ON l.pid = a.pid
      WHERE l.relation = 'otps'::regclass;
    `);
    
    if (locks.rows.length > 0) {
      console.log('⚠️  Found locks on otps table:');
      console.table(locks.rows);
    } else {
      console.log('✅ No locks found on otps table');
    }
    
    // Check row count
    console.log('\n📊 Checking row count:');
    const count = await client.query('SELECT COUNT(*) FROM otps');
    console.log('   Rows in otps table:', count.rows[0].count);
    
    // Try a simple DELETE
    console.log('\n🧪 Testing DELETE query...');
    const deleteResult = await client.query(
      `DELETE FROM otps WHERE email = 'test@test.com' RETURNING *`
    );
    console.log('✅ DELETE successful, rows affected:', deleteResult.rowCount);
    
    client.release();
    console.log('\n✅ All checks passed!');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

checkLocks();
