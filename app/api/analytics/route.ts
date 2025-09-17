import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventType, eventData } = body

    // Get user agent and IP address
    const userAgent = request.headers.get('user-agent') || ''
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'

    // Insert analytics event using Prisma
    await prisma.pageAnalytics.create({
      data: {
        eventType,
        eventData,
        userAgent,
        ipAddress
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking analytics:', error)
    return NextResponse.json(
      { error: 'Failed to track analytics' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Get analytics summary
    const pageViews = await prisma.pageAnalytics.count({
      where: {
        eventType: 'page_view'
      }
    })
    
    const buttonClicks = await prisma.pageAnalytics.count({
      where: {
        eventType: 'button_click'
      }
    })
    
    const socialClicks = await prisma.pageAnalytics.count({
      where: {
        eventType: 'social_click'
      }
    })
    
    const totalSubscribers = await prisma.subscriber.count({
      where: {
        isActive: true
      }
    })

    return NextResponse.json({
      page_views: parseInt(pageViews.toString()),
      button_clicks: parseInt(buttonClicks.toString()),
      social_clicks: parseInt(socialClicks.toString()),
      total_subscribers: parseInt(totalSubscribers.toString())
    })

  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
} 