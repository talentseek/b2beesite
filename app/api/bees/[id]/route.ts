import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

function resolveCurrency(request: NextRequest): 'USD' | 'GBP' | 'EUR' {
  const qp = request.nextUrl.searchParams.get('currency')?.toUpperCase()
  const cookie = request.cookies.get('currencyPreference')?.value?.toUpperCase()
  const c = (qp || cookie) as 'USD' | 'GBP' | 'EUR' | undefined
  return c === 'GBP' || c === 'EUR' || c === 'USD' ? c : 'USD'
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Fetching bee with ID:', params.id)
    const currency = resolveCurrency(request)
    const result = await pool.query(
      `
      SELECT 
        b.id,
        b.name,
        b.role,
        b.description,
        b.image_url,
        b.created_at,
        COALESCE(p_curr.amount, p_usd.amount) AS display_price,
        CASE WHEN p_curr.amount IS NOT NULL THEN $2 ELSE 'USD' END AS display_currency
      FROM bees b
      LEFT JOIN bee_prices p_curr ON p_curr.bee_id = b.id AND p_curr.currency_code = $2
      LEFT JOIN bee_prices p_usd  ON p_usd.bee_id  = b.id AND p_usd.currency_code  = 'USD'
      WHERE b.id = $1 AND b.is_active = true
      `,
      [params.id, currency]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Bee not found' },
        { status: 404 }
      )
    }

    const bee = result.rows[0]
    console.log('Bee found:', bee.name)

    // Attach all prices for admin edit usage
    const pricesRes = await pool.query(
      `SELECT currency_code, amount FROM bee_prices WHERE bee_id = $1`,
      [params.id]
    )
    const prices: Record<string, number> = {}
    for (const row of pricesRes.rows) {
      prices[row.currency_code] = row.amount
    }
    ;(bee as any).prices = prices

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
    const body = await request.json()
    const { name, role, description, image_url, is_active } = body
    const prices: Record<string, number | undefined> = body.prices || {
      USD: body.price_usd,
      GBP: body.price_gbp,
      EUR: body.price_eur,
    }
    
    // Validate required fields
    if (!name || !role || !description) {
      return NextResponse.json(
        { error: 'Name, role, and description are required' },
        { status: 400 }
      )
    }
    
    const result = await pool.query(
      'UPDATE bees SET name = $1, role = $2, description = $3, image_url = $4, is_active = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING id',
      [name, role, description, image_url || null, is_active !== false, params.id]
    )
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Bee not found' },
        { status: 404 }
      )
    }
    
    const beeId = result.rows[0].id

    // Upsert prices
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
      const paramsUpsert = [beeId, ...entries.flat()]
      await pool.query(
        `INSERT INTO bee_prices (bee_id, currency_code, amount)
         VALUES ${valuesSql}
         ON CONFLICT (bee_id, currency_code) DO UPDATE SET amount = EXCLUDED.amount`,
        paramsUpsert
      )
    }

    return NextResponse.json({ bee: { id: beeId } })
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
    const result = await pool.query(
      'UPDATE bees SET is_active = false WHERE id = $1 RETURNING *',
      [params.id]
    )
    
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