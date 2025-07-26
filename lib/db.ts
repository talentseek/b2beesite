import { Pool } from 'pg'

// Database configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
})

// Test the connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database')
})

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

// Test connection function
export async function testConnection() {
  try {
    const client = await pool.connect()
    console.log('✅ Database connection successful!')
    client.release()
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return false
  }
}

export default pool 