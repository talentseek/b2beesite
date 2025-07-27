'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'

const ADMIN_PASSWORD = 'b2beeadmin2025'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const authStatus = sessionStorage.getItem('b2bee-admin-auth')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      sessionStorage.setItem('b2bee-admin-auth', 'true')
      setError('')
    } else {
      setError('Incorrect password')
      setPassword('')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem('b2bee-admin-auth')
    setPassword('')
  }

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ea3e93 0%, #fe8a00 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '400px',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          padding: 'clamp(24px, 4vw, 32px)'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: 'clamp(24px, 4vw, 32px)'
          }}>
            <h1 style={{
              fontSize: 'clamp(24px, 5vw, 32px)',
              fontWeight: 'bold',
              color: '#2d3748',
              marginBottom: '8px'
            }}>
              B2Bee Admin
            </h1>
            <p style={{
              fontSize: 'clamp(14px, 3vw, 16px)',
              color: '#666',
              opacity: '0.8'
            }}>
              Secure Admin Access
            </p>
          </div>
          
          <form onSubmit={handleLogin} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(16px, 3vw, 24px)'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <label htmlFor="password" style={{
                fontSize: 'clamp(14px, 3vw, 16px)',
                fontWeight: '600',
                color: '#2d3748'
              }}>
                Password
              </label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                style={{
                  padding: 'clamp(12px, 2vw, 16px)',
                  fontSize: 'clamp(14px, 3vw, 16px)',
                  borderRadius: '12px',
                  border: '2px solid #e2e8f0',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#fe8a00'
                  e.target.style.boxShadow = '0 0 0 3px rgba(254, 138, 0, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>
            
            {error && (
              <p style={{
                color: '#e53e3e',
                fontSize: 'clamp(12px, 2.5vw, 14px)',
                textAlign: 'center',
                margin: '0'
              }}>
                {error}
              </p>
            )}
            
            <Button 
              type="submit" 
              style={{
                width: '100%',
                background: '#fe8a00',
                color: 'white',
                border: 'none',
                padding: 'clamp(12px, 2vw, 16px)',
                borderRadius: '12px',
                fontSize: 'clamp(14px, 3vw, 16px)',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e67a00'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fe8a00'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)'
              }}
            >
              Login
            </Button>
          </form>
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
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
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
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
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
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
            }}>
              Busy Bees
            </Link>
            <Button 
              onClick={handleLogout} 
              style={{
                background: '#e53e3e',
                color: 'white',
                border: 'none',
                padding: 'clamp(8px, 1.5vw, 12px) clamp(16px, 3vw, 24px)',
                borderRadius: '20px',
                fontSize: 'clamp(12px, 2.5vw, 14px)',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#c53030'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#e53e3e'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              Logout
            </Button>
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