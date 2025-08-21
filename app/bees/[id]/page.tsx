'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

import { Bee } from '@/lib/types'

export default function BeeProfilePage() {
  const [bee, setBee] = useState<Bee | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [subscriptionMessage, setSubscriptionMessage] = useState('')

  const params = useParams()
  const beeId = params.id as string
  const router = useRouter()

  useEffect(() => {
    if (params.id) {
      fetchBee(params.id as string)
    }
  }, [params.id])

  const fetchBee = async (id: string) => {
    try {
      const response = await fetch(`/api/bees/${id}`)
      
      if (response.ok) {
        const data = await response.json()
        setBee(data.bee)
      } else {
        setError('Bee not found')
      }
    } catch (error) {
      console.error('Error fetching bee:', error)
      setError('Failed to load bee profile')
    } finally {
      setLoading(false)
    }
  }

  const calculateSavings = (beePrice: number) => {
    const traditionalCost = 5000 // Average monthly cost for a traditional hire
    const monthlySavings = traditionalCost - beePrice
    const annualSavings = monthlySavings * 12
    return { monthlySavings, annualSavings }
  }

  const handleSubscription = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubscriptionStatus('loading')
    setSubscriptionMessage('')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (response.ok) {
        setSubscriptionStatus('success')
        setSubscriptionMessage('Thanks! You\'ll be notified when we\'re ready to launch! 🐝')
        setEmail('')
      } else {
        const error = await response.json()
        setSubscriptionStatus('error')
        setSubscriptionMessage(error.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setSubscriptionStatus('error')
      setSubscriptionMessage('Something went wrong. Please try again.')
    }
  }

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
          Loading bee profile...
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

  if (error || !bee) {
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
        <h1 style={{
          fontSize: 'clamp(32px, 6vw, 40px)',
          marginBottom: '16px',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
        }}>
          Bee Not Found
        </h1>
        <p style={{
          fontSize: 'clamp(16px, 3vw, 20px)',
          marginBottom: '32px',
          opacity: '0.9'
        }}>
          {error || 'The bee you\'re looking for doesn\'t exist.'}
        </p>
        <Link href="/" style={{
          background: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          textDecoration: 'none',
          padding: '16px 32px',
          borderRadius: '12px',
          fontWeight: '600',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(10px)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
        }}>
          Back to All Bees
        </Link>
      </div>
    )
  }

  const currencySymbol = bee.display_currency === 'GBP' ? '£' : bee.display_currency === 'EUR' ? '€' : '$'
  const priceValue = typeof bee.display_price === 'number' ? bee.display_price : null
  const savings = priceValue ? calculateSavings(priceValue) : null

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
        color: 'white'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <Link href="/" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: 'clamp(16px, 3vw, 18px)',
            marginBottom: 'clamp(24px, 4vw, 32px)',
            display: 'inline-block',
            opacity: '0.9',
            transition: 'opacity 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0.9'
          }}>
            ← Back to All Bees
          </Link>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr',
            gap: 'clamp(24px, 4vw, 48px)',
            alignItems: 'center'
          }}>
            <div style={{
              textAlign: 'center'
            }}>
              {bee.image_url ? (
                <Image
                  src={bee.image_url}
                  alt={bee.name}
                  width={400}
                  height={600}
                  style={{
                    borderRadius: '20px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    objectFit: 'contain',
                    maxHeight: '500px',
                    width: 'auto'
                  }}
                />
              ) : (
                <div style={{
                  width: '400px',
                  height: '400px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '120px',
                  backdropFilter: 'blur(10px)'
                }}>🐝</div>
              )}
            </div>
            
            <div>
              <h1 style={{
                fontSize: 'clamp(32px, 6vw, 56px)',
                marginBottom: '8px',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                fontWeight: 'bold'
              }}>
                {bee.name}
              </h1>
              <div style={{
                fontSize: 'clamp(18px, 3vw, 24px)',
                marginBottom: '16px',
                opacity: '0.9',
                fontWeight: '500'
              }}>
                {bee.role}
              </div>
              <p style={{
                fontSize: 'clamp(16px, 3vw, 20px)',
                marginBottom: 'clamp(24px, 4vw, 32px)',
                lineHeight: '1.6',
                opacity: '0.9'
              }}>
                {bee.description}
              </p>
              {priceValue && (
                <div style={{
                  marginBottom: 'clamp(24px, 4vw, 32px)'
                }}>
                  <span style={{
                    fontSize: 'clamp(32px, 5vw, 40px)',
                    fontWeight: 'bold'
                  }}>{currencySymbol}{priceValue}</span>
                  <span style={{
                    fontSize: 'clamp(18px, 3vw, 24px)',
                    opacity: '0.8'
                  }}>/month</span>
                </div>
              )}
              <div style={{
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap'
              }}>
                <form onSubmit={handleSubscription} style={{
                  display: 'flex',
                  gap: '16px',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  width: '100%',
                  maxWidth: '500px'
                }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    style={{
                      flex: '1',
                      minWidth: '200px',
                      padding: 'clamp(12px, 2vw, 16px) clamp(16px, 3vw, 24px)',
                      borderRadius: '12px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: 'clamp(14px, 2.5vw, 16px)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.8)'
                      e.target.style.background = 'rgba(255, 255, 255, 0.2)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={subscriptionStatus === 'loading'}
                    style={{
                      background: '#fe8a00',
                      color: 'white',
                      border: 'none',
                      padding: 'clamp(12px, 2vw, 16px) clamp(24px, 4vw, 32px)',
                      borderRadius: '12px',
                      fontSize: 'clamp(14px, 2.5vw, 16px)',
                      fontWeight: '600',
                      cursor: subscriptionStatus === 'loading' ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                      opacity: subscriptionStatus === 'loading' ? 0.7 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (subscriptionStatus !== 'loading') {
                        e.currentTarget.style.background = '#e67a00'
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (subscriptionStatus !== 'loading') {
                        e.currentTarget.style.background = '#fe8a00'
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)'
                      }
                    }}
                  >
                    {subscriptionStatus === 'loading' ? 'Subscribing...' : 'Stay Notified'}
                  </button>
                </form>
                {subscriptionMessage && (
                  <div style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    marginTop: '8px',
                    background: subscriptionStatus === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: subscriptionStatus === 'success' ? '#22c55e' : '#ef4444',
                    border: `1px solid ${subscriptionStatus === 'success' ? '#22c55e' : '#ef4444'}`
                  }}>
                    {subscriptionMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div style={{
        background: 'white',
        padding: 'clamp(40px, 8vw, 80px) clamp(20px, 4vw, 40px)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            marginBottom: 'clamp(40px, 8vw, 80px)'
          }}>
            <h2 style={{
              fontSize: 'clamp(28px, 5vw, 40px)',
              color: '#2d3748',
              marginBottom: 'clamp(16px, 3vw, 24px)',
              fontWeight: 'bold'
            }}>
              Meet Your New AI Dream Team – No Sick Days, No HR Headaches! 🐝
            </h2>
            <p style={{
              fontSize: 'clamp(18px, 3vw, 20px)',
              color: '#666',
              marginBottom: 'clamp(24px, 4vw, 32px)',
              lineHeight: '1.6'
            }}>
              Why hire one person when you can have a whole hive of AI agents working around the clock for a fraction of the cost?
            </p>
            
            <p style={{
              fontSize: 'clamp(16px, 3vw, 18px)',
              lineHeight: '1.7',
              color: '#444',
              marginBottom: 'clamp(16px, 3vw, 24px)'
            }}>
              At B2BEE, we're flipping recruitment on its head:
            </p>
            <ul style={{
              margin: 'clamp(16px, 3vw, 24px) 0',
              paddingLeft: 'clamp(24px, 4vw, 32px)'
            }}>
              <li style={{
                fontSize: 'clamp(16px, 3vw, 18px)',
                lineHeight: '1.7',
                color: '#444',
                marginBottom: '8px'
              }}>Choose your perfect team member – {bee.name} is ready to work!</li>
              <li style={{
                fontSize: 'clamp(16px, 3vw, 18px)',
                lineHeight: '1.7',
                color: '#444',
                marginBottom: '8px'
              }}>We handle the rest – onboarding, training, updates… no HR dramas, no coffee breaks.</li>
              <li style={{
                fontSize: 'clamp(16px, 3vw, 18px)',
                lineHeight: '1.7',
                color: '#444',
                marginBottom: '8px'
              }}>Always on – 24/7 availability, buzzing with productivity.</li>
            </ul>

            <p style={{
              fontSize: 'clamp(16px, 3vw, 18px)',
              lineHeight: '1.7',
              color: '#444',
              marginBottom: 'clamp(16px, 3vw, 24px)'
            }}>Imagine a world where:</p>
            <ul style={{
              margin: 'clamp(16px, 3vw, 24px) 0',
              paddingLeft: 'clamp(24px, 4vw, 32px)'
            }}>
              <li style={{
                fontSize: 'clamp(16px, 3vw, 18px)',
                lineHeight: '1.7',
                color: '#444',
                marginBottom: '8px'
              }}>No one takes a day off</li>
              <li style={{
                fontSize: 'clamp(16px, 3vw, 18px)',
                lineHeight: '1.7',
                color: '#444',
                marginBottom: '8px'
              }}>No one asks for a raise</li>
              <li style={{
                fontSize: 'clamp(16px, 3vw, 18px)',
                lineHeight: '1.7',
                color: '#444',
                marginBottom: '8px'
              }}>And your calls, leads, and admin just… get done!</li>
            </ul>

            <p style={{
              fontSize: 'clamp(16px, 3vw, 18px)',
              lineHeight: '1.7',
              color: '#444',
              marginBottom: 'clamp(16px, 3vw, 24px)'
            }}>
              From as little as a fraction of the cost of a full-time hire, your new AI teammate will transform how you work.
            </p>
          </div>

          <div style={{
            marginBottom: 'clamp(40px, 8vw, 80px)'
          }}>
            <h2 style={{
              fontSize: 'clamp(28px, 5vw, 40px)',
              color: '#2d3748',
              marginBottom: 'clamp(16px, 3vw, 24px)',
              fontWeight: 'bold'
            }}>
              What Your B2BEE Agent Can Do For You:
            </h2>
            <ul style={{
              margin: 'clamp(16px, 3vw, 24px) 0',
              paddingLeft: 'clamp(24px, 4vw, 32px)'
            }}>
              <li style={{
                fontSize: 'clamp(16px, 3vw, 18px)',
                lineHeight: '1.7',
                color: '#444',
                marginBottom: '8px'
              }}>Book meetings, appointments, and property viewings</li>
              <li style={{
                fontSize: 'clamp(16px, 3vw, 18px)',
                lineHeight: '1.7',
                color: '#444',
                marginBottom: '8px'
              }}>Make outbound sales calls and follow up with prospects</li>
              <li style={{
                fontSize: 'clamp(16px, 3vw, 18px)',
                lineHeight: '1.7',
                color: '#444',
                marginBottom: '8px'
              }}>Generate new leads and keep your pipeline buzzing</li>
              <li style={{
                fontSize: 'clamp(16px, 3vw, 18px)',
                lineHeight: '1.7',
                color: '#444',
                marginBottom: '8px'
              }}>Send appointment reminders so no one forgets</li>
              <li style={{
                fontSize: 'clamp(16px, 3vw, 18px)',
                lineHeight: '1.7',
                color: '#444',
                marginBottom: '8px'
              }}>Re-engage old sales leads and warm them back up</li>
              <li style={{
                fontSize: 'clamp(16px, 3vw, 18px)',
                lineHeight: '1.7',
                color: '#444',
                marginBottom: '8px'
              }}>Share offers and promotions with your audience</li>
            </ul>
            <p style={{
              fontSize: 'clamp(16px, 3vw, 18px)',
              lineHeight: '1.7',
              color: '#444',
              marginBottom: 'clamp(16px, 3vw, 24px)'
            }}>
              And they'll do it all across email, phone, Facebook, Instagram, and LinkedIn – so your new team Bee takes care of the heavy lifting while you focus on closing deals.
            </p>
          </div>

          {savings && (
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: 'clamp(32px, 6vw, 48px)',
              borderRadius: '20px',
              margin: 'clamp(32px, 6vw, 48px) 0',
              color: 'white'
            }}>
              <h2 style={{
                fontSize: 'clamp(28px, 5vw, 40px)',
                color: 'white',
                textAlign: 'center',
                marginBottom: 'clamp(24px, 4vw, 32px)',
                fontWeight: 'bold'
              }}>
                💰 Cost Savings Comparison
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'clamp(20px, 4vw, 32px)',
                marginTop: 'clamp(24px, 4vw, 32px)'
              }}>
                <div style={{
                  padding: 'clamp(20px, 4vw, 32px)',
                  borderRadius: '15px',
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                  border: '2px solid #e5e7eb'
                }}>
                  <h3 style={{
                    fontSize: 'clamp(20px, 4vw, 24px)',
                    marginBottom: '16px',
                    color: '#2d3748',
                    fontWeight: 'bold'
                  }}>
                    Traditional Hire
                  </h3>
                  <div style={{
                    fontSize: 'clamp(24px, 4vw, 32px)',
                    fontWeight: 'bold',
                    marginBottom: '16px',
                    color: '#2d3748'
                  }}>
                    $4,167/month
                  </div>
                  <div style={{
                    textAlign: 'left',
                    marginBottom: '16px'
                  }}>
                    <p style={{
                      marginBottom: '8px',
                      fontSize: 'clamp(14px, 2.5vw, 16px)',
                      color: '#666'
                    }}>• Base salary: $3,500</p>
                    <p style={{
                      marginBottom: '8px',
                      fontSize: 'clamp(14px, 2.5vw, 16px)',
                      color: '#666'
                    }}>• Benefits: $500</p>
                    <p style={{
                      marginBottom: '8px',
                      fontSize: 'clamp(14px, 2.5vw, 16px)',
                      color: '#666'
                    }}>• Overhead: $167</p>
                  </div>
                  <div style={{
                    textAlign: 'left',
                    color: '#666'
                  }}>
                    <p style={{
                      marginBottom: '8px',
                      fontSize: 'clamp(14px, 2.5vw, 16px)'
                    }}>• 8 hours/day availability</p>
                    <p style={{
                      marginBottom: '8px',
                      fontSize: 'clamp(14px, 2.5vw, 16px)'
                    }}>• Sick days & vacation</p>
                    <p style={{
                      marginBottom: '8px',
                      fontSize: 'clamp(14px, 2.5vw, 16px)'
                    }}>• Training time</p>
                    <p style={{
                      marginBottom: '8px',
                      fontSize: 'clamp(14px, 2.5vw, 16px)'
                    }}>• HR management</p>
                  </div>
                </div>
                <div style={{
                  padding: 'clamp(20px, 4vw, 32px)',
                  borderRadius: '15px',
                  textAlign: 'center',
                  background: '#fe8a00',
                  color: 'white',
                  border: '2px solid #fe8a00',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
                }}>
                  <h3 style={{
                    fontSize: 'clamp(20px, 4vw, 24px)',
                    marginBottom: '16px',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    AI {bee.name}
                  </h3>
                  <div style={{
                    fontSize: 'clamp(24px, 4vw, 32px)',
                    fontWeight: 'bold',
                    marginBottom: '16px',
                    color: 'white'
                  }}>
                    {currencySymbol}{priceValue}/month
                  </div>
                  <div style={{
                    textAlign: 'left',
                    marginBottom: '16px'
                  }}>
                    <p style={{
                      marginBottom: '8px',
                      fontSize: 'clamp(14px, 2.5vw, 16px)',
                      color: 'rgba(255, 255, 255, 0.9)'
                    }}>• 24/7 availability</p>
                    <p style={{
                      marginBottom: '8px',
                      fontSize: 'clamp(14px, 2.5vw, 16px)',
                      color: 'rgba(255, 255, 255, 0.9)'
                    }}>• No sick days</p>
                    <p style={{
                      marginBottom: '8px',
                      fontSize: 'clamp(14px, 2.5vw, 16px)',
                      color: 'rgba(255, 255, 255, 0.9)'
                    }}>• Instant onboarding</p>
                    <p style={{
                      marginBottom: '8px',
                      fontSize: 'clamp(14px, 2.5vw, 16px)',
                      color: 'rgba(255, 255, 255, 0.9)'
                    }}>• No HR overhead</p>
                  </div>
                  <div style={{
                    background: '#ea3e93',
                    color: 'white',
                    padding: 'clamp(16px, 3vw, 24px)',
                    borderRadius: '15px',
                    marginTop: '16px',
                    textAlign: 'center'
                  }}>
                    <p style={{
                      marginBottom: '8px',
                      fontSize: 'clamp(16px, 3vw, 20px)',
                      fontWeight: '600'
                    }}>
                      You save <strong style={{ fontSize: 'clamp(18px, 3.5vw, 22px)' }}>${savings.monthlySavings.toLocaleString()}/month</strong>
                    </p>
                    <p style={{
                      marginBottom: '0',
                      fontSize: 'clamp(16px, 3vw, 20px)',
                      fontWeight: '600'
                    }}>
                      That's <strong style={{ fontSize: 'clamp(18px, 3.5vw, 22px)' }}>${savings.annualSavings.toLocaleString()}/year!</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div style={{
            textAlign: 'center'
          }}>
            <h2 style={{
              fontSize: 'clamp(28px, 5vw, 40px)',
              color: '#2d3748',
              marginBottom: 'clamp(16px, 3vw, 24px)',
              fontWeight: 'bold'
            }}>
              Ready to Transform Your Business?
            </h2>
            <p style={{
              fontSize: 'clamp(16px, 3vw, 18px)',
              lineHeight: '1.7',
              color: '#444',
              marginBottom: 'clamp(24px, 4vw, 32px)'
            }}>
              Join hundreds of businesses that have already discovered the power of AI-driven productivity. 
              {bee.name} is ready to start working for you today!
            </p>
            <div style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginTop: 'clamp(24px, 4vw, 32px)'
            }}>
              <form onSubmit={handleSubscription} style={{
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                maxWidth: '500px'
              }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  style={{
                    flex: '1',
                    minWidth: '200px',
                    padding: 'clamp(12px, 2vw, 16px) clamp(16px, 3vw, 24px)',
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0',
                    background: 'white',
                    color: '#2d3748',
                    fontSize: 'clamp(14px, 2.5vw, 16px)',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#fe8a00'
                    e.target.style.boxShadow = '0 0 0 3px rgba(254, 138, 0, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0'
                    e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <button
                  type="submit"
                  disabled={subscriptionStatus === 'loading'}
                  style={{
                    background: '#fe8a00',
                    color: 'white',
                    border: 'none',
                    padding: 'clamp(12px, 2vw, 16px) clamp(24px, 4vw, 32px)',
                    borderRadius: '12px',
                    fontSize: 'clamp(14px, 2.5vw, 16px)',
                    fontWeight: '600',
                    cursor: subscriptionStatus === 'loading' ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                    opacity: subscriptionStatus === 'loading' ? 0.7 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (subscriptionStatus !== 'loading') {
                      e.currentTarget.style.background = '#e67a00'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (subscriptionStatus !== 'loading') {
                      e.currentTarget.style.background = '#fe8a00'
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)'
                    }
                  }}
                >
                  {subscriptionStatus === 'loading' ? 'Subscribing...' : 'Stay Notified'}
                </button>
              </form>
              {subscriptionMessage && (
                <div style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  marginTop: '8px',
                  background: subscriptionStatus === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  color: subscriptionStatus === 'success' ? '#22c55e' : '#ef4444',
                  border: `1px solid ${subscriptionStatus === 'success' ? '#22c55e' : '#ef4444'}`
                }}>
                  {subscriptionMessage}
                </div>
              )}
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
        @media (max-width: 768px) {
          .bee-header {
            grid-template-columns: 1fr;
            gap: 32px;
            text-align: center;
          }
          
          .savings-grid {
            grid-template-columns: 1fr;
          }
          
          .bee-actions-large {
            justify-content: center;
          }
          
          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  )
} 