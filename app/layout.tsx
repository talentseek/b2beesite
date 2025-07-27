import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import Image from 'next/image'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'B2BEE - AI Support',
  description: 'B2BEE helps small businesses work smarter, faster and at a fraction of the cost – with AI solutions that never stop buzzing.',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'B2BEE - AI Support',
    description: 'B2BEE helps small businesses work smarter, faster and at a fraction of the cost – with AI solutions that never stop buzzing.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'B2BEE Logo',
      },
    ],
    type: 'website',
    siteName: 'B2BEE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'B2BEE - AI Support',
    description: 'B2BEE helps small businesses work smarter, faster and at a fraction of the cost – with AI solutions that never stop buzzing.',
    images: ['/logo.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}