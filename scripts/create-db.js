const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// First connect to the default database to create our new database
const defaultPool = new Pool({
  connectionString: 'postgresql://postgres:e120fleB@neon-db.fly.dev:5432/postgres',
  ssl: false,
});

async function createDatabase() {
  try {
    console.log('🔌 Connecting to default database...');
    
    const client = await defaultPool.connect();
    console.log('✅ Connected to default database');
    
    // Create the b2bee database
    console.log('📋 Creating b2bee database...');
    await client.query('CREATE DATABASE b2bee');
    console.log('✅ Database "b2bee" created successfully');
    
    client.release();
    await defaultPool.end();
    
    console.log('🎉 Database creation completed!');
    console.log('📝 Now run: node scripts/init-db.js');
    
  } catch (error) {
    if (error.code === '42P04') {
      console.log('ℹ️  Database "b2bee" already exists, proceeding to initialization...');
      await defaultPool.end();
      // Run the initialization script
      require('./init-db.js');
    } else {
      console.error('❌ Error creating database:', error);
      process.exit(1);
    }
  }
}

// Run the database creation
createDatabase();
