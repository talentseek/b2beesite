'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Bee {
  id: number
  name: string
  role: string
  description: string
  price: number | null
  image_url: string | null
  created_at: string
}

export default function BeesPage() {
  const [bees, setBees] = useState<Bee[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRole, setSelectedRole] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchBees()
  }, [])

  const fetchBees = async () => {
    try {
      const response = await fetch('/api/bees')
      if (response.ok) {
        const data = await response.json()
        setBees(data.bees || [])
      } else {
        console.error('Failed to fetch bees:', response.status)
      }
    } catch (error) {
      console.error('Error fetching bees:', error)
    } finally {
      setLoading(false)
    }
  }

  // Get unique roles for filter
  const roles = ['all', ...Array.from(new Set(bees.map(bee => bee.role)))]

  // Filter bees based on search and role
  const filteredBees = bees.filter(bee => {
    const matchesSearch = bee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bee.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === 'all' || bee.role === selectedRole
    return matchesSearch && matchesRole
  })

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ea3e93 0%, #fe8a00 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '32px'
        }}>
          <div style={{
            fontSize: '32px',
            animation: 'bounce 1.4s ease-in-out infinite both'
          }}>🐝</div>
          <div style={{
            fontSize: '32px',
            animation: 'bounce 1.4s ease-in-out infinite both 0.2s'
          }}>🐝</div>
          <div style={{
            fontSize: '32px',
            animation: 'bounce 1.4s ease-in-out infinite both 0.4s'
          }}>🐝</div>
        </div>
        <p style={{
          fontSize: '20px',
          fontWeight: '500',
          opacity: '0.9',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
        }}>
          Loading our busy bees...
        </p>
        
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
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ea3e93 0%, #fe8a00 100%)'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
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
            width={40}
            height={40}
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
        <Link href="/chat" style={{
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          textDecoration: 'none',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: '600',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
        }}>
          Chat with Buzz
        </Link>
      </div>

      {/* Hero Section */}
      <div style={{
        padding: 'clamp(40px, 8vw, 80px) clamp(20px, 4vw, 40px)',
        textAlign: 'center',
        color: 'white'
      }}>
        <h1 style={{
          fontSize: 'clamp(32px, 6vw, 48px)',
          marginBottom: '16px',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
          fontWeight: 'bold'
        }}>
          Meet Our Busy Bees
        </h1>
        <p style={{
          fontSize: 'clamp(16px, 3vw, 20px)',
          maxWidth: '600px',
          margin: '0 auto',
          opacity: '0.9',
          lineHeight: '1.5'
        }}>
          Choose the perfect AI assistant for your business needs. Each bee is specialized in different areas to help your business thrive.
        </p>
      </div>

      {/* Filters Section */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        padding: 'clamp(20px, 4vw, 32px)',
        margin: '0 clamp(20px, 4vw, 40px)',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <div style={{
          flex: '1',
          minWidth: '300px'
        }}>
          <input
            type="text"
            placeholder="Search bees by name, role, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '16px',
              transition: 'border-color 0.3s ease',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#fe8a00'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e5e7eb'
            }}
          />
        </div>
        <div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '16px',
              background: 'white',
              cursor: 'pointer',
              transition: 'border-color 0.3s ease',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#fe8a00'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e5e7eb'
            }}
          >
            {roles.map(role => (
              <option key={role} value={role}>
                {role === 'all' ? 'All Roles' : role}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bees Container */}
      <div style={{
        padding: 'clamp(40px, 6vw, 60px) clamp(20px, 4vw, 40px)'
      }}>
        {filteredBees.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: 'clamp(20px, 4vw, 32px)',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {filteredBees.map((bee) => (
              <div key={bee.id} style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                backdropFilter: 'blur(10px)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)'
                e.currentTarget.style.boxShadow = '0 16px 32px rgba(0, 0, 0, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)'
              }}>
                <div style={{
                  height: '250px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '16px 16px 0 0'
                }}>
                  {bee.image_url ? (
                    <Image
                      src={bee.image_url}
                      alt={bee.name}
                      width={300}
                      height={300}
                      style={{
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%',
                        borderRadius: '16px 16px 0 0'
                      }}
                    />
                  ) : (
                    <div style={{
                      fontSize: '80px',
                      opacity: '0.7'
                    }}>🐝</div>
                  )}
                  {bee.price && (
                    <div style={{
                      position: 'absolute',
                      bottom: '12px',
                      right: '12px',
                      background: 'linear-gradient(135deg, #fe8a00 0%, #e67a00 100%)',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontWeight: '700',
                      fontSize: '14px',
                      boxShadow: '0 4px 12px rgba(254, 138, 0, 0.3)',
                      backdropFilter: 'blur(10px)'
                    }}>
                      ${bee.price}/month
                    </div>
                  )}
                </div>
                <div style={{
                  padding: 'clamp(20px, 4vw, 32px)'
                }}>
                  <h3 style={{
                    color: '#2d3748',
                    fontSize: 'clamp(20px, 4vw, 24px)',
                    margin: '0 0 8px 0',
                    fontWeight: '700'
                  }}>
                    {bee.name}
                  </h3>
                  <div style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    display: 'inline-block',
                    marginBottom: '16px',
                    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
                  }}>
                    {bee.role}
                  </div>
                  <p style={{
                    color: '#4a5568',
                    lineHeight: '1.6',
                    marginBottom: '24px'
                  }}>
                    {bee.description}
                  </p>
                  <div style={{
                    display: 'flex',
                    gap: '16px'
                  }}>
                    <button 
                      style={{
                        background: '#fe8a00',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        flex: '1'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#e67a00'
                        e.currentTarget.style.transform = 'translateY(-2px)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#fe8a00'
                        e.currentTarget.style.transform = 'translateY(0)'
                      }}
                      onClick={() => window.location.href = `/bees/${bee.id}`}
                    >
                      Hire {bee.name}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: 'clamp(40px, 8vw, 80px)',
            color: 'white',
            fontSize: 'clamp(16px, 3vw, 20px)'
          }}>
            <p>No bees found matching your criteria. Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div style={{
        margin: 'clamp(40px, 8vw, 80px) clamp(20px, 4vw, 40px)'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '24px',
          padding: 'clamp(32px, 6vw, 48px)',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: 'clamp(24px, 4vw, 48px)',
            alignItems: 'center',
            position: 'relative',
            zIndex: '1'
          }}>
            <div style={{
              textAlign: 'center'
            }}>
              <div style={{
                position: 'relative',
                marginBottom: '16px'
              }}>
                <Image
                  src="/buzz.png"
                  alt="Buzz - Your AI Assistant"
                  width={140}
                  height={140}
                  style={{
                    borderRadius: '50%',
                    border: '6px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.3)',
                    background: 'white'
                  }}
                />
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '16px',
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.9)'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    background: '#4ade80',
                    borderRadius: '50%',
                    animation: 'pulse 2s infinite'
                  }}></div>
                  <span>Online & Ready to Help</span>
                </div>
              </div>
            </div>
            <div style={{
              color: 'white'
            }}>
              <div style={{
                display: 'inline-block',
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '16px',
                backdropFilter: 'blur(10px)'
              }}>
                🤖 AI Assistant
              </div>
              <h2 style={{
                fontSize: 'clamp(28px, 5vw, 40px)',
                fontWeight: '800',
                margin: '0 0 16px 0',
                lineHeight: '1.2'
              }}>
                Can't find the perfect bee?
              </h2>
              <p style={{
                fontSize: 'clamp(16px, 3vw, 18px)',
                lineHeight: '1.6',
                marginBottom: '32px',
                opacity: '0.95'
              }}>
                Let Buzz, your AI recruitment specialist, help you find the right AI assistant for your specific needs. 
                Get personalized recommendations in seconds!
              </p>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginBottom: '32px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '16px'
                }}>
                  <span style={{
                    fontSize: '20px',
                    width: '24px',
                    textAlign: 'center'
                  }}>⚡</span>
                  <span>Instant Recommendations</span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '16px'
                }}>
                  <span style={{
                    fontSize: '20px',
                    width: '24px',
                    textAlign: 'center'
                  }}>🎯</span>
                  <span>Personalized Matching</span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '16px'
                }}>
                  <span style={{
                    fontSize: '20px',
                    width: '24px',
                    textAlign: 'center'
                  }}>💬</span>
                  <span>24/7 Availability</span>
                </div>
              </div>
              <Link href="/chat" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                background: 'linear-gradient(135deg, #fe8a00 0%, #e67a00 100%)',
                color: 'white',
                textDecoration: 'none',
                padding: '20px 32px',
                borderRadius: '50px',
                fontWeight: '700',
                fontSize: '18px',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 24px rgba(254, 138, 0, 0.4)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #e67a00 0%, #d46a00 100%)'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(254, 138, 0, 0.5)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #fe8a00 0%, #e67a00 100%)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(254, 138, 0, 0.4)'
              }}>
                <span style={{ fontSize: '20px' }}>💬</span>
                <span>Chat with Buzz Now</span>
                <span style={{
                  fontSize: '20px',
                  transition: 'transform 0.3s ease'
                }}>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        padding: 'clamp(20px, 4vw, 32px)',
        textAlign: 'center',
        color: 'white',
        opacity: '0.9',
        fontSize: '14px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <p>&copy; 2024 B2BEE. All rights reserved.</p>
      </footer>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @media (max-width: 768px) {
          .cta-content {
            grid-template-columns: 1fr;
            gap: 32px;
            text-align: center;
          }
          
          .cta-features {
            align-items: center;
          }
          
          .feature {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  )
} 