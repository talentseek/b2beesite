import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { eventType, eventData } = await request.json()
    const userAgent = request.headers.get('user-agent') || ''
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'

    // Validate event type
    const validEventTypes = ['page_view', 'button_click', 'social_click', 'email_subscription']
    if (!validEventTypes.includes(eventType)) {
      return NextResponse.json(
        { error: 'Invalid event type' },
        { status: 400 }
      )
    }

    // Insert analytics event
    await pool.query(
      'INSERT INTO page_analytics (event_type, event_data, user_agent, ip_address) VALUES ($1, $2, $3, $4)',
      [eventType, JSON.stringify(eventData), userAgent, ipAddress]
    )

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to log analytics event' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Get analytics summary
    const pageViews = await pool.query(
      "SELECT COUNT(*) as count FROM page_analytics WHERE event_type = 'page_view'"
    )
    
    const buttonClicks = await pool.query(
      "SELECT COUNT(*) as count FROM page_analytics WHERE event_type = 'button_click'"
    )
    
    const socialClicks = await pool.query(
      "SELECT COUNT(*) as count FROM page_analytics WHERE event_type = 'social_click'"
    )
    
    const totalSubscribers = await pool.query(
      'SELECT COUNT(*) as count FROM subscribers WHERE is_active = true'
    )

    return NextResponse.json({
      page_views: parseInt(pageViews.rows[0].count),
      button_clicks: parseInt(buttonClicks.rows[0].count),
      social_clicks: parseInt(socialClicks.rows[0].count),
      total_subscribers: parseInt(totalSubscribers.rows[0].count)
    })

  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
} 