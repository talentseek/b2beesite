'use client'

import Image from 'next/image'
import { useEffect } from 'react'
import EmailSubscription from '@/components/EmailSubscription'
import Link from 'next/link'

export default function Home() {
  useEffect(() => {
    // Track page view
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'page_view',
        eventData: { page: 'coming-soon' }
      })
    })
  }, [])

  const handleSocialClick = (platform: string) => {
    // Track social media clicks
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'social_click',
        eventData: { platform }
      })
    })
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fb923c 0%, #ea580c 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      color: 'white',
      position: 'relative'
    }}>
      {/* Busy Bees Badge */}
      <Link 
        href="/bees" 
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: 'clamp(8px, 2vw, 12px) clamp(16px, 3vw, 24px)',
          borderRadius: '25px',
          textDecoration: 'none',
          fontSize: 'clamp(14px, 2.5vw, 16px)',
          fontWeight: '600',
          boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
          transition: 'all 0.3s ease',
          zIndex: 10,
          border: '2px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)'
          e.currentTarget.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.6)'
          e.currentTarget.style.border = '2px solid rgba(255, 255, 255, 0.4)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)'
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)'
          e.currentTarget.style.border = '2px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        🐝 Check Out Our Busy Bees
      </Link>
      <div style={{ position: 'relative', display: 'inline-block', marginBottom: '2rem' }}>
        <Image
          src="/newbuzz.png"
          alt="B2BEE Logo"
          width={400}
          height={400}
          priority
          style={{
            transition: 'transform 0.3s ease-in-out',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
          }}
        />
        <Link 
          href="/chat" 
          style={{
            position: 'absolute',
            top: '75%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            color: '#ea580c',
            fontWeight: '600',
            padding: '12px 24px',
            borderRadius: '9999px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            textDecoration: 'none',
            transition: 'all 0.3s ease-in-out'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#ea580c'
            e.currentTarget.style.color = 'white'
            e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white'
            e.currentTarget.style.color = '#ea580c'
            e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'
          }}
        >
          Talk to Buzz
        </Link>
      </div>
      
      <div style={{ maxWidth: '64rem', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{
          fontSize: 'clamp(2.25rem, 5vw, 3rem)',
          fontWeight: 'bold',
          marginBottom: '1rem',
          lineHeight: '1.2',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
        }}>
          Buzzing Into Business – AI Support Coming Soon!
        </h1>
        
        <h2 style={{
          fontSize: 'clamp(1.125rem, 2.5vw, 1.25rem)',
          marginBottom: '2rem',
          fontWeight: '500',
          opacity: '0.95',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
        }}>
          At B2BEE, we help small businesses work smarter, faster and at a fraction of the cost – with AI solutions that never stop buzzing.
        </h2>
        
        <div style={{
          width: '4rem',
          height: '4px',
          backgroundColor: 'white',
          margin: '2rem auto',
          borderRadius: '9999px'
        }}></div>
        
        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{
            fontSize: 'clamp(1.5rem, 3vw, 1.875rem)',
            fontWeight: 'bold',
            marginBottom: '1rem',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            What We Do
          </h3>
          <p style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            marginBottom: '0.5rem',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            Why build a whole hive of staff when AI can do the work?
          </p>
          <p style={{
            fontSize: '1rem',
            marginBottom: '1.5rem',
            opacity: '0.9',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            Let B2BEE be your busy bee, taking care of:
          </p>
          
          <ul style={{
            listStyle: 'none',
            padding: '0',
            margin: '0 0 2rem 0',
            textAlign: 'left',
            fontSize: '1rem',
            lineHeight: '1.6',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            <li style={{ padding: '12px 0 12px 32px', borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>🐝 Inbound replies (email, Instagram, Facebook, phone)</li>
            <li style={{ padding: '12px 0 12px 32px', borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>🐝 Outbound campaigns that keep your brand buzzing</li>
            <li style={{ padding: '12px 0 12px 32px', borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>🐝 Reports and insights that help you stay ahead of the swarm</li>
            <li style={{ padding: '12px 0 12px 32px', borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>🐝 Account management, sales follow-ups and client care</li>
            <li style={{ padding: '12px 0 12px 32px' }}>🐝 Lead generation and reviving old leads</li>
          </ul>
          
          <p style={{
            fontSize: '1rem',
            textAlign: 'center',
            opacity: '0.9',
            fontStyle: 'italic',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            We create AI helpers that help your business bee more and do more – perfect for estate agents, trades, plumbers, salons, hospitality and other buzzing small businesses.
          </p>
        </div>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem'
        }}>
          <EmailSubscription />
          <p style={{
            fontSize: '0.875rem',
            opacity: '0.8',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            Follow us for updates
          </p>
          <div style={{
            display: 'flex',
            gap: '1.5rem',
            marginTop: '1rem'
          }}>
            <a 
              href="#" 
              style={{
                color: 'white',
                padding: '8px',
                borderRadius: '50%',
                transition: 'all 0.3s ease',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#fed7aa'
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'white'
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
              onClick={() => handleSocialClick('x')}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a 
              href="#" 
              style={{
                color: 'white',
                padding: '8px',
                borderRadius: '50%',
                transition: 'all 0.3s ease',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#fed7aa'
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'white'
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
              onClick={() => handleSocialClick('linkedin')}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a 
              href="#" 
              style={{
                color: 'white',
                padding: '8px',
                borderRadius: '50%',
                transition: 'all 0.3s ease',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#fed7aa'
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'white'
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
              onClick={() => handleSocialClick('instagram')}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
      
      <footer style={{
        marginTop: '4rem',
        padding: '1rem',
        textAlign: 'center',
        fontSize: '0.875rem',
        opacity: '0.9'
      }}>
        <p>&copy; 2024 B2BEE. All rights reserved.</p>
      </footer>
    </div>
  )
}
