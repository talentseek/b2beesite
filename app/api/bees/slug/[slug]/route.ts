import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

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

    const client = await pool.connect()
    
    try {
      // Fetch bee with pricing information
      const beeQuery = `
        SELECT 
          b.*,
          bp.amount as display_price,
          bp.currency_code as display_currency,
          json_agg(
            DISTINCT jsonb_build_object(
              'currency_code', bp2.currency_code,
              'amount', bp2.amount
            )
          ) FILTER (WHERE bp2.currency_code IS NOT NULL) as prices,
          json_agg(
            DISTINCT jsonb_build_object(
              'currency_code', bup.currency_code,
              'usage_type', bup.usage_type,
              'rate_per_unit', bup.rate_per_unit,
              'unit_description', bup.unit_description
            )
          ) FILTER (WHERE bup.currency_code IS NOT NULL) as usage_pricing
        FROM bees b
        LEFT JOIN bee_prices bp ON b.id = bp.bee_id AND bp.currency_code = $1
        LEFT JOIN bee_prices bp2 ON b.id = bp2.bee_id
        LEFT JOIN bee_usage_pricing bup ON b.id = bup.bee_id
        WHERE b.slug = $2
        GROUP BY b.id, bp.amount, bp.currency_code
      `
      
      const beeResult = await client.query(beeQuery, [currencyPreference, slug])
      
      if (beeResult.rows.length === 0) {
        return NextResponse.json(
          { error: 'Bee not found' },
          { status: 404 }
        )
      }

      const bee = beeResult.rows[0]
      
      // Parse JSON fields
      if (bee.prices) {
        bee.prices = bee.prices.filter((price: any) => price.currency_code !== null)
      }
      if (bee.usage_pricing) {
        bee.usage_pricing = bee.usage_pricing.filter((usage: any) => usage.currency_code !== null)
      }
      
      // Parse other JSON fields
      if (bee.features) {
        bee.features = JSON.parse(bee.features)
      }
      if (bee.integrations) {
        bee.integrations = JSON.parse(bee.integrations)
      }
      if (bee.roi_model) {
        bee.roi_model = JSON.parse(bee.roi_model)
      }
      if (bee.faqs) {
        bee.faqs = JSON.parse(bee.faqs)
      }
      if (bee.demo_assets) {
        bee.demo_assets = JSON.parse(bee.demo_assets)
      }

      return NextResponse.json({ bee })
      
    } finally {
      client.release()
    }
    
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
    const { slug } = params
    
    const client = await pool.connect()
    
    try {
      // First get the bee ID from the slug
      const beeQuery = 'SELECT id FROM bees WHERE slug = $1'
      const beeResult = await client.query(beeQuery, [slug])
      
      if (beeResult.rows.length === 0) {
        return NextResponse.json(
          { error: 'Bee not found' },
          { status: 404 }
        )
      }

      const beeId = beeResult.rows[0].id

      // Delete related records first (foreign key constraints)
      await client.query('DELETE FROM bee_usage_pricing WHERE bee_id = $1', [beeId])
      await client.query('DELETE FROM bee_prices WHERE bee_id = $1', [beeId])
      
      // Delete the bee
      await client.query('DELETE FROM bees WHERE id = $1', [beeId])

      return NextResponse.json({ success: true })
      
    } finally {
      client.release()
    }
    
  } catch (error) {
    console.error('Error deleting bee:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
