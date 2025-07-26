import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingSubscriber = await pool.query(
      'SELECT id FROM subscribers WHERE email = $1',
      [email]
    )

    if (existingSubscriber.rows.length > 0) {
      return NextResponse.json(
        { message: 'You are already subscribed! We\'ll notify you when we launch.' },
        { status: 200 }
      )
    }

    // Insert new subscriber
    const result = await pool.query(
      'INSERT INTO subscribers (email) VALUES ($1) RETURNING id, email, created_at',
      [email]
    )

    // Log analytics event
    await pool.query(
      'INSERT INTO page_analytics (event_type, event_data) VALUES ($1, $2)',
      ['email_subscription', JSON.stringify({ email, subscriber_id: result.rows[0].id })]
    )

    return NextResponse.json(
      { 
        message: 'Thank you for subscribing! We\'ll notify you when B2Bee launches.',
        subscriber: result.rows[0]
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT COUNT(*) as total_subscribers FROM subscribers WHERE is_active = true'
    )
    
    return NextResponse.json({
      total_subscribers: parseInt(result.rows[0].total_subscribers)
    })
  } catch (error) {
    console.error('Error fetching subscriber count:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscriber count' },
      { status: 500 }
    )
  }
} 