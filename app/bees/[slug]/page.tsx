'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Bee } from '@/lib/types'
import EmailSubscription from '@/components/EmailSubscription'

export default function BeeProfilePage() {
  const [bee, setBee] = useState<Bee | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCurrency, setSelectedCurrency] = useState<'GBP' | 'USD' | 'EUR'>('GBP')
  const [email, setEmail] = useState('')
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [subscriptionMessage, setSubscriptionMessage] = useState('')
  const [imageError, setImageError] = useState(false)

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
        setBee(data)
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
    const traditionalCost = bee?.roiModel?.assumptions?.traditional_admin_cost ?? 5000
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

  const handleBookDemo = () => {
    // For now, redirect to a demo booking page or external calendar
    // This will be replaced with Cal.com integration later
    window.open('https://cal.com/b2bee/demo', '_blank')
  }

  const handleHearSample = () => {
    // Open the demo video if available
    if (bee?.demoAssets?.video_url) {
      window.open(bee.demoAssets.video_url, '_blank')
    } else {
      // Fallback to a generic demo or show a message
      alert('Demo video not available yet. Please book a demo to see it in action!')
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
  if (bee.status === 'DRAFT') {
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
          🐝
        </div>
        <p style={{
          fontSize: 'clamp(16px, 3vw, 20px)',
          marginBottom: 'clamp(24px, 4vw, 32px)',
          opacity: '0.9'
        }}>
          This bee is not available yet.
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

  const currencySymbol = getCurrencySymbol(selectedCurrency)
  const priceValue = bee.prices?.[selectedCurrency] || null
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
        <div style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center'
        }}>
          <Link href="/" style={{
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
            ← Back to All Bees
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
      </div>

      {/* Main Content - Side by Side Layout */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: 'clamp(40px, 6vw, 80px) clamp(20px, 4vw, 40px)'
      }}>
        {/* Hero Section - Side by Side */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(40px, 6vw, 80px)',
          alignItems: 'start',
          marginBottom: 'clamp(60px, 8vw, 100px)'
        }}>
          {/* Left Side - Bee Image */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div style={{
              borderRadius: '50%',
              overflow: 'hidden',
              border: '4px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              marginBottom: 'clamp(24px, 4vw, 32px)'
            }}>
              {bee.imageUrl && !imageError ? (
                <Image
                  src={bee.imageUrl}
                  alt={bee.name}
                  width={400}
                  height={400}
                  style={{
                    width: 'clamp(300px, 50vw, 400px)',
                    height: 'clamp(300px, 50vw, 400px)',
                    objectFit: 'cover'
                  }}
                  onError={() => setImageError(true)}
                />
              ) : (
                <div style={{
                  width: 'clamp(300px, 50vw, 400px)',
                  height: 'clamp(300px, 50vw, 400px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'clamp(48px, 8vw, 96px)'
                }}>
                  🐝
                </div>
              )}
            </div>

            {/* Status Badge */}
            <div style={{
              display: 'inline-block',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600',
              textTransform: 'uppercase',
              marginBottom: 'clamp(16px, 3vw, 24px)',
              backgroundColor: bee.status === 'ACTIVE' ? '#10B981' : bee.status === 'INACTIVE' ? '#F59E0B' : '#6B7280',
              color: 'white'
            }}>
              {bee.status}
            </div>
          </div>

          {/* Right Side - Bee Information */}
          <div style={{
            color: 'white'
          }}>
            <h1 style={{
              fontSize: 'clamp(32px, 6vw, 48px)',
              fontWeight: 'bold',
              marginBottom: 'clamp(12px, 2vw, 16px)',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
            }}>
              {bee.name}
            </h1>

            {bee.tagline && (
              <p style={{
                fontSize: 'clamp(18px, 3vw, 24px)',
                color: 'rgba(255, 255, 255, 0.9)',
                marginBottom: 'clamp(16px, 3vw, 24px)',
                lineHeight: '1.4'
              }}>
                {bee.tagline}
              </p>
            )}

            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '16px',
              fontWeight: '600',
              display: 'inline-block',
              marginBottom: 'clamp(16px, 3vw, 24px)',
              boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
            }}>
              {bee.role}
            </div>

            <p style={{
              fontSize: 'clamp(16px, 2.5vw, 18px)',
              color: 'rgba(255, 255, 255, 0.8)',
              lineHeight: '1.6',
              marginBottom: 'clamp(24px, 4vw, 32px)'
            }}>
              {bee.shortDescription || bee.description}
            </p>

            {/* Pricing Section */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: 'clamp(20px, 4vw, 32px)',
              marginBottom: 'clamp(24px, 4vw, 32px)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <h3 style={{
                fontSize: 'clamp(20px, 4vw, 24px)',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: 'clamp(12px, 2vw, 16px)'
              }}>
                Pricing
              </h3>

              {/* Currency Toggle */}
              <div style={{
                display: 'flex',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                padding: '4px',
                gap: '4px',
                marginBottom: 'clamp(16px, 3vw, 24px)',
                width: 'fit-content'
              }}>
                {(['GBP', 'USD', 'EUR'] as const).map((currency) => (
                  <button
                    key={currency}
                    onClick={() => setSelectedCurrency(currency)}
                    style={{
                      backgroundColor: selectedCurrency === currency ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                      color: 'white',
                      border: 'none',
                      borderRadius: '20px',
                      padding: '8px 16px',
                      fontSize: 'clamp(14px, 2.5vw, 16px)',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {currency}
                  </button>
                ))}
              </div>

              <div style={{
                fontSize: 'clamp(28px, 5vw, 36px)',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: 'clamp(8px, 1.5vw, 12px)'
              }}>
                {getCurrencySymbol(selectedCurrency)}{bee.prices?.[selectedCurrency] || 0}/month
              </div>

              {/* Usage Pricing Display */}
              {bee.usage_pricing && bee.usage_pricing[selectedCurrency] && (
                <div style={{
                  fontSize: 'clamp(14px, 2.5vw, 16px)',
                  color: 'rgba(255, 255, 255, 0.8)',
                  marginBottom: 'clamp(8px, 1.5vw, 12px)'
                }}>
                  + {getCurrencySymbol(selectedCurrency)}{bee.usage_pricing[selectedCurrency].rate_per_unit} {bee.usage_pricing[selectedCurrency].unit_description}
                </div>
              )}

              {/* ROI Savings */}
              {savings && (
                <div style={{
                  fontSize: 'clamp(14px, 2.5vw, 16px)',
                  color: '#4ade80',
                  fontWeight: '600'
                }}>
                  Save {getCurrencySymbol(selectedCurrency)}{savings.monthlySavings}/month vs traditional solutions
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div style={{
              display: 'flex',
              gap: 'clamp(12px, 2vw, 16px)',
              flexWrap: 'wrap'
            }}>
              {bee.status === 'ACTIVE' ? (
                <>
                  <button
                    onClick={handleBookDemo}
                    style={{
                      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      color: 'white',
                      border: 'none',
                      padding: 'clamp(12px, 2.5vw, 16px) clamp(24px, 4vw, 32px)',
                      borderRadius: '12px',
                      fontSize: 'clamp(16px, 2.5vw, 18px)',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
                      backdropFilter: 'blur(10px)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.6)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)'
                    }}
                  >
                    📞 Book a Demo
                  </button>
                  <button
                    onClick={handleHearSample}
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      padding: 'clamp(12px, 2.5vw, 16px) clamp(24px, 4vw, 32px)',
                      borderRadius: '12px',
                      fontSize: 'clamp(16px, 2.5vw, 18px)',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      backdropFilter: 'blur(10px)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    🎧 Hear Sample
                  </button>
                </>
              ) : (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: 'clamp(16px, 3vw, 24px)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  maxWidth: '400px'
                }}>
                  <p style={{
                    fontSize: 'clamp(16px, 2.5vw, 18px)',
                    color: 'white',
                    marginBottom: 'clamp(16px, 3vw, 24px)',
                    fontWeight: '500'
                  }}>
                    🚧 Coming Soon! Get notified when {bee.name} launches.
                  </p>
                  <EmailSubscription 
                    beeId={bee.id}
                    source="bee-profile"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Information Sections */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(40px, 6vw, 80px)',
          marginBottom: 'clamp(60px, 8vw, 100px)'
        }}>
          {/* Left Column */}
          <div>
            {/* Features Section */}
            {bee.features && Object.keys(bee.features).length > 0 && (
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: 'clamp(24px, 4vw, 32px)',
                marginBottom: 'clamp(32px, 5vw, 48px)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <h3 style={{
                  fontSize: 'clamp(24px, 4vw, 28px)',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: 'clamp(16px, 3vw, 24px)'
                }}>
                  Key Features
                </h3>
                <div style={{
                  display: 'grid',
                  gap: 'clamp(12px, 2vw, 16px)'
                }}>
                  {Object.entries(bee.features).map(([feature, description], index) => (
                    <div key={index} style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      padding: 'clamp(16px, 3vw, 20px)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <div style={{
                        fontSize: 'clamp(16px, 2.5vw, 18px)',
                        fontWeight: '600',
                        color: 'white',
                        marginBottom: 'clamp(4px, 1vw, 8px)'
                      }}>
                        {feature}
                      </div>
                      <div style={{
                        fontSize: 'clamp(14px, 2.5vw, 16px)',
                        color: 'rgba(255, 255, 255, 0.8)',
                        lineHeight: '1.5'
                      }}>
                        {String(description)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ROI Model Section */}
            {bee.roiModel && (
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: 'clamp(24px, 4vw, 32px)',
                marginBottom: 'clamp(32px, 5vw, 48px)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <h3 style={{
                  fontSize: 'clamp(24px, 4vw, 28px)',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: 'clamp(16px, 3vw, 24px)'
                }}>
                  ROI Analysis
                </h3>
                
                {bee.roiModel.assumptions && (
                  <div style={{
                    marginBottom: 'clamp(16px, 3vw, 24px)'
                  }}>
                    <h4 style={{
                      fontSize: 'clamp(18px, 3vw, 20px)',
                      fontWeight: '600',
                      color: 'white',
                      marginBottom: 'clamp(8px, 1.5vw, 12px)'
                    }}>
                      Assumptions
                    </h4>
                    <div style={{
                      display: 'grid',
                      gap: 'clamp(8px, 1.5vw, 12px)'
                    }}>
                      {Object.entries(bee.roiModel.assumptions).map(([key, value], index) => (
                        <div key={index} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: 'clamp(8px, 1.5vw, 12px)',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px'
                        }}>
                          <span style={{
                            fontSize: 'clamp(14px, 2.5vw, 16px)',
                            color: 'rgba(255, 255, 255, 0.8)'
                          }}>
                            {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                          <span style={{
                            fontSize: 'clamp(14px, 2.5vw, 16px)',
                            fontWeight: '600',
                            color: 'white'
                          }}>
                            {typeof value === 'number' && key.includes('rate') ? `${(value * 100).toFixed(1)}%` : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {bee.roiModel.calculations && (
                  <div>
                    <h4 style={{
                      fontSize: 'clamp(18px, 3vw, 20px)',
                      fontWeight: '600',
                      color: 'white',
                      marginBottom: 'clamp(8px, 1.5vw, 12px)'
                    }}>
                      Results
                    </h4>
                    <div style={{
                      display: 'grid',
                      gap: 'clamp(8px, 1.5vw, 12px)'
                    }}>
                      {Object.entries(bee.roiModel.calculations).map(([key, value], index) => (
                        <div key={index} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: 'clamp(8px, 1.5vw, 12px)',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px'
                        }}>
                          <span style={{
                            fontSize: 'clamp(14px, 2.5vw, 16px)',
                            color: 'rgba(255, 255, 255, 0.8)'
                          }}>
                            {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                          <span style={{
                            fontSize: 'clamp(14px, 2.5vw, 16px)',
                            fontWeight: '600',
                            color: typeof value === 'number' && key.includes('savings') ? '#4ade80' : 'white'
                          }}>
                            {typeof value === 'number' && key.includes('percentage') ? `${value.toFixed(1)}%` : 
                             typeof value === 'number' && key.includes('cost') ? `${getCurrencySymbol(selectedCurrency)}${value}` :
                             typeof value === 'number' && key.includes('savings') ? `${getCurrencySymbol(selectedCurrency)}${value}` :
                             typeof value === 'number' && key.includes('hours') ? `${value.toFixed(1)} hours` : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div>
            {/* Integrations Section */}
            {bee.integrations && Object.keys(bee.integrations).length > 0 && (
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: 'clamp(24px, 4vw, 32px)',
                marginBottom: 'clamp(32px, 5vw, 48px)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <h3 style={{
                  fontSize: 'clamp(24px, 4vw, 28px)',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: 'clamp(16px, 3vw, 24px)'
                }}>
                  Integrations
                </h3>
                <div style={{
                  display: 'grid',
                  gap: 'clamp(16px, 3vw, 20px)'
                }}>
                  {Object.entries(bee.integrations).map(([category, integrations], index) => (
                    <div key={index} style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      padding: 'clamp(16px, 3vw, 20px)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <div style={{
                        fontSize: 'clamp(16px, 2.5vw, 18px)',
                        fontWeight: '600',
                        color: 'white',
                        marginBottom: 'clamp(8px, 1.5vw, 12px)'
                      }}>
                        {category}
                      </div>
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 'clamp(6px, 1vw, 8px)'
                      }}>
                        {Array.isArray(integrations) ? integrations.map((integration, idx) => (
                          <span key={idx} style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            padding: 'clamp(4px, 1vw, 6px) clamp(8px, 1.5vw, 12px)',
                            borderRadius: '16px',
                            fontSize: 'clamp(12px, 2vw, 14px)',
                            fontWeight: '500'
                          }}>
                            {integration}
                          </span>
                        )) : (
                          <span style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            padding: 'clamp(4px, 1vw, 6px) clamp(8px, 1.5vw, 12px)',
                            borderRadius: '16px',
                            fontSize: 'clamp(12px, 2vw, 14px)',
                            fontWeight: '500'
                          }}>
                            {String(integrations)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Demo Assets Section */}
            {bee.demoAssets && (
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: 'clamp(24px, 4vw, 32px)',
                marginBottom: 'clamp(32px, 5vw, 48px)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <h3 style={{
                  fontSize: 'clamp(24px, 4vw, 28px)',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: 'clamp(16px, 3vw, 24px)'
                }}>
                  Demo & Assets
                </h3>
                
                {bee.demoAssets.video_url && (
                  <div style={{
                    marginBottom: 'clamp(16px, 3vw, 24px)'
                  }}>
                    <h4 style={{
                      fontSize: 'clamp(16px, 2.5vw, 18px)',
                      fontWeight: '600',
                      color: 'white',
                      marginBottom: 'clamp(8px, 1.5vw, 12px)'
                    }}>
                      Demo Video
                    </h4>
                    <a 
                      href={bee.demoAssets.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-block',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        padding: 'clamp(8px, 1.5vw, 12px) clamp(16px, 3vw, 24px)',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontSize: 'clamp(14px, 2.5vw, 16px)',
                        fontWeight: '500',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      🎥 Watch Demo
                    </a>
                  </div>
                )}

                {bee.demoAssets.screenshots && bee.demoAssets.screenshots.length > 0 && (
                  <div>
                    <h4 style={{
                      fontSize: 'clamp(16px, 2.5vw, 18px)',
                      fontWeight: '600',
                      color: 'white',
                      marginBottom: 'clamp(8px, 1.5vw, 12px)'
                    }}>
                      Screenshots
                    </h4>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                      gap: 'clamp(8px, 1.5vw, 12px)'
                    }}>
                      {bee.demoAssets.screenshots.map((screenshot: any, index: number) => (
                        <div key={index} style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px',
                          padding: 'clamp(8px, 1.5vw, 12px)',
                          textAlign: 'center'
                        }}>
                          <div style={{
                            fontSize: 'clamp(12px, 2vw, 14px)',
                            color: 'rgba(255, 255, 255, 0.8)'
                          }}>
                            Screenshot {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* FAQ Section - Full Width */}
        {bee.faqs && bee.faqs.length > 0 && (
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: 'clamp(32px, 5vw, 48px)',
            marginBottom: 'clamp(60px, 8vw, 100px)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h3 style={{
              fontSize: 'clamp(28px, 5vw, 32px)',
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
              marginBottom: 'clamp(32px, 5vw, 48px)'
            }}>
              Frequently Asked Questions
            </h3>
            <div style={{
              display: 'grid',
              gap: 'clamp(20px, 3vw, 24px)',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              {bee.faqs.map((faq, index) => (
                <div key={index} style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  padding: 'clamp(20px, 3vw, 24px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <h4 style={{
                    fontSize: 'clamp(18px, 3vw, 20px)',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: 'clamp(12px, 2vw, 16px)'
                  }}>
                    {faq.question}
                  </h4>
                  <p style={{
                    fontSize: 'clamp(16px, 2.5vw, 18px)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: '1.6'
                  }}>
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Final CTA Section */}
        <div style={{
          textAlign: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: 'clamp(40px, 6vw, 60px)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h3 style={{
            fontSize: 'clamp(28px, 5vw, 32px)',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: 'clamp(16px, 3vw, 24px)'
          }}>
            Ready to get started?
          </h3>
          <p style={{
            fontSize: 'clamp(16px, 2.5vw, 18px)',
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: 'clamp(32px, 5vw, 48px)',
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto clamp(32px, 5vw, 48px)'
          }}>
            {bee.status === 'ACTIVE' 
              ? `Book a demo to see ${bee.name} in action and discover how it can transform your business.`
              : `Get notified when ${bee.name} launches and be among the first to experience its benefits.`
            }
          </p>
          
          <div style={{
            display: 'flex',
            gap: 'clamp(16px, 3vw, 24px)',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {bee.status === 'ACTIVE' ? (
              <>
                <button
                  onClick={handleBookDemo}
                  style={{
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                    padding: 'clamp(16px, 3vw, 20px) clamp(32px, 5vw, 40px)',
                    borderRadius: '12px',
                    fontSize: 'clamp(18px, 3vw, 20px)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.6)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  📞 Book a Demo
                </button>
                <button
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    padding: 'clamp(16px, 3vw, 20px) clamp(32px, 5vw, 40px)',
                    borderRadius: '12px',
                    fontSize: 'clamp(18px, 3vw, 20px)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
                  }}
                >
                  🎧 Hear Sample
                </button>
              </>
            ) : (
              <EmailSubscription 
                beeId={bee.id}
                source="bee-profile"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
