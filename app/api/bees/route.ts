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
        b.name,
        b.role,
        b.description,
        b.image_url,
        b.created_at,
        COALESCE(p_curr.amount, p_usd.amount) AS display_price,
        CASE WHEN p_curr.amount IS NOT NULL THEN $1 ELSE 'USD' END AS display_currency
      FROM bees b
      LEFT JOIN bee_prices p_curr ON p_curr.bee_id = b.id AND p_curr.currency_code = $1
      LEFT JOIN bee_prices p_usd  ON p_usd.bee_id  = b.id AND p_usd.currency_code  = 'USD'
      WHERE b.is_active = true
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
    const { name, role, description, image_url } = body
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
      'INSERT INTO bees (name, role, description, price, image_url) VALUES ($1, $2, $3, NULL, $4) RETURNING id',
      [name, role, description, image_url || null]
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

    return NextResponse.json({ bee: { id: beeId } })
  } catch (error) {
    console.error('Error creating bee:', error)
    return NextResponse.json(
      { error: 'Failed to create bee' },
      { status: 500 }
    )
  }
} 