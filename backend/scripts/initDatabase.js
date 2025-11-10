const { pool } = require('../config/database');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database...');
    
    // Read the schema file
    const schemaPath = path.join(__dirname, '../config/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute the schema
    await pool.query(schema);
    
    console.log('✅ Database initialized successfully!');
    console.log('📋 Created tables: users, otps');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase();
