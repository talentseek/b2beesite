import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Fetching bee with ID:', params.id)

    const result = await sql`
      SELECT id, name, role, description, price, image_url, created_at
      FROM bees 
      WHERE id = ${params.id}
    `

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Bee not found' },
        { status: 404 }
      )
    }

    const bee = result.rows[0]
    console.log('Bee found:', bee.name)

    return NextResponse.json({ bee })

  } catch (error) {
    console.error('Error fetching bee:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bee' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, role, description, price, image_url, is_active } = await request.json()
    
    // Validate required fields
    if (!name || !role || !description) {
      return NextResponse.json(
        { error: 'Name, role, and description are required' },
        { status: 400 }
      )
    }
    
    const result = await sql`
      UPDATE bees 
      SET name = ${name}, role = ${role}, description = ${description}, price = ${price || null}, image_url = ${image_url || null}, is_active = ${is_active !== false}
      WHERE id = ${params.id}
      RETURNING *
    `
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Bee not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ bee: result.rows[0] })
  } catch (error) {
    console.error('Error updating bee:', error)
    return NextResponse.json(
      { error: 'Failed to update bee' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await sql`
      UPDATE bees 
      SET is_active = false
      WHERE id = ${params.id}
      RETURNING *
    `
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Bee not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ message: 'Bee deleted successfully' })
  } catch (error) {
    console.error('Error deleting bee:', error)
    return NextResponse.json(
      { error: 'Failed to delete bee' },
      { status: 500 }
    )
  }
} 