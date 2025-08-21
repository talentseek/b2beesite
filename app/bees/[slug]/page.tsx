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
  const [selectedCurrency, setSelectedCurrency] = useState<'GBP' | 'USD' | 'EUR'>('GBP')
  const [email, setEmail] = useState('')
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [subscriptionMessage, setSubscriptionMessage] = useState('')

  const params = useParams()
  const beeSlug = params.slug as string
  const router = useRouter()

  useEffect(() => {
    if (params.slug) {
      fetchBee(params.slug as string)
    }
  }, [params.slug])

  const fetchBee = async (slug: string) => {
    try {
      const response = await fetch(`/api/bees/slug/${slug}`)
      
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
    const traditionalCost = bee.roi_model?.traditional_cost_per_month || 5000
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
        body: JSON.stringify({ 
          email,
          bee_id: bee?.id,
          source: 'bee-profile'
        })
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

  const getCurrencySymbol = (currency: string) => {
    return currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '$'
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
          fontSize: 'clamp(24px, 5vw, 48px)',
          marginBottom: 'clamp(16px, 3vw, 24px)',
          animation: 'bounce 1s infinite'
        }}>
          🐝
        </div>
        <div style={{
          fontSize: 'clamp(18px, 3vw, 24px)',
          opacity: '0.9'
        }}>
          Loading bee profile...
        </div>
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
        textAlign: 'center',
        padding: 'clamp(20px, 4vw, 40px)'
      }}>
        <div style={{
          fontSize: 'clamp(24px, 5vw, 48px)',
          marginBottom: 'clamp(16px, 3vw, 24px)'
        }}>
          🐝
        </div>
        <p style={{
          fontSize: 'clamp(16px, 3vw, 20px)',
          marginBottom: 'clamp(24px, 4vw, 32px)',
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

  // Check if bee is draft (should not be publicly accessible)
  if (bee.status === 'draft') {
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
          fontSize: 'clamp(24px, 5vw, 48px)',
          marginBottom: 'clamp(16px, 3vw, 24px)'
        }}>
          🚫
        </div>
        <div style={{
          fontSize: 'clamp(18px, 3vw, 24px)',
          opacity: '0.9'
        }}>
          This bee is not available yet.
        </div>
      </div>
    )
  }

  const currencySymbol = getCurrencySymbol(selectedCurrency)
  const priceValue = bee.display_price || null
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
              {/* Status Badge */}
              {bee.status === 'inactive' && (
                <div style={{
                  backgroundColor: 'rgba(255, 193, 7, 0.2)',
                  color: '#FFC107',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '16px',
                  display: 'inline-block',
                  border: '1px solid rgba(255, 193, 7, 0.3)'
                }}>
                  Coming Soon
                </div>
              )}
              
              <h1 style={{
                fontSize: 'clamp(32px, 6vw, 56px)',
                marginBottom: '8px',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                fontWeight: 'bold'
              }}>
                {bee.name}
              </h1>
              
              {bee.tagline && (
                <div style={{
                  fontSize: 'clamp(18px, 3vw, 24px)',
                  marginBottom: '16px',
                  opacity: '0.9',
                  fontWeight: '500'
                }}>
                  {bee.tagline}
                </div>
              )}
              
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
                {bee.short_description || bee.description}
              </p>

              {/* Pricing Section */}
              {priceValue && (
                <div style={{
                  marginBottom: 'clamp(24px, 4vw, 32px)'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      fontSize: 'clamp(32px, 5vw, 40px)',
                      fontWeight: 'bold'
                    }}>
                      {currencySymbol}{priceValue}/month
                    </div>
                    
                    {/* Currency Toggle */}
                    <div style={{
                      display: 'flex',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '4px'
                    }}>
                      {(['GBP', 'USD', 'EUR'] as const).map((currency) => (
                        <button
                          key={currency}
                          onClick={() => setSelectedCurrency(currency)}
                          style={{
                            backgroundColor: selectedCurrency === currency ? 'rgba(255, 255, 255, 0.3)' : 'transparent',
                            color: 'white',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {getCurrencySymbol(currency)}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {bee.roi_model?.bee_usage_description && (
                    <div style={{
                      fontSize: 'clamp(14px, 2.5vw, 16px)',
                      opacity: '0.8',
                      marginBottom: '8px'
                    }}>
                      + {bee.roi_model.bee_usage_description}
                    </div>
                  )}
                </div>
              )}

              {/* CTA Section */}
              {bee.status === 'active' ? (
                <div style={{
                  display: 'flex',
                  gap: '16px',
                  flexWrap: 'wrap'
                }}>
                  <button style={{
                    backgroundColor: '#14B8A6',
                    color: 'white',
                    border: 'none',
                    padding: '16px 32px',
                    borderRadius: '12px',
                    fontSize: '18px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#0D9488'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#14B8A6'
                  }}>
                    Book a Demo
                  </button>
                  <button style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    padding: '16px 32px',
                    borderRadius: '12px',
                    fontSize: '18px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
                  }}>
                    Learn More
                  </button>
                </div>
              ) : (
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  padding: '24px',
                  borderRadius: '12px',
                  marginBottom: '24px'
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    marginBottom: '16px',
                    fontWeight: '600'
                  }}>
                    Get notified when {bee.name} launches
                  </h3>
                  <form onSubmit={handleSubscription} style={{ width: '100%' }}>
                    <div style={{
                      display: 'flex',
                      gap: '12px',
                      marginBottom: '12px'
                    }}>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        style={{
                          flex: 1,
                          padding: '12px 16px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          fontSize: '16px'
                        }}
                      />
                      <button
                        type="submit"
                        disabled={subscriptionStatus === 'loading'}
                        style={{
                          backgroundColor: '#14B8A6',
                          color: 'white',
                          border: 'none',
                          padding: '12px 24px',
                          borderRadius: '8px',
                          fontSize: '16px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (!e.currentTarget.disabled) {
                            e.currentTarget.style.backgroundColor = '#0D9488'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!e.currentTarget.disabled) {
                            e.currentTarget.style.backgroundColor = '#14B8A6'
                          }
                        }}
                      >
                        {subscriptionStatus === 'loading' ? 'Subscribing...' : 'Notify Me'}
                      </button>
                    </div>
                    {subscriptionMessage && (
                      <div style={{
                        color: subscriptionStatus === 'success' ? '#10B981' : '#EF4444',
                        fontSize: '14px'
                      }}>
                        {subscriptionMessage}
                      </div>
                    )}
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      {bee.features && bee.features.length > 0 && (
        <div style={{
          padding: 'clamp(40px, 8vw, 80px) clamp(20px, 4vw, 40px)',
          backgroundColor: 'rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            <h2 style={{
              fontSize: 'clamp(28px, 5vw, 40px)',
              color: 'white',
              textAlign: 'center',
              marginBottom: 'clamp(32px, 6vw, 48px)',
              fontWeight: 'bold'
            }}>
              Key Features
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px'
            }}>
              {bee.features.map((feature, index) => (
                <div key={index} style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  padding: '24px',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '8px'
                  }}>
                    {feature}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ROI Calculator Section */}
      {savings && (
        <div style={{
          padding: 'clamp(40px, 8vw, 80px) clamp(20px, 4vw, 40px)',
          color: 'white'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            <h2 style={{
              fontSize: 'clamp(28px, 5vw, 40px)',
              textAlign: 'center',
              marginBottom: 'clamp(32px, 6vw, 48px)',
              fontWeight: 'bold'
            }}>
              Calculate Your Savings
            </h2>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '32px',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              textAlign: 'center'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '24px',
                marginBottom: '32px'
              }}>
                <div>
                  <div style={{
                    fontSize: 'clamp(24px, 4vw, 32px)',
                    fontWeight: 'bold',
                    color: '#10B981'
                  }}>
                    {currencySymbol}{savings.monthlySavings.toLocaleString()}
                  </div>
                  <div style={{
                    fontSize: '16px',
                    opacity: '0.8'
                  }}>
                    Monthly Savings
                  </div>
                </div>
                <div>
                  <div style={{
                    fontSize: 'clamp(24px, 4vw, 32px)',
                    fontWeight: 'bold',
                    color: '#10B981'
                  }}>
                    {currencySymbol}{savings.annualSavings.toLocaleString()}
                  </div>
                  <div style={{
                    fontSize: '16px',
                    opacity: '0.8'
                  }}>
                    Annual Savings
                  </div>
                </div>
              </div>
              <p style={{
                fontSize: '18px',
                opacity: '0.9',
                lineHeight: '1.6'
              }}>
                {bee.roi_model?.traditional_cost_description || 'Traditional solutions cost significantly more while providing less coverage.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      {bee.faqs && bee.faqs.length > 0 && (
        <div style={{
          padding: 'clamp(40px, 8vw, 80px) clamp(20px, 4vw, 40px)',
          backgroundColor: 'rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            <h2 style={{
              fontSize: 'clamp(28px, 5vw, 40px)',
              color: 'white',
              textAlign: 'center',
              marginBottom: 'clamp(32px, 6vw, 48px)',
              fontWeight: 'bold'
            }}>
              Frequently Asked Questions
            </h2>
            <div style={{
              display: 'grid',
              gap: '16px'
            }}>
              {bee.faqs.map((faq, index) => (
                <div key={index} style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  padding: '24px',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '12px'
                  }}>
                    {faq.question}
                  </h3>
                  <p style={{
                    fontSize: '16px',
                    color: 'white',
                    opacity: '0.9',
                    lineHeight: '1.6'
                  }}>
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
