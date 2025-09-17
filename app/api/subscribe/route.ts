import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

export const runtime = 'nodejs'

const SubscribeSchema = z.object({
  email: z.string().email(),
  source: z.string().optional().default('coming-soon-page'),
  beeId: z.number().optional(),
  useCaseSlug: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = SubscribeSchema.parse(body)

    // Check if subscriber already exists
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email: validatedData.email }
    })

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return NextResponse.json(
          { error: 'Email already subscribed' },
          { status: 400 }
        )
      } else {
        // Reactivate existing subscriber
        await prisma.subscriber.update({
          where: { email: validatedData.email },
          data: { 
            isActive: true,
            source: validatedData.source,
            beeId: validatedData.beeId,
            useCaseSlug: validatedData.useCaseSlug
          }
        })
        
        return NextResponse.json({ 
          message: 'Subscription reactivated successfully' 
        })
      }
    }

    // Create new subscriber
    await prisma.subscriber.create({
      data: {
        email: validatedData.email,
        source: validatedData.source,
        beeId: validatedData.beeId,
        useCaseSlug: validatedData.useCaseSlug
      }
    })

    return NextResponse.json({ 
      message: 'Subscription successful' 
    }, { status: 201 })

  } catch (error) {
    console.error('Subscription error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const result = await prisma.subscriber.count({
      where: { isActive: true }
    })
    
    return NextResponse.json({
      total_subscribers: result
    })
  } catch (error) {
    console.error('Error fetching subscriber count:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscriber count' },
      { status: 500 }
    )
  }
} 