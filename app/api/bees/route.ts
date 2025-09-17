import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'

// Validation schemas
const CreateBeeSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  tagline: z.string().optional(),
  role: z.string().min(1),
  status: z.enum(['ACTIVE', 'INACTIVE', 'DRAFT']),
  shortDescription: z.string().optional(),
  description: z.string().min(1),
  longDescription: z.string().optional(),
  imageUrl: z.string().optional(),
  features: z.any().optional(),
  integrations: z.any().optional(),
  roiModel: z.any().optional(),
  faqs: z.any().optional(),
  demoAssets: z.any().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoOgImage: z.string().optional(),
  prices: z.record(z.number()).optional(),
  usagePricing: z.record(z.object({
    usageType: z.string(),
    ratePerUnit: z.number(),
    unitDescription: z.string()
  })).optional()
})

const UpdateBeeSchema = CreateBeeSchema.extend({
  id: z.number()
})

// GET - Fetch all active bees
export async function GET() {
  try {
    const bees = await prisma.bee.findMany({
      where: { isActive: true },
      include: {
        prices: true,
        usagePricing: true
      },
      orderBy: { createdAt: 'desc' }
    })

    // Transform data to match expected format
    const transformedBees = bees.map(bee => ({
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
    }))

    return NextResponse.json(transformedBees)
  } catch (error) {
    console.error('Error fetching bees:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bees' },
      { status: 500 }
    )
  }
}

  // POST - Create a new bee (Admin only)
  export async function POST(request: NextRequest) {
    try {
      // Check if user is authenticated
      const { userId } = await auth()
      
      if (!userId) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }

    const body = await request.json()
    const validatedData = CreateBeeSchema.parse(body)

    // Create the bee with related data
    const bee = await prisma.bee.create({
      data: {
        slug: validatedData.slug,
        name: validatedData.name,
        tagline: validatedData.tagline,
        role: validatedData.role,
        status: validatedData.status,
        shortDescription: validatedData.shortDescription,
        description: validatedData.description,
        longDescription: validatedData.longDescription,
        imageUrl: validatedData.imageUrl,
        features: validatedData.features,
        integrations: validatedData.integrations,
        roiModel: validatedData.roiModel,
        faqs: validatedData.faqs,
        demoAssets: validatedData.demoAssets,
        seoTitle: validatedData.seoTitle,
        seoDescription: validatedData.seoDescription,
        seoOgImage: validatedData.seoOgImage,
        prices: {
          create: validatedData.prices ? Object.entries(validatedData.prices).map(([currency, amount]) => ({
            currencyCode: currency,
            amount: amount
          })) : []
        },
        usagePricing: {
          create: validatedData.usagePricing ? Object.entries(validatedData.usagePricing).map(([currency, data]) => ({
            currencyCode: currency,
            usageType: data.usageType,
            ratePerUnit: data.ratePerUnit,
            unitDescription: data.unitDescription
          })) : []
        }
      },
      include: {
        prices: true,
        usagePricing: true
      }
    })

    return NextResponse.json(bee, { status: 201 })
  } catch (error) {
    console.error('Error creating bee:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    if (error instanceof Error && error.message === 'Admin access required') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create bee' },
      { status: 500 }
    )
  }
}

  // PUT - Update an existing bee (Admin only)
  export async function PUT(request: NextRequest) {
    try {
      // Check if user is authenticated
      const { userId } = await auth()
      
      if (!userId) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }

    const body = await request.json()
    const validatedData = UpdateBeeSchema.parse(body)

    // Update the bee with related data
    const bee = await prisma.bee.update({
      where: { id: validatedData.id },
      data: {
        slug: validatedData.slug,
        name: validatedData.name,
        tagline: validatedData.tagline,
        role: validatedData.role,
        status: validatedData.status,
        shortDescription: validatedData.shortDescription,
        description: validatedData.description,
        longDescription: validatedData.longDescription,
        imageUrl: validatedData.imageUrl,
        features: validatedData.features,
        integrations: validatedData.integrations,
        roiModel: validatedData.roiModel,
        faqs: validatedData.faqs,
        demoAssets: validatedData.demoAssets,
        seoTitle: validatedData.seoTitle,
        seoDescription: validatedData.seoDescription,
        seoOgImage: validatedData.seoOgImage,
        prices: {
          deleteMany: {},
          create: validatedData.prices ? Object.entries(validatedData.prices).map(([currency, amount]) => ({
            currencyCode: currency,
            amount: amount
          })) : []
        },
        usagePricing: {
          deleteMany: {},
          create: validatedData.usagePricing ? Object.entries(validatedData.usagePricing).map(([currency, data]) => ({
            currencyCode: currency,
            usageType: data.usageType,
            ratePerUnit: data.ratePerUnit,
            unitDescription: data.unitDescription
          })) : []
        }
      },
      include: {
        prices: true,
        usagePricing: true
      }
    })

    return NextResponse.json(bee)
  } catch (error) {
    console.error('Error updating bee:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    if (error instanceof Error && error.message === 'Admin access required') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update bee' },
      { status: 500 }
    )
  }
}

  // DELETE - Soft delete a bee (Admin only)
  export async function DELETE(request: NextRequest) {
    try {
      // Check if user is authenticated
      const { userId } = await auth()
      
      if (!userId) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Bee ID is required' },
        { status: 400 }
      )
    }

    await prisma.bee.update({
      where: { id: parseInt(id) },
      data: { isActive: false }
    })

    return NextResponse.json({ message: 'Bee deleted successfully' })
  } catch (error) {
    console.error('Error deleting bee:', error)
    
    if (error instanceof Error && error.message === 'Admin access required') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete bee' },
      { status: 500 }
    )
  }
} 