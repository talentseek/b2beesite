import { config } from 'dotenv'
import path from 'path'
import pool from '../lib/db'
import fs from 'fs'

// Load environment variables from .env.local
config({ path: path.join(process.cwd(), '.env.local') })

async function initializeDatabase() {
  try {
    console.log('Initializing database...')
    console.log('Database URL:', process.env.DATABASE_URL ? 'Set' : 'Not set')
    
    // Test connection first
    const client = await pool.connect()
    console.log('✅ Database connection successful!')
    client.release()
    
    // Read the schema file
    const schemaPath = path.join(process.cwd(), 'lib', 'schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')
    
    console.log('📝 Executing database schema...')
    
    // Execute the schema
    await pool.query(schema)
    
    console.log('✅ Database initialized successfully!')
    console.log('📊 Tables created:')
    console.log('   - subscribers (for email collection)')
    console.log('   - page_analytics (for tracking interactions)')
    console.log('   - Indexes and triggers created')
    
  } catch (error) {
    console.error('❌ Error initializing database:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

// Run the initialization
initializeDatabase() 