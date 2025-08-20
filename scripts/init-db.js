const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' })

// Database configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:e120fleB@neon-db.fly.dev:5432/b2bee',
  ssl: false, // Disable SSL for Fly.io compatibility
});

async function initializeDatabase() {
  try {
    console.log('🔌 Connecting to database...');
    
    // Test connection
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL database');
    
    // Read and execute schema
    const schemaPath = path.join(__dirname, '../lib/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📋 Executing schema...');
    await client.query(schema);
    console.log('✅ Database schema created successfully');
    
    // Insert some sample bees data
    console.log('🐝 Inserting sample bees data...');
    const sampleBees = [
      {
        name: 'Buzz Lightyear',
        role: 'Lead Sales Bee',
        description: 'Our top-performing sales bee with a passion for closing deals and building relationships. Buzz has a proven track record of exceeding targets and bringing in the honey.',
        price: 2500.00,
        image_url: '/uploads/buzz-lightyear.jpg'
      },
      {
        name: 'Honey Bee',
        role: 'Customer Support Specialist',
        description: 'A dedicated support bee who ensures every customer interaction is sweet and satisfying. Honey specializes in resolving issues quickly and maintaining high customer satisfaction.',
        price: 1800.00,
        image_url: '/uploads/honey-bee.jpg'
      },
      {
        name: 'Queen Bee',
        role: 'Account Manager',
        description: 'Our strategic account manager who oversees key client relationships and ensures long-term partnerships flourish. Queen Bee excels at account growth and retention.',
        price: 3200.00,
        image_url: '/uploads/queen-bee.jpg'
      },
      {
        name: 'Worker Bee',
        role: 'Data Analyst',
        description: 'A detail-oriented analyst who transforms raw data into actionable insights. Worker Bee helps optimize campaigns and improve performance through data-driven decisions.',
        price: 2200.00,
        image_url: '/uploads/worker-bee.jpg'
      },
      {
        name: 'Drone Bee',
        role: 'Marketing Specialist',
        description: 'Creative marketing bee who crafts compelling campaigns and drives brand awareness. Drone Bee specializes in digital marketing and content creation.',
        price: 2000.00,
        image_url: '/uploads/drone-bee.jpg'
      },
      {
        name: 'Guard Bee',
        role: 'Quality Assurance',
        description: 'Our vigilant QA bee who ensures every deliverable meets the highest standards. Guard Bee maintains quality control and process optimization.',
        price: 1900.00,
        image_url: '/uploads/guard-bee.jpg'
      }
    ];

    for (const bee of sampleBees) {
      await client.query(
        'INSERT INTO bees (name, role, description, price, image_url) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',
        [bee.name, bee.role, bee.description, bee.price, bee.image_url]
      );
    }
    console.log('✅ Sample bees data inserted successfully');
    
    // Insert a sample subscriber
    await client.query(
      'INSERT INTO subscribers (email, source) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      ['demo@b2bee.com', 'database-init']
    );
    console.log('✅ Sample subscriber data inserted');
    
    client.release();
    console.log('🎉 Database initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the initialization
initializeDatabase(); 