import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT * FROM bees WHERE is_active = true ORDER BY created_at DESC'
    )
    
    return NextResponse.json({ bees: result.rows })
  } catch (error) {
    console.error('Error fetching bees:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bees' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, role, description, price, image_url } = await request.json()
    
    // Validate required fields
    if (!name || !role || !description) {
      return NextResponse.json(
        { error: 'Name, role, and description are required' },
        { status: 400 }
      )
    }
    
    const result = await pool.query(
      'INSERT INTO bees (name, role, description, price, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, role, description, price || null, image_url || null]
    )
    
    return NextResponse.json({ bee: result.rows[0] })
  } catch (error) {
    console.error('Error creating bee:', error)
    return NextResponse.json(
      { error: 'Failed to create bee' },
      { status: 500 }
    )
  }
} 