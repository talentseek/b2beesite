'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import EmailSubscription from '@/components/EmailSubscription'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// Dynamically import VapiWidget to avoid SSR issues
const VapiWidget = dynamic(() => import('@vapi-ai/client-sdk-react').then(mod => ({ default: mod.VapiWidget })), {
  ssr: false,
  loading: () => <div>Loading voice widget...</div>
})



interface Bee {
  id: number
  name: string
  role: string
  description: string
  price: number | null
  image_url: string | null
  created_at: string
}

export default function Home() {
  const [bees, setBees] = useState<Bee[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRole, setSelectedRole] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{id: string, text: string, sender: 'user' | 'buzz', timestamp: Date}>>([
    { id: '1', text: "Hey there! I'm Buzz, your AI business assistant! I'm here to help your business *buzz* with efficiency and make sure you never get *stung* by missed opportunities. How can I help *pollinate* your business growth today? ✨", sender: 'buzz', timestamp: new Date() }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showNewsletterForm, setShowNewsletterForm] = useState(false)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [isVapiWidgetOpen, setIsVapiWidgetOpen] = useState(false)

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

    // Fetch bees data
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

  const scrollToBees = () => {
    const beesSection = document.getElementById('bees-section')
    if (beesSection) {
      beesSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user' as const,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setNewMessage('')
    setIsTyping(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage })
      })

      if (response.ok) {
        const data = await response.json()
        const buzzMessage = {
          id: (Date.now() + 1).toString(),
          text: data.response || "Thanks for your message! I'm still learning and will be fully operational soon. In the meantime, why not subscribe to our newsletter to be the first to know when I'm ready to help your business? 🐝✨",
          sender: 'buzz' as const,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, buzzMessage])
        
        // Only show newsletter form if the response suggests it or if there's an error
        if (data.response && data.response.toLowerCase().includes('newsletter')) {
          setShowNewsletterForm(true)
        }
      } else {
        const errorMessage = {
          id: (Date.now() + 1).toString(),
          text: "Thanks for your message! I'm still learning and will be fully operational soon. In the meantime, why not subscribe to our newsletter to be the first to know when I'm ready to help your business? 🐝✨",
          sender: 'buzz' as const,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, errorMessage])
        setShowNewsletterForm(true)
      }
    } catch (error) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting right now. Please try again later!",
        sender: 'buzz' as const,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleNewsletterSubscribe = async () => {
    if (!newsletterEmail.trim()) return



    setIsSubscribing(true)
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail })
      })

      if (response.ok) {
        const successMessage = {
          id: (Date.now() + 1).toString(),
          text: "Great! You've been subscribed to our newsletter. We'll keep you updated on when I'm fully operational! 🎉",
          sender: 'buzz' as const,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, successMessage])
        setNewsletterEmail('')
        setShowNewsletterForm(false)
      } else {
        const errorMessage = {
          id: (Date.now() + 1).toString(),
          text: "Oops! Something went wrong with the subscription. Please try again later!",
          sender: 'buzz' as const,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } catch (error) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: "Oops! Something went wrong with the subscription. Please try again later!",
        sender: 'buzz' as const,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsSubscribing(false)
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

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fb923c 0%, #ea580c 100%)',
      display: 'flex',
      flexDirection: 'column',
      color: 'white',
      position: 'relative'
    }}>
      {/* Header with Navigation */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '1rem 2rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Image
              src="/logo.png"
              alt="B2BEE Logo"
              width={80}
              height={80}
              style={{
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
              }}
            />
          </Link>
          
          <nav style={{
            display: 'flex',
            gap: '2rem',
            alignItems: 'center'
          }}>
            <button 
              onClick={scrollToBees}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '0.9rem',
                padding: '0.5rem 1rem',
                borderRadius: '25px',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)'
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.6)'
                e.currentTarget.style.border = '2px solid rgba(255, 255, 255, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)'
                e.currentTarget.style.border = '2px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              🐝 Check Out Our Busy Bees
            </button>

            <button 
              onClick={() => {
                console.log('Voice Demo button clicked!')
                setIsVapiWidgetOpen(true)
              }}
              style={{
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: 'white',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '0.9rem',
                padding: '0.5rem 1rem',
                borderRadius: '25px',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)'
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.6)'
                e.currentTarget.style.border = '2px solid rgba(255, 255, 255, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)'
                e.currentTarget.style.border = '2px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              📞 Voice Demo
            </button>

          </nav>
        </div>
      </header>

      {/* Main Hero Section */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8rem 2rem 4rem 2rem',
        textAlign: 'center'
      }}>
        {/* Main Logo and CTA */}
        <div style={{ 
          position: 'relative', 
          display: 'inline-block', 
          marginBottom: '3rem' 
        }}>
          <Image
            src="/newbuzz.png"
            alt="B2BEE Logo"
            width={300}
            height={300}
            priority
            style={{
              transition: 'transform 0.3s ease-in-out',
              filter: 'drop-shadow(0 10px 25px rgba(0, 0, 0, 0.3))'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
            }}
          />
        </div>

        {/* Main Headline */}
        <div style={{ maxWidth: '800px', marginBottom: '4rem' }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: '900',
            marginBottom: '1.5rem',
            lineHeight: '1.1',
            textShadow: '3px 3px 6px rgba(0, 0, 0, 0.4)',
            letterSpacing: '-0.02em'
          }}>
            Buzzing Into Business
          </h1>
          
          <h2 style={{
            fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
            marginBottom: '2rem',
            fontWeight: '500',
            opacity: '0.95',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
            lineHeight: '1.4'
          }}>
            AI Support Coming Soon! We help small businesses work smarter, faster and at a fraction of the cost – with AI solutions that never stop buzzing.
          </h2>
        </div>

        {/* Feature Cards Section */}
        <div style={{
          maxWidth: '1200px',
          width: '100%',
          marginBottom: '4rem'
        }}>
          <h3 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
            fontWeight: '800',
            marginBottom: '3rem',
            textAlign: 'center',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            What We Do
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            {/* Card 1 */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '20px',
              padding: '2rem',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
              border: '3px solid rgba(255, 255, 255, 0.3)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)'
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)'
            }}
            >
              <div style={{
                fontSize: '3rem',
                marginBottom: '1rem'
              }}>
                🐝
              </div>
              <h4 style={{
                fontSize: '1.25rem',
                fontWeight: '800',
                color: '#ea580c',
                marginBottom: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Inbound Support
              </h4>
              <p style={{
                color: '#374151',
                fontSize: '1rem',
                lineHeight: '1.6',
                margin: 0
              }}>
                Handle email, Instagram, Facebook, and phone inquiries with AI-powered responses that keep your customers buzzing with satisfaction.
              </p>
            </div>

            {/* Card 2 */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '20px',
              padding: '2rem',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
              border: '3px solid rgba(255, 255, 255, 0.3)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)'
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)'
            }}
            >
              <div style={{
                fontSize: '3rem',
                marginBottom: '1rem'
              }}>
                ⚡
              </div>
              <h4 style={{
                fontSize: '1.25rem',
                fontWeight: '800',
                color: '#ea580c',
                marginBottom: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Outbound Campaigns
              </h4>
              <p style={{
                color: '#374151',
                fontSize: '1rem',
                lineHeight: '1.6',
                margin: 0
              }}>
                Launch powerful marketing campaigns and lead generation efforts that keep your brand buzzing in the marketplace.
              </p>
            </div>

            {/* Card 3 */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '20px',
              padding: '2rem',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
              border: '3px solid rgba(255, 255, 255, 0.3)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)'
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)'
            }}
            >
              <div style={{
                fontSize: '3rem',
                marginBottom: '1rem'
              }}>
                📊
              </div>
              <h4 style={{
                fontSize: '1.25rem',
                fontWeight: '800',
                color: '#ea580c',
                marginBottom: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Smart Analytics
              </h4>
              <p style={{
                color: '#374151',
                fontSize: '1rem',
                lineHeight: '1.6',
                margin: 0
              }}>
                Get detailed reports and insights that help you stay ahead of the competition and make data-driven decisions.
              </p>
            </div>
          </div>
        </div>

        {/* Scrolling Banner */}
        <div style={{
          background: 'black',
          padding: '1rem 0',
          marginBottom: '4rem',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div 
            className="scrolling-text"
            style={{
              display: 'flex',
              whiteSpace: 'nowrap'
            }}
          >
            <span style={{
              color: 'white',
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
              fontWeight: '600',
              marginRight: '3rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              No days off | No sick days | No tea breaks | No Vape Breaks | No HR Issues | No Recruitment Fees | Works 24/7 bringing you the honey |
            </span>
            <span style={{
              color: 'white',
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
              fontWeight: '600',
              marginRight: '3rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              No days off | No sick days | No tea breaks | No Vape Breaks | No HR Issues | No Recruitment Fees | Works 24/7 bringing you the honey |
            </span>
            <span style={{
              color: 'white',
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
              fontWeight: '600',
              marginRight: '3rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              No days off | No sick days | No tea breaks | No Vape Breaks | No HR Issues | No Recruitment Fees | Works 24/7 bringing you the honey |
            </span>
          </div>
        </div>

        {/* Bees Section */}
        <div id="bees-section" style={{
          maxWidth: '1200px',
          width: '100%',
          marginBottom: '4rem'
        }}>
          <h3 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
            fontWeight: '800',
            marginBottom: '3rem',
            textAlign: 'center',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            Our Busy Bees
          </h3>

          {/* Search and Filter Controls */}
          <div style={{
            marginBottom: '3rem',
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
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  fontSize: '16px',
                  transition: 'border-color 0.3s ease',
                  outline: 'none',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  backdropFilter: 'blur(10px)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#fe8a00'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                }}
              />
            </div>
            <div>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                style={{
                  padding: '12px 16px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  fontSize: '16px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'border-color 0.3s ease',
                  outline: 'none',
                  backdropFilter: 'blur(10px)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#fe8a00'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                }}
              >
                {roles.map(role => (
                  <option key={role} value={role} style={{ background: '#ea580c', color: 'white' }}>
                    {role === 'all' ? 'All Roles' : role}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bees Grid */}
          {loading ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4rem 2rem',
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
            </div>
          ) : filteredBees.length > 0 ? (
            <div className="bees-grid">
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
                    height: '350px',
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
                        height={450}
                        style={{
                          objectFit: 'contain',
                          width: '100%',
                          height: '100%',
                          borderRadius: '16px 16px 0 0',
                          padding: '16px'
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
                    <h4 style={{
                      color: '#2d3748',
                      fontSize: 'clamp(20px, 4vw, 24px)',
                      margin: '0 0 8px 0',
                      fontWeight: '700'
                    }}>
                      {bee.name}
                    </h4>
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
              padding: '4rem 2rem',
              color: 'white'
            }}>
              <div style={{
                fontSize: '64px',
                marginBottom: '1rem',
                opacity: '0.7'
              }}>🐝</div>
              <h4 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '1rem',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
              }}>
                No bees found
              </h4>
              <p style={{
                fontSize: '1rem',
                opacity: '0.8',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
              }}>
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div style={{
          maxWidth: '600px',
          width: '100%',
          marginBottom: '4rem',
          textAlign: 'center'
        }}>
          <h3 style={{
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: '700',
            marginBottom: '1rem',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            Stay Informed
          </h3>
          <p style={{
            fontSize: '1rem',
            marginBottom: '2rem',
            opacity: '0.9',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
            lineHeight: '1.5'
          }}>
            Be the first to know when we launch our AI solutions! Follow us for updates and exclusive early access.
          </p>
          
          <EmailSubscription />
          
          <p style={{
            fontSize: '0.875rem',
            opacity: '0.8',
            marginTop: '1.5rem',
            marginBottom: '2rem',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            Follow us for updates
          </p>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            marginTop: '1rem'
          }}>
            <a 
              href="#" 
              style={{
                color: 'white',
                padding: '8px',
                transition: 'all 0.3s ease',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#fed7aa'
                e.currentTarget.style.transform = 'scale(1.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'white'
                e.currentTarget.style.transform = 'scale(1)'
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
                transition: 'all 0.3s ease',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#fed7aa'
                e.currentTarget.style.transform = 'scale(1.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'white'
                e.currentTarget.style.transform = 'scale(1)'
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
                transition: 'all 0.3s ease',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#fed7aa'
                e.currentTarget.style.transform = 'scale(1.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'white'
                e.currentTarget.style.transform = 'scale(1)'
              }}
              onClick={() => handleSocialClick('instagram')}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
        </div>
      </main>

      {/* Professional Footer */}
      <footer style={{
        background: 'black',
        color: 'white',
        padding: '3rem 2rem 2rem 2rem',
        marginTop: 'auto'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '3rem',
          marginBottom: '2rem'
        }}>
          {/* Logo and Brand */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '1rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <Image
                src="/logofooter.png"
                alt="B2BEE Logo"
                width={80}
                height={80}
              />
            </div>
            <p style={{
              fontSize: '0.9rem',
              opacity: '0.8',
              lineHeight: '1.6',
              margin: 0
            }}>
              AI solutions that never stop buzzing. Helping small businesses work smarter, faster and at a fraction of the cost.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              fontSize: '1.1rem',
              fontWeight: '700',
              marginBottom: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Quick Links
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <li>
                <button 
                  onClick={scrollToBees}
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    opacity: '0.8',
                    transition: 'opacity 0.3s ease',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '0.8'
                  }}
                >
                  Our Bees
                </button>
              </li>

              <li>
                <a href="#" style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  opacity: '0.8',
                  transition: 'opacity 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '1'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '0.8'
                }}
                >
                  About Us
                </a>
              </li>
              <li>
                <a href="#" style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  opacity: '0.8',
                  transition: 'opacity 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '1'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '0.8'
                }}
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 style={{
              fontSize: '1.1rem',
              fontWeight: '700',
              marginBottom: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Legal
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <li>
                <a href="#" style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  opacity: '0.8',
                  transition: 'opacity 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '1'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '0.8'
                }}
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  opacity: '0.8',
                  transition: 'opacity 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '1'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '0.8'
                }}
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  opacity: '0.8',
                  transition: 'opacity 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '1'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '0.8'
                }}
                >
                  Accessibility
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h4 style={{
              fontSize: '1.1rem',
              fontWeight: '700',
              marginBottom: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Stay Updated
            </h4>
            <p style={{
              fontSize: '0.9rem',
              opacity: '0.8',
              marginBottom: '1rem',
              lineHeight: '1.5'
            }}>
              Be the first to know when we launch our AI solutions!
            </p>
            <div style={{
              display: 'flex',
              gap: '0.5rem'
            }}>
              <input
                type="email"
                placeholder="Enter your email"
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '0.9rem'
                }}
              />
              <button style={{
                padding: '0.75rem 1rem',
                background: '#ea580c',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#c2410c'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ea580c'
              }}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          paddingTop: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <p style={{
            fontSize: '0.8rem',
            opacity: '0.7',
            margin: 0
          }}>
            © 2024 B2BEE. All rights reserved.
          </p>
          <div style={{
            display: 'flex',
            gap: '1rem'
          }}>
            <a href="#" style={{
              color: 'white',
              textDecoration: 'none',
              fontSize: '0.8rem',
              opacity: '0.7',
              transition: 'opacity 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.7'
            }}
            >
              Privacy
            </a>
            <a href="#" style={{
              color: 'white',
              textDecoration: 'none',
              fontSize: '0.8rem',
              opacity: '0.7',
              transition: 'opacity 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.7'
            }}
            >
              Terms
            </a>
            <a href="#" style={{
              color: 'white',
              textDecoration: 'none',
              fontSize: '0.8rem',
              opacity: '0.7',
              transition: 'opacity 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.7'
            }}
            >
              Accessibility
            </a>
          </div>
        </div>
      </footer>

      {/* Floating Chat Widget */}
      <div style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 1000
      }}>
        {/* Chat Button */}
        {!isChatOpen && (
          <button
            onClick={() => setIsChatOpen(true)}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #fe8a00 0%, #e67a00 100%)',
              border: 'none',
              boxShadow: '0 8px 24px rgba(254, 138, 0, 0.4)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              animation: 'pulse 2s infinite'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)'
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(254, 138, 0, 0.6)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(254, 138, 0, 0.4)'
            }}
          >
            <Image
              src="/buzz.png"
              alt="Buzz"
              width={30}
              height={30}
              style={{
                borderRadius: '50%'
              }}
            />
          </button>
        )}

        {/* Chat Interface */}
        {isChatOpen && (
          <div style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            width: '350px',
            height: '500px',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Chat Header */}
            <div style={{
              background: 'linear-gradient(135deg, #fe8a00 0%, #e67a00 100%)',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: 'white'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Image
                  src="/buzz.png"
                  alt="Buzz"
                  width={24}
                  height={24}
                  style={{
                    borderRadius: '50%'
                  }}
                />
                <span style={{
                  fontWeight: '600',
                  fontSize: '1rem'
                }}>
                  Chat with Buzz
                </span>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: '0',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>

            {/* Messages Container */}
            <div style={{
              flex: 1,
              padding: '1rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  style={{
                    display: 'flex',
                    justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                    marginBottom: '0.5rem'
                  }}
                >
                  <div style={{
                    maxWidth: '80%',
                    padding: '0.75rem 1rem',
                    borderRadius: '18px',
                    background: message.sender === 'user' 
                      ? 'linear-gradient(135deg, #fe8a00 0%, #e67a00 100%)'
                      : '#f3f4f6',
                    color: message.sender === 'user' ? 'white' : '#374151',
                    fontSize: '0.9rem',
                    lineHeight: '1.4',
                    wordWrap: 'break-word'
                  }}>
                    {message.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  marginBottom: '0.5rem'
                }}>
                  <div style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '18px',
                    background: '#f3f4f6',
                    color: '#374151',
                    fontSize: '0.9rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      gap: '4px',
                      alignItems: 'center'
                    }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#9ca3af',
                        animation: 'bounce 1.4s ease-in-out infinite both'
                      }}></div>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#9ca3af',
                        animation: 'bounce 1.4s ease-in-out infinite both 0.2s'
                      }}></div>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#9ca3af',
                        animation: 'bounce 1.4s ease-in-out infinite both 0.4s'
                      }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input or Newsletter Form */}
            <div style={{
              padding: '1rem',
              borderTop: '1px solid #e5e7eb',
              background: 'white'
            }}>
              {showNewsletterForm ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  <div style={{
                    background: '#f3f4f6',
                    padding: '0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    color: '#374151',
                    textAlign: 'center'
                  }}>
                    Enter your email address
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'center'
                  }}>
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="your@email.com"
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        outline: 'none',
                        fontFamily: 'inherit'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#fe8a00'
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e5e7eb'
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleNewsletterSubscribe()
                        }
                      }}
                    />
                    <button
                      onClick={handleNewsletterSubscribe}
                      disabled={!newsletterEmail.trim() || isSubscribing}
                      style={{
                        padding: '0.75rem 1rem',
                        background: newsletterEmail.trim() && !isSubscribing
                          ? 'linear-gradient(135deg, #fe8a00 0%, #e67a00 100%)'
                          : '#e5e7eb',
                        color: newsletterEmail.trim() && !isSubscribing ? 'white' : '#9ca3af',
                        border: 'none',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        cursor: newsletterEmail.trim() && !isSubscribing ? 'pointer' : 'not-allowed',
                        transition: 'all 0.3s ease',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={(e) => {
                        if (newsletterEmail.trim() && !isSubscribing) {
                          e.currentTarget.style.transform = 'scale(1.05)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (newsletterEmail.trim() && !isSubscribing) {
                          e.currentTarget.style.transform = 'scale(1)'
                        }
                      }}
                    >
                      {isSubscribing ? 'Subscribing...' : 'Subscribe to our newsletter'}
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'flex-end'
                }}>
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      resize: 'none',
                      outline: 'none',
                      fontFamily: 'inherit',
                      minHeight: '40px',
                      maxHeight: '100px'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#fe8a00'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb'
                    }}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    style={{
                      padding: '0.75rem',
                      background: newMessage.trim() 
                        ? 'linear-gradient(135deg, #fe8a00 0%, #e67a00 100%)'
                        : '#e5e7eb',
                      color: newMessage.trim() ? 'white' : '#9ca3af',
                      border: 'none',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (newMessage.trim()) {
                        e.currentTarget.style.transform = 'scale(1.1)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (newMessage.trim()) {
                        e.currentTarget.style.transform = 'scale(1)'
                      }
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Vapi Widget */}
      {isVapiWidgetOpen && (
        <VapiWidget
          publicKey="8855fa42-df57-4574-8cf1-a7888b14166a"
          assistantId="34742276-b3aa-452f-aaea-204f85d884d3"
          mode="voice"
          theme="dark"
          baseBgColor="#000000"
          accentColor="#14B8A6"
          buttonBaseColor="#000000"
          buttonAccentColor="#FFFFFF"
          borderRadius="large"
          size="full"
          position="bottom-right"
          mainLabel="TALK WITH BUZZ"
          startButtonText="Start"
          endButtonText="End Call"
          emptyChatMessage="Hey, How can I help you today?"
          emptyVoiceMessage="Click to start a voice conversation with Buzz!"
          showTranscript={false}
          requireConsent={true}
          termsContent="By using this voice widget, you agree to our privacy policy and terms of service. Your conversations may be recorded for quality assurance."
          localStorageKey="b2bee_widget_consent"
          onCallStart={() => console.log('Voice call started')}
          onCallEnd={() => console.log('Voice call ended')}
          onMessage={(message) => console.log('Message received:', message)}
          onError={(error) => console.error('Widget error:', error)}
        />
      )}

      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 8px 24px rgba(254, 138, 0, 0.4);
          }
          50% {
            box-shadow: 0 8px 24px rgba(254, 138, 0, 0.8);
          }
          100% {
            box-shadow: 0 8px 24px rgba(254, 138, 0, 0.4);
          }
        }
        
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .scrolling-text {
          animation: scroll-left 30s linear infinite;
        }
        
        .bees-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: clamp(20px, 4vw, 32px);
          max-width: 1200px;
          margin: 0 auto;
        }
        
        @media (max-width: 1200px) {
          .bees-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        
        @media (max-width: 900px) {
          .bees-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 600px) {
          .bees-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
