'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Analytics {
  page_views: number
  button_clicks: number
  social_clicks: number
  total_subscribers: number
}

interface Subscriber {
  id: number
  email: string
  created_at: string
  is_active: boolean
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [analyticsRes, subscribersRes] = await Promise.all([
        fetch('/api/analytics'),
        fetch('/api/subscribers')
      ])

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json()
        setAnalytics(analyticsData)
      }

      if (subscribersRes.ok) {
        const subscribersData = await subscribersRes.json()
        setSubscribers(subscribersData.subscribers || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        color: 'white'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <div style={{
              fontSize: '24px',
              animation: 'bounce 1.4s ease-in-out infinite both'
            }}>🐝</div>
            <div style={{
              fontSize: '24px',
              animation: 'bounce 1.4s ease-in-out infinite both 0.2s'
            }}>🐝</div>
            <div style={{
              fontSize: '24px',
              animation: 'bounce 1.4s ease-in-out infinite both 0.4s'
            }}>🐝</div>
          </div>
          <p style={{
            fontSize: 'clamp(16px, 3vw, 18px)',
            fontWeight: '500',
            opacity: '0.9'
          }}>
            Loading dashboard...
          </p>
        </div>
        
        <style jsx>{`
          @keyframes bounce {
            0%, 80%, 100% {
              transform: scale(0);
            }
            40% {
              transform: scale(1);
            }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'clamp(32px, 6vw, 48px)'
    }}>
      {/* Analytics Overview */}
      {analytics && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          padding: 'clamp(24px, 4vw, 32px)'
        }}>
          <h2 style={{
            fontSize: 'clamp(24px, 5vw, 32px)',
            fontWeight: 'bold',
            color: '#2d3748',
            marginBottom: 'clamp(24px, 4vw, 32px)',
            textAlign: 'center'
          }}>
            Analytics Overview
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'clamp(16px, 3vw, 24px)'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: 'clamp(20px, 4vw, 24px)',
              borderRadius: '15px',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}>
              <h3 style={{
                fontSize: 'clamp(14px, 3vw, 16px)',
                fontWeight: '600',
                marginBottom: '8px',
                opacity: '0.9'
              }}>
                Page Views
              </h3>
              <p style={{
                fontSize: 'clamp(28px, 5vw, 36px)',
                fontWeight: 'bold',
                margin: '0'
              }}>
                {analytics.page_views.toLocaleString()}
              </p>
            </div>
            
            <div style={{
              background: 'linear-gradient(135deg, #fe8a00 0%, #ea3e93 100%)',
              color: 'white',
              padding: 'clamp(20px, 4vw, 24px)',
              borderRadius: '15px',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}>
              <h3 style={{
                fontSize: 'clamp(14px, 3vw, 16px)',
                fontWeight: '600',
                marginBottom: '8px',
                opacity: '0.9'
              }}>
                Button Clicks
              </h3>
              <p style={{
                fontSize: 'clamp(28px, 5vw, 36px)',
                fontWeight: 'bold',
                margin: '0'
              }}>
                {analytics.button_clicks.toLocaleString()}
              </p>
            </div>
            
            <div style={{
              background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
              color: 'white',
              padding: 'clamp(20px, 4vw, 24px)',
              borderRadius: '15px',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}>
              <h3 style={{
                fontSize: 'clamp(14px, 3vw, 16px)',
                fontWeight: '600',
                marginBottom: '8px',
                opacity: '0.9'
              }}>
                Social Clicks
              </h3>
              <p style={{
                fontSize: 'clamp(28px, 5vw, 36px)',
                fontWeight: 'bold',
                margin: '0'
              }}>
                {analytics.social_clicks.toLocaleString()}
              </p>
            </div>
            
            <div style={{
              background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
              color: 'white',
              padding: 'clamp(20px, 4vw, 24px)',
              borderRadius: '15px',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}>
              <h3 style={{
                fontSize: 'clamp(14px, 3vw, 16px)',
                fontWeight: '600',
                marginBottom: '8px',
                opacity: '0.9'
              }}>
                Total Subscribers
              </h3>
              <p style={{
                fontSize: 'clamp(28px, 5vw, 36px)',
                fontWeight: 'bold',
                margin: '0'
              }}>
                {analytics.total_subscribers.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Email Subscribers */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
        padding: 'clamp(24px, 4vw, 32px)'
      }}>
        <h2 style={{
          fontSize: 'clamp(24px, 5vw, 32px)',
          fontWeight: 'bold',
          color: '#2d3748',
          marginBottom: 'clamp(24px, 4vw, 32px)',
          textAlign: 'center'
        }}>
          Email Subscribers ({subscribers.length})
        </h2>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          maxHeight: '400px',
          overflowY: 'auto'
        }}>
          {subscribers.map((subscriber) => (
            <div key={subscriber.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 'clamp(12px, 2vw, 16px)',
              borderBottom: '1px solid #e2e8f0',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f7fafc'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}>
              <p style={{
                fontWeight: '600',
                color: '#2d3748',
                fontSize: 'clamp(14px, 3vw, 16px)',
                margin: '0'
              }}>
                {subscriber.email}
              </p>
              <p style={{
                fontSize: 'clamp(12px, 2.5vw, 14px)',
                color: '#666',
                margin: '0'
              }}>
                {new Date(subscriber.created_at).toLocaleDateString()}
              </p>
              <p style={{
                fontSize: 'clamp(12px, 2.5vw, 14px)',
                color: subscriber.is_active ? '#48bb78' : '#e53e3e',
                fontWeight: '600',
                margin: '0'
              }}>
                {subscriber.is_active ? 'Active' : 'Inactive'}
              </p>
            </div>
          ))}
          
          {subscribers.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: 'clamp(32px, 6vw, 48px)',
              color: '#666'
            }}>
              <p style={{
                fontSize: 'clamp(16px, 3vw, 18px)',
                margin: '0'
              }}>
                No subscribers yet. Start promoting your newsletter!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}