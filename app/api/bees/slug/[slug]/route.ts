import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    
    // Get currency preference from cookie
    const cookieHeader = request.headers.get('cookie') || ''
    const currencyMatch = cookieHeader.match(/currencyPreference=([^;]+)/)
    const currencyPreference = currencyMatch ? currencyMatch[1] : 'GBP'

    // Fetch bee with pricing information using Prisma
    const bee = await prisma.bee.findUnique({
      where: { slug },
      include: {
        prices: true,
        usagePricing: true
      }
    })
    
    if (!bee) {
      return NextResponse.json(
        { error: 'Bee not found' },
        { status: 404 }
      )
    }

    // Transform data to match expected format
    const transformedBee = {
      ...bee,
      prices: bee.prices.reduce((acc, price) => {
        acc[price.currencyCode] = price.amount
        return acc
      }, {} as Record<string, number>),
      usage_pricing: bee.usagePricing.reduce((acc, usage) => {
        acc[usage.currencyCode] = {
          usage_type: usage.usageType,
          rate_per_unit: usage.ratePerUnit,
          unit_description: usage.unitDescription
        }
        return acc
      }, {} as Record<string, any>)
    }

    return NextResponse.json(transformedBee)
    
  } catch (error) {
    console.error('Error fetching bee by slug:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Check if user is authenticated
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { slug } = params
    
    // Delete the bee and all related records using Prisma
    await prisma.bee.delete({
      where: { slug }
    })

    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Error deleting bee:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
