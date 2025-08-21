import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

function resolveCurrency(request: NextRequest): 'USD' | 'GBP' | 'EUR' {
  const qp = request.nextUrl.searchParams.get('currency')?.toUpperCase()
  const cookie = request.cookies.get('currencyPreference')?.value?.toUpperCase()
  const c = (qp || cookie) as 'USD' | 'GBP' | 'EUR' | undefined
  return c === 'GBP' || c === 'EUR' || c === 'USD' ? c : 'USD'
}

export async function GET(request: NextRequest) {
  try {
    const currency = resolveCurrency(request)

    const result = await pool.query(
      `
      SELECT 
        b.id,
        b.slug,
        b.name,
        b.tagline,
        b.role,
        b.status,
        b.short_description,
        b.description,
        b.long_description,
        b.image_url,
        b.features,
        b.integrations,
        b.roi_model,
        b.faqs,
        b.demo_assets,
        b.seo_title,
        b.seo_description,
        b.seo_og_image,
        b.created_at,
        b.updated_at,
        COALESCE(p_curr.amount, p_usd.amount) AS display_price,
        CASE WHEN p_curr.amount IS NOT NULL THEN $1 ELSE 'USD' END AS display_currency
      FROM bees b
      LEFT JOIN bee_prices p_curr ON p_curr.bee_id = b.id AND p_curr.currency_code = $1
      LEFT JOIN bee_prices p_usd  ON p_usd.bee_id  = b.id AND p_usd.currency_code  = 'USD'
      WHERE b.status = 'active'
      ORDER BY b.created_at DESC
      `,
      [currency]
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
    const body = await request.json()
    const { 
      slug, 
      name, 
      tagline,
      role, 
      status = 'draft',
      short_description,
      description, 
      long_description,
      image_url,
      features,
      integrations,
      roi_model,
      faqs,
      demo_assets,
      seo_title,
      seo_description,
      seo_og_image
    } = body
    const prices: Record<string, number | undefined> = body.prices || {
      USD: body.price_usd,
      GBP: body.price_gbp,
      EUR: body.price_eur,
    }
    const usage_pricing = body.usage_pricing || {}
    
    // Validate required fields
    if (!slug || !name || !role || !description) {
      return NextResponse.json(
        { error: 'Slug, name, role, and description are required' },
        { status: 400 }
      )
    }

    const result = await pool.query(
      `INSERT INTO bees (
        slug, name, tagline, role, status, short_description, description, long_description, 
        image_url, features, integrations, roi_model, faqs, demo_assets, 
        seo_title, seo_description, seo_og_image
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING id`,
      [
        slug, name, tagline, role, status, short_description, description, long_description,
        image_url || null, 
        features ? JSON.stringify(features) : null,
        integrations ? JSON.stringify(integrations) : null,
        roi_model ? JSON.stringify(roi_model) : null,
        faqs ? JSON.stringify(faqs) : null,
        demo_assets ? JSON.stringify(demo_assets) : null,
        seo_title, seo_description, seo_og_image
      ]
    )

    const beeId = result.rows[0].id

    // Upsert provided prices (integers only)
    const entries: Array<[string, number]> = []
    for (const code of ['USD', 'GBP', 'EUR']) {
      const amt = prices[code]
      if (amt !== undefined && amt !== null && !Number.isNaN(Number(amt))) {
        entries.push([code, Math.round(Number(amt))])
      }
    }

    if (entries.length > 0) {
      const valuesSql = entries
        .map((_, i) => `($1, $${i * 2 + 2}, $${i * 2 + 3})`)
        .join(',')
      const params = [beeId, ...entries.flat()]
      await pool.query(
        `INSERT INTO bee_prices (bee_id, currency_code, amount)
         VALUES ${valuesSql}
         ON CONFLICT (bee_id, currency_code) DO UPDATE SET amount = EXCLUDED.amount`,
        params
      )
    }

    // Insert usage pricing if provided
    const usageEntries: Array<[string, any]> = []
    for (const [currency, usage] of Object.entries(usage_pricing)) {
      if (usage && usage.usage_type && usage.rate_per_unit && usage.unit_description) {
        usageEntries.push([currency, usage])
      }
    }

    if (usageEntries.length > 0) {
      const usageValuesSql = usageEntries
        .map((_, i) => `($1, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4}, $${i * 4 + 5})`)
        .join(',')
      const usageParams = [beeId, ...usageEntries.flatMap(([currency, usage]) => [
        currency, usage.usage_type, usage.rate_per_unit, usage.unit_description
      ])]
      await pool.query(
        `INSERT INTO bee_usage_pricing (bee_id, currency_code, usage_type, rate_per_unit, unit_description)
         VALUES ${usageValuesSql}
         ON CONFLICT (bee_id, currency_code, usage_type) DO UPDATE SET 
         rate_per_unit = EXCLUDED.rate_per_unit, unit_description = EXCLUDED.unit_description`,
        usageParams
      )
    }

    return NextResponse.json({ bee: { id: beeId } })
  } catch (error) {
    console.error('Error creating bee:', error)
    return NextResponse.json(
      { error: 'Failed to create bee' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      id,
      slug, 
      name, 
      tagline,
      role, 
      status = 'draft',
      short_description,
      description, 
      long_description,
      image_url,
      features,
      integrations,
      roi_model,
      faqs,
      demo_assets,
      seo_title,
      seo_description,
      seo_og_image
    } = body
    const prices: Record<string, number | undefined> = body.prices || {
      USD: body.price_usd,
      GBP: body.price_gbp,
      EUR: body.price_eur,
    }
    const usage_pricing = body.usage_pricing || {}
    
    // Validate required fields
    if (!id || !slug || !name || !role || !description) {
      return NextResponse.json(
        { error: 'ID, slug, name, role, and description are required' },
        { status: 400 }
      )
    }

    // Update bee
    await pool.query(
      `UPDATE bees SET 
        slug = $1, name = $2, tagline = $3, role = $4, status = $5, 
        short_description = $6, description = $7, long_description = $8,
        image_url = $9, features = $10, integrations = $11, roi_model = $12, 
        faqs = $13, demo_assets = $14, seo_title = $15, seo_description = $16, 
        seo_og_image = $17, updated_at = NOW()
       WHERE id = $18`,
      [
        slug, name, tagline, role, status, short_description, description, long_description,
        image_url || null, 
        features ? JSON.stringify(features) : null,
        integrations ? JSON.stringify(integrations) : null,
        roi_model ? JSON.stringify(roi_model) : null,
        faqs ? JSON.stringify(faqs) : null,
        demo_assets ? JSON.stringify(demo_assets) : null,
        seo_title, seo_description, seo_og_image, id
      ]
    )

    // Upsert provided prices (integers only)
    const entries: Array<[string, number]> = []
    for (const code of ['USD', 'GBP', 'EUR']) {
      const amt = prices[code]
      if (amt !== undefined && amt !== null && !Number.isNaN(Number(amt))) {
        entries.push([code, Math.round(Number(amt))])
      }
    }

    if (entries.length > 0) {
      const valuesSql = entries
        .map((_, i) => `($1, $${i * 2 + 2}, $${i * 2 + 3})`)
        .join(',')
      const params = [id, ...entries.flat()]
      await pool.query(
        `INSERT INTO bee_prices (bee_id, currency_code, amount)
         VALUES ${valuesSql}
         ON CONFLICT (bee_id, currency_code) DO UPDATE SET amount = EXCLUDED.amount`,
        params
      )
    }

    // Insert usage pricing if provided
    const usageEntries: Array<[string, any]> = []
    for (const [currency, usage] of Object.entries(usage_pricing)) {
      if (usage && usage.usage_type && usage.rate_per_unit && usage.unit_description) {
        usageEntries.push([currency, usage])
      }
    }

    if (usageEntries.length > 0) {
      const usageValuesSql = usageEntries
        .map((_, i) => `($1, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4}, $${i * 4 + 5})`)
        .join(',')
      const usageParams = [id, ...usageEntries.flatMap(([currency, usage]) => [
        currency, usage.usage_type, usage.rate_per_unit, usage.unit_description
      ])]
      await pool.query(
        `INSERT INTO bee_usage_pricing (bee_id, currency_code, usage_type, rate_per_unit, unit_description)
         VALUES ${usageValuesSql}
         ON CONFLICT (bee_id, currency_code, usage_type) DO UPDATE SET 
         rate_per_unit = EXCLUDED.rate_per_unit, unit_description = EXCLUDED.unit_description`,
        usageParams
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating bee:', error)
    return NextResponse.json(
      { error: 'Failed to update bee' },
      { status: 500 }
    )
  }
} 