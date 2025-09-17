'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

import { Bee } from '@/lib/types'

export default function BeesManagement() {
  const [bees, setBees] = useState<Bee[]>([])
  const [loading, setLoading] = useState(true)
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({})

  useEffect(() => {
    fetchBees()
  }, [])

  const fetchBees = async () => {
    try {
      const response = await fetch('/api/bees')
      if (response.ok) {
        const data = await response.json()
        setBees(data || [])
      }
    } catch (error) {
      console.error('Error fetching bees:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this bee?')) return

    try {
      const response = await fetch(`/api/bees/slug/${slug}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchBees()
      } else {
        alert('Failed to delete bee')
      }
    } catch (error) {
      console.error('Error deleting bee:', error)
      alert('Failed to delete bee')
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
            Loading bees...
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
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 'clamp(16px, 3vw, 24px)'
      }}>
        <h1 style={{
          fontSize: 'clamp(24px, 5vw, 32px)',
          fontWeight: 'bold',
          color: 'white',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
          margin: '0'
        }}>
          Busy Bees Management
        </h1>
        
        <Link href="/admin/bees/new">
          <Button 
            style={{
              background: '#fe8a00',
              color: 'white',
              border: 'none',
              padding: 'clamp(12px, 2vw, 16px) clamp(24px, 4vw, 32px)',
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
            Add New Bee
          </Button>
        </Link>
      </div>



      {/* Bees Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 'clamp(20px, 4vw, 32px)'
      }}>
        {bees.map((bee) => (
          <div key={bee.id} style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            overflow: 'hidden',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)'
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.25)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.15)'
          }}>
            <div style={{
              position: 'relative',
              width: '100%',
              height: '200px',
              overflow: 'hidden'
            }}>
              {bee.imageUrl && !imageErrors[bee.slug] ? (
                <Image
                  src={bee.imageUrl}
                  alt={bee.name}
                  fill
                  style={{
                    objectFit: 'cover'
                  }}
                  onError={() => setImageErrors(prev => ({ ...prev, [bee.slug]: true }))}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '60px'
                }}>
                  🐝
                </div>
              )}
            </div>
            
            <div style={{
              padding: 'clamp(20px, 4vw, 24px)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(8px, 2vw, 12px)'
            }}>
              <h3 style={{
                fontSize: 'clamp(18px, 4vw, 24px)',
                fontWeight: 'bold',
                color: '#2d3748',
                margin: '0'
              }}>
                {bee.name}
              </h3>
              <p style={{
                fontSize: 'clamp(14px, 3vw, 16px)',
                fontWeight: '600',
                color: '#fe8a00',
                margin: '0'
              }}>
                {bee.role}
              </p>
              
              {/* Status Badge */}
              <div style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'uppercase',
                marginBottom: '8px',
                backgroundColor: bee.status === 'ACTIVE' ? '#10B981' : bee.status === 'INACTIVE' ? '#F59E0B' : '#6B7280',
                color: 'white'
              }}>
                {bee.status}
              </div>
              
              {bee.tagline && (
                <p style={{
                  fontSize: 'clamp(14px, 3vw, 16px)',
                  color: '#4A5568',
                  fontStyle: 'italic',
                  margin: '0 0 8px 0'
                }}>
                  {bee.tagline}
                </p>
              )}
              
              <p style={{
                fontSize: 'clamp(14px, 3vw, 16px)',
                color: '#666',
                lineHeight: '1.5',
                margin: '0'
              }}>
                {bee.shortDescription || bee.description}
              </p>
              {(bee as any).display_price && (
                <p style={{
                  fontSize: 'clamp(18px, 4vw, 20px)',
                  fontWeight: 'bold',
                  color: '#fe8a00',
                  margin: '0'
                }}>
                  {(bee as any).display_currency === 'GBP' ? '£' : (bee as any).display_currency === 'EUR' ? '€' : '$'}
                  {(bee as any).display_price}/month
                </p>
              )}
              
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 'clamp(8px, 2vw, 12px)',
                marginTop: 'clamp(12px, 2vw, 16px)'
              }}>
                <Link href={`/admin/bees/${bee.slug}/edit`}>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: '#2d3748',
                      border: '2px solid #e2e8f0',
                      padding: 'clamp(8px, 1.5vw, 12px) clamp(16px, 3vw, 24px)',
                      borderRadius: '12px',
                      fontSize: 'clamp(12px, 2.5vw, 14px)',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
                      e.currentTarget.style.borderColor = '#fe8a00'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
                      e.currentTarget.style.borderColor = '#e2e8f0'
                    }}
                  >
                    Edit
                  </Button>
                </Link>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDelete(bee.slug)}
                  style={{
                    background: '#e53e3e',
                    color: 'white',
                    border: 'none',
                    padding: 'clamp(8px, 1.5vw, 12px) clamp(16px, 3vw, 24px)',
                    borderRadius: '12px',
                    fontSize: 'clamp(12px, 2.5vw, 14px)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
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
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {bees.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: 'clamp(40px, 8vw, 80px)',
          color: 'white'
        }}>
          <p style={{
            fontSize: 'clamp(18px, 4vw, 24px)',
            margin: '0',
            opacity: '0.9'
          }}>
            No bees added yet. Click "Add New Bee" to get started!
          </p>
        </div>
      )}
    </div>
  )
}