require('dotenv').config();
const { pool } = require('./config/database');

async function testDatabase() {
  console.log('🔍 Testing database connection...');
  console.log('Configuration:');
  console.log('  Host:', process.env.DB_HOST);
  console.log('  Port:', process.env.DB_PORT);
  console.log('  Database:', process.env.DB_NAME);
  console.log('  User:', process.env.DB_USER);
  
  try {
    // Test basic connection
    console.log('\n1️⃣ Testing basic connection...');
    const client = await pool.connect();
    console.log('✅ Connection successful!');
    
    // Test query
    console.log('\n2️⃣ Testing simple query...');
    const result = await client.query('SELECT NOW()');
    console.log('✅ Query successful:', result.rows[0]);
    
    // List all tables
    console.log('\n3️⃣ Listing all tables...');
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('📋 Tables found:', tables.rows.length);
    tables.rows.forEach(row => {
      console.log('   -', row.table_name);
    });
    
    // Check if our tables exist
    console.log('\n4️⃣ Checking required tables...');
    const checkUsers = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    console.log('   users table exists:', checkUsers.rows[0].exists);
    
    const checkOtps = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'otps'
      );
    `);
    console.log('   otps table exists:', checkOtps.rows[0].exists);
    
    client.release();
    console.log('\n✅ All tests passed!');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

testDatabase();
