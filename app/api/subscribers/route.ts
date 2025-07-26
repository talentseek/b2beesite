import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Get all subscribers ordered by creation date
    const result = await pool.query(
      'SELECT id, email, created_at, is_active FROM subscribers ORDER BY created_at DESC'
    )
    
    return NextResponse.json({
      subscribers: result.rows
    })
  } catch (error) {
    console.error('Error fetching subscribers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscribers' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Subscriber ID is required' },
        { status: 400 }
      )
    }

    // Soft delete by setting is_active to false
    await pool.query(
      'UPDATE subscribers SET is_active = false WHERE id = $1',
      [id]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting subscriber:', error)
    return NextResponse.json(
      { error: 'Failed to delete subscriber' },
      { status: 500 }
    )
  }
} 