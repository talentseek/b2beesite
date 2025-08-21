import { NextRequest, NextResponse } from 'next/server'

// Basic EU country list for EUR
const EU_COUNTRIES = new Set([
  'AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE'
])

function mapCountryToCurrency(country?: string): 'GBP' | 'EUR' | 'USD' {
  if (!country) return 'USD'
  const upper = country.toUpperCase()
  if (upper === 'GB' || upper === 'UK') return 'GBP'
  if (EU_COUNTRIES.has(upper)) return 'EUR'
  return 'USD'
}

export function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Try Vercel and Cloudflare headers first
  const country = req.headers.get('x-vercel-ip-country') || req.headers.get('cf-ipcountry') || undefined

  // Existing cookie wins unless missing
  const cookieCurrency = req.cookies.get('currencyPreference')?.value as 'GBP' | 'EUR' | 'USD' | undefined
  const detected = cookieCurrency || mapCountryToCurrency(country)

  // Persist currency choice
  res.cookies.set('currencyPreference', detected, { path: '/', httpOnly: false, sameSite: 'lax', maxAge: 60 * 60 * 24 * 365 })

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/upload).*)'],
}
