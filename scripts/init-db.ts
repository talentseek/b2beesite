import pool from '../lib/db'
import fs from 'fs'
import path from 'path'

async function initializeDatabase() {
  try {
    console.log('Initializing database...')
    
    // Read the schema file
    const schemaPath = path.join(process.cwd(), 'lib', 'schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')
    
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