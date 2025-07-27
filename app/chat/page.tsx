'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import Link from 'next/link';

export default function ChatPage() {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTyping, setShowTyping] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const [screenWidth, setScreenWidth] = useState(0);

  // Set screen width on client side only
  useEffect(() => {
    setScreenWidth(window.innerWidth);
    
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Simulate Buzz typing and sending the first message
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTyping(false);
      setMessages([
        {
          text: "Hey there! I'm Buzz, your AI business assistant! I'm here to help your business *buzz* with efficiency and make sure you never get *stung* by missed opportunities. How can I help *pollinate* your business growth today? ✨",
          isUser: false,
        },
      ]);
    }, 2000); // Show typing for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleSend = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = { text: inputMessage, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate loading delay and show standard response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: "Thanks for your message! I'm still learning and will be fully operational soon. In the meantime, why not subscribe to our newsletter to be the first to know when I'm ready to help your business? 🐝✨", 
        isUser: false 
      }]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newsletterEmail.trim()) {
      setNewsletterStatus('error');
      setNewsletterMessage('Please enter your email address');
      return;
    }

    setNewsletterStatus('loading');
    setNewsletterMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newsletterEmail.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setNewsletterStatus('success');
        setNewsletterMessage(data.message);
        setNewsletterEmail('');
        
        // Track successful subscription
        fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventType: 'email_subscription',
            eventData: { email: newsletterEmail.trim() }
          })
        });
      } else {
        setNewsletterStatus('error');
        setNewsletterMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setNewsletterStatus('error');
      setNewsletterMessage('Network error. Please check your connection and try again.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: '60px'
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
            width={48}
            height={48}
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
          alignItems: 'center',
          gap: '6px',
          color: 'white',
          fontSize: '12px'
        }}>
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#22c55e',
            animation: 'pulse 2s infinite'
          }}></div>
          <span style={{ display: screenWidth < 360 ? 'none' : 'inline' }}>
            Online
          </span>
        </div>
      </div>

      {/* Chat Container */}
      <div style={{
        flex: '1',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        padding: 'clamp(12px, 3vw, 24px)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: 'clamp(12px, 4vw, 20px)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 140px)',
          overflow: 'hidden'
        }}>
          {/* Chat Header */}
          <div style={{
            padding: 'clamp(16px, 4vw, 24px) clamp(16px, 4vw, 32px)',
            borderBottom: '1px solid #e5e7eb',
            backgroundColor: '#fafafa',
            borderTopLeftRadius: 'clamp(12px, 4vw, 20px)',
            borderTopRightRadius: 'clamp(12px, 4vw, 20px)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(12px, 3vw, 16px)'
            }}>
              <div style={{
                width: 'clamp(36px, 8vw, 48px)',
                height: 'clamp(36px, 8vw, 48px)',
                borderRadius: '50%',
                backgroundColor: '#f97316',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'clamp(18px, 4vw, 24px)'
              }}>
                <Image src="/buzz.png" alt="Buzz" width={48} height={48} />
              </div>
              <div>
                <h1 style={{
                  fontSize: 'clamp(18px, 4vw, 24px)',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  margin: '0'
                }}>
                  Chat with Buzz
                </h1>
                <p style={{
                  fontSize: 'clamp(12px, 3vw, 14px)',
                  color: '#6b7280',
                  margin: '4px 0 0 0'
                }}>
                  Your AI assistant is ready to help
                </p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div style={{
            flex: '1',
            overflowY: 'auto',
            padding: 'clamp(16px, 4vw, 24px) clamp(16px, 4vw, 32px)',
            backgroundColor: '#f9fafb'
          }}>
            {messages.length === 0 && !showTyping ? (
              <div style={{
                textAlign: 'center',
                padding: 'clamp(40px, 10vw, 60px) clamp(16px, 4vw, 20px)',
                color: '#6b7280'
              }}>
                <div style={{
                  fontSize: 'clamp(36px, 10vw, 48px)',
                  marginBottom: 'clamp(12px, 3vw, 16px)'
                }}>
                  <Image src="/buzz.png" alt="Buzz" width={48} height={48} />
                </div>
                <h2 style={{
                  fontSize: 'clamp(20px, 5vw, 24px)',
                  fontWeight: '600',
                  color: '#374151',
                  margin: '0 0 clamp(6px, 2vw, 8px) 0'
                }}>
                  Welcome to B2BEE Chat!
                </h2>
                <p style={{
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  margin: '0 0 clamp(16px, 4vw, 24px) 0',
                  lineHeight: '1.5'
                }}>
                  I'm Buzz, your AI assistant. How can I help you today?
                </p>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 'clamp(6px, 2vw, 8px)',
                  justifyContent: 'center',
                  maxWidth: 'min(400px, 90vw)',
                  margin: '0 auto'
                }}>
                  {['Tell me about B2BEE', 'How can AI help my business?', 'What services do you offer?', 'Get started'].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setInputMessage(suggestion)}
                      style={{
                        padding: 'clamp(6px, 2vw, 8px) clamp(12px, 3vw, 16px)',
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: 'clamp(16px, 4vw, 20px)',
                        fontSize: 'clamp(12px, 3vw, 14px)',
                        color: '#374151',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f97316'
                        e.currentTarget.style.color = 'white'
                        e.currentTarget.style.borderColor = '#f97316'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white'
                        e.currentTarget.style.color = '#374151'
                        e.currentTarget.style.borderColor = '#e5e7eb'
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
                          ) : showTyping ? (
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-end',
                  gap: 'clamp(8px, 2vw, 12px)'
                }}>
                  <div style={{
                    width: 'clamp(28px, 6vw, 32px)',
                    height: 'clamp(28px, 6vw, 32px)',
                    borderRadius: '50%',
                    backgroundColor: '#f97316',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'clamp(14px, 3vw, 16px)',
                    flexShrink: 0
                  }}>
                    <Image src="/buzz.png" alt="Buzz" width={32} height={32} />
                  </div>
                  <div style={{
                    padding: 'clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 16px)',
                    borderRadius: 'clamp(14px, 3.5vw, 18px) clamp(14px, 3.5vw, 18px) clamp(14px, 3.5vw, 18px) 4px',
                    backgroundColor: 'white',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'clamp(3px, 1vw, 4px)'
                  }}>
                    <div style={{
                      width: 'clamp(6px, 1.5vw, 8px)',
                      height: 'clamp(6px, 1.5vw, 8px)',
                      borderRadius: '50%',
                      backgroundColor: '#f97316',
                      animation: 'bounce 1.4s infinite ease-in-out both'
                    }}></div>
                    <div style={{
                      width: 'clamp(6px, 1.5vw, 8px)',
                      height: 'clamp(6px, 1.5vw, 8px)',
                      borderRadius: '50%',
                      backgroundColor: '#f97316',
                      animation: 'bounce 1.4s infinite ease-in-out both 0.2s'
                    }}></div>
                    <div style={{
                      width: 'clamp(6px, 1.5vw, 8px)',
                      height: 'clamp(6px, 1.5vw, 8px)',
                      borderRadius: '50%',
                      backgroundColor: '#f97316',
                      animation: 'bounce 1.4s infinite ease-in-out both 0.4s'
                    }}></div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vw, 16px)' }}>
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                        alignItems: 'flex-end',
                        gap: 'clamp(8px, 2vw, 12px)'
                      }}
                    >
                      {!message.isUser && (
                        <div style={{
                          width: 'clamp(28px, 6vw, 32px)',
                          height: 'clamp(28px, 6vw, 32px)',
                          borderRadius: '50%',
                          backgroundColor: '#f97316',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 'clamp(14px, 3vw, 16px)',
                          flexShrink: 0
                        }}>
                          <Image src="/buzz.png" alt="Buzz" width={32} height={32} />
                        </div>
                      )}
                      <div
                        style={{
                          maxWidth: 'min(70%, calc(100vw - 120px))',
                          padding: 'clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 16px)',
                          borderRadius: message.isUser ? 'clamp(14px, 3.5vw, 18px) clamp(14px, 3.5vw, 18px) 4px clamp(14px, 3.5vw, 18px)' : 'clamp(14px, 3.5vw, 18px) clamp(14px, 3.5vw, 18px) clamp(14px, 3.5vw, 18px) 4px',
                          backgroundColor: message.isUser ? '#f97316' : 'white',
                          color: message.isUser ? 'white' : '#1f2937',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                          fontSize: 'clamp(14px, 3.5vw, 15px)',
                          lineHeight: '1.4',
                          wordWrap: 'break-word'
                        }}
                      >
                        {message.text}
                        {!message.isUser && message.text.includes("subscribe to our newsletter") && (
                          <div style={{
                            marginTop: 'clamp(12px, 3vw, 16px)',
                            padding: 'clamp(12px, 3vw, 16px)',
                            backgroundColor: '#fef3c7',
                            borderRadius: 'clamp(8px, 2vw, 12px)',
                            border: '1px solid #f59e0b'
                          }}>
                            {newsletterStatus === 'success' ? (
                              <div style={{
                                color: '#166534',
                                fontSize: 'clamp(12px, 3vw, 14px)',
                                fontWeight: '500'
                              }}>
                                ✅ {newsletterMessage}
                              </div>
                            ) : (
                              <form onSubmit={handleNewsletterSubmit} style={{ width: '100%' }}>
                                <div style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: 'clamp(8px, 2vw, 12px)'
                                }}>
                                  <Input
                                    type="email"
                                    value={newsletterEmail}
                                    onChange={(e) => setNewsletterEmail(e.target.value)}
                                    placeholder="Enter your email address"
                                    disabled={newsletterStatus === 'loading'}
                                    required
                                    style={{
                                      padding: 'clamp(8px, 2vw, 10px) clamp(12px, 3vw, 16px)',
                                      fontSize: 'clamp(12px, 3vw, 14px)',
                                      borderRadius: 'clamp(6px, 1.5vw, 8px)',
                                      border: '1px solid #d1d5db',
                                      backgroundColor: 'white',
                                      color: '#374151',
                                      outline: 'none',
                                      transition: 'all 0.2s ease'
                                    }}
                                    onFocus={(e) => {
                                      e.target.style.borderColor = '#f97316'
                                      e.target.style.boxShadow = '0 0 0 2px rgba(249, 115, 22, 0.1)'
                                    }}
                                    onBlur={(e) => {
                                      e.target.style.borderColor = '#d1d5db'
                                      e.target.style.boxShadow = 'none'
                                    }}
                                  />
                                  <Button
                                    type="submit"
                                    disabled={newsletterStatus === 'loading'}
                                    style={{
                                      backgroundColor: '#f97316',
                                      color: 'white',
                                      border: 'none',
                                      padding: 'clamp(8px, 2vw, 10px) clamp(16px, 4vw, 20px)',
                                      fontSize: 'clamp(12px, 3vw, 14px)',
                                      borderRadius: 'clamp(6px, 1.5vw, 8px)',
                                      cursor: 'pointer',
                                      fontWeight: '600',
                                      transition: 'all 0.2s ease',
                                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.backgroundColor = '#ea580c'
                                      e.currentTarget.style.transform = 'translateY(-1px)'
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.backgroundColor = '#f97316'
                                      e.currentTarget.style.transform = 'translateY(0)'
                                    }}
                                  >
                                    {newsletterStatus === 'loading' ? 'Subscribing...' : 'Subscribe to our newsletter'}
                                  </Button>
                                  {newsletterStatus === 'error' && (
                                    <p style={{ 
                                      color: '#ef4444', 
                                      fontSize: 'clamp(10px, 2.5vw, 12px)', 
                                      margin: '0' 
                                    }}>
                                      {newsletterMessage}
                                    </p>
                                  )}
                                </div>
                              </form>
                            )}
                          </div>
                        )}
                      </div>
                      {message.isUser && (
                        <div style={{
                          width: 'clamp(28px, 6vw, 32px)',
                          height: 'clamp(28px, 6vw, 32px)',
                          borderRadius: '50%',
                          backgroundColor: '#e5e7eb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 'clamp(12px, 3vw, 14px)',
                          color: '#6b7280',
                          flexShrink: 0
                        }}>
                          👤
                        </div>
                      )}
                    </div>
                  ))}
                {isLoading && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-end',
                    gap: 'clamp(8px, 2vw, 12px)'
                  }}>
                    <div style={{
                      width: 'clamp(28px, 6vw, 32px)',
                      height: 'clamp(28px, 6vw, 32px)',
                      borderRadius: '50%',
                      backgroundColor: '#f97316',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 'clamp(14px, 3vw, 16px)',
                      flexShrink: 0
                    }}>
                      <Image src="/buzz.png" alt="Buzz" width={32} height={32} />
                    </div>
                    <div style={{
                      padding: 'clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 16px)',
                      borderRadius: 'clamp(14px, 3.5vw, 18px) clamp(14px, 3.5vw, 18px) clamp(14px, 3.5vw, 18px) 4px',
                      backgroundColor: 'white',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'clamp(3px, 1vw, 4px)'
                    }}>
                      <div style={{
                        width: 'clamp(6px, 1.5vw, 8px)',
                        height: 'clamp(6px, 1.5vw, 8px)',
                        borderRadius: '50%',
                        backgroundColor: '#f97316',
                        animation: 'bounce 1.4s infinite ease-in-out both'
                      }}></div>
                      <div style={{
                        width: 'clamp(6px, 1.5vw, 8px)',
                        height: 'clamp(6px, 1.5vw, 8px)',
                        borderRadius: '50%',
                        backgroundColor: '#f97316',
                        animation: 'bounce 1.4s infinite ease-in-out both 0.2s'
                      }}></div>
                      <div style={{
                        width: 'clamp(6px, 1.5vw, 8px)',
                        height: 'clamp(6px, 1.5vw, 8px)',
                        borderRadius: '50%',
                        backgroundColor: '#f97316',
                        animation: 'bounce 1.4s infinite ease-in-out both 0.4s'
                      }}></div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div style={{
            padding: 'clamp(16px, 4vw, 24px) clamp(16px, 4vw, 32px)',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: 'white',
            borderBottomLeftRadius: 'clamp(12px, 4vw, 20px)',
            borderBottomRightRadius: 'clamp(12px, 4vw, 20px)'
          }}>
            <div 
              className="input-container"
              style={{
                display: 'flex',
                gap: 'clamp(8px, 2vw, 12px)',
                alignItems: 'flex-end',
                width: '100%'
              }}
            >
              <div 
                className="input-field"
                style={{ 
                  flex: '1',
                  minWidth: '0' // Prevents flex item from overflowing
                }}
              >
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  style={{
                    padding: 'clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 16px)',
                    fontSize: 'clamp(14px, 3.5vw, 16px)',
                    borderRadius: 'clamp(8px, 2vw, 12px)',
                    border: '2px solid #e5e7eb',
                    backgroundColor: 'white',
                    color: '#374151',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#f97316'
                    e.target.style.boxShadow = '0 0 0 3px rgba(249, 115, 22, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>
              <Button
                className="send-button"
                onClick={handleSend}
                disabled={isLoading || !inputMessage.trim()}
                style={{
                  backgroundColor: inputMessage.trim() ? '#f97316' : '#e5e7eb',
                  color: inputMessage.trim() ? 'white' : '#9ca3af',
                  border: 'none',
                  padding: 'clamp(10px, 2.5vw, 12px) clamp(16px, 4vw, 20px)',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  borderRadius: 'clamp(8px, 2vw, 12px)',
                  cursor: inputMessage.trim() ? 'pointer' : 'not-allowed',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  minWidth: 'clamp(60px, 15vw, 80px)',
                  flexShrink: 0 // Prevents button from shrinking
                }}
                onMouseEnter={(e) => {
                  if (inputMessage.trim()) {
                    e.currentTarget.style.backgroundColor = '#ea580c'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                    e.currentTarget.style.boxShadow = '0 6px 8px -1px rgba(0, 0, 0, 0.15)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (inputMessage.trim()) {
                    e.currentTarget.style.backgroundColor = '#f97316'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }
                }}
              >
                {isLoading ? '...' : 'Send'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        
        /* Mobile-specific improvements */
        @media (max-width: 768px) {
          /* Prevent zoom on input focus */
          input[type="text"], input[type="email"] {
            font-size: 16px !important;
          }
          
          /* Improve touch targets */
          button {
            min-height: 44px;
          }
          
          /* Ensure proper flex layout */
          .input-container {
            display: flex !important;
            gap: 8px !important;
            width: 100% !important;
          }
          
          .input-field {
            flex: 1 !important;
            min-width: 0 !important;
          }
          
          .send-button {
            flex-shrink: 0 !important;
            min-width: 60px !important;
          }
        }
        
        /* Prevent horizontal scroll on very small screens */
        @media (max-width: 480px) {
          * {
            max-width: 100vw;
          }
          
          /* Ensure input and button don't overlap */
          .input-container {
            gap: 6px !important;
          }
          
          .send-button {
            min-width: 50px !important;
            padding: 10px 12px !important;
          }
        }
      `}</style>
    </div>
  );
}

