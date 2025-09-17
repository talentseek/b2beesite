'use client'

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { UserButton } from '@clerk/nextjs'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check')
        if (response.ok) {
          const data = await response.json()
          setIsAuthenticated(true)
          setUser(data.user)
        } else {
          window.location.href = '/sign-in?redirect=/admin'
        }
      } catch (error) {
        window.location.href = '/sign-in?redirect=/admin'
      }
    }
    
    checkAuth()
  }, [])

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ea3e93 0%, #fe8a00 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          color: 'white',
          fontSize: '18px',
          textAlign: 'center'
        }}>
          Loading...
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ea3e93 0%, #fe8a00 100%)'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        padding: 'clamp(16px, 3vw, 24px) clamp(20px, 4vw, 40px)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(12px, 2vw, 16px)'
          }}>
            <Link href="/" style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'white'
            }}>
              <Image
                src="/logo.png"
                alt="B2BEE Logo"
                width={32}
                height={32}
                style={{
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease'
                }}
              />
            </Link>
            <h1 style={{
              fontSize: 'clamp(20px, 4vw, 28px)',
              fontWeight: 'bold',
              color: 'white',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
            }}>
              B2Bee Admin Dashboard
            </h1>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(12px, 2vw, 16px)'
          }}>
            <Link href="/admin" style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              textDecoration: 'none',
              padding: 'clamp(8px, 1.5vw, 12px) clamp(16px, 3vw, 24px)',
              borderRadius: '20px',
              fontSize: 'clamp(12px, 2.5vw, 14px)',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}>
              Dashboard
            </Link>
            <Link href="/admin/bees" style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              textDecoration: 'none',
              padding: 'clamp(8px, 1.5vw, 12px) clamp(16px, 3vw, 24px)',
              borderRadius: '20px',
              fontSize: 'clamp(12px, 2.5vw, 14px)',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}>
              Busy Bees
            </Link>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: {
                    width: '32px',
                    height: '32px'
                  }
                }
              }}
            />
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: 'clamp(24px, 4vw, 40px) clamp(20px, 4vw, 40px)'
      }}>
        {children}
      </main>
    </div>
  )
}