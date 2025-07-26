'use client'

import { useState } from 'react'

export default function EmailSubscription() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setStatus('error')
      setMessage('Please enter your email address')
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage(data.message)
        setEmail('')
        
        // Track successful subscription
        fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventType: 'email_subscription',
            eventData: { email: email.trim() }
          })
        })
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Network error. Please check your connection and try again.')
    }
  }

  const handleButtonClick = () => {
    // Track button click
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'button_click',
        eventData: { button: 'get_notified' }
      })
    })
  }

  return (
    <div className="email-subscription">
      {status === 'success' ? (
        <div className="success-message">
          <p>{message}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="subscription-form">
          <div className="input-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="email-input"
              disabled={status === 'loading'}
              required
            />
            <button
              type="submit"
              className="notify-button"
              disabled={status === 'loading'}
              onClick={handleButtonClick}
            >
              {status === 'loading' ? 'Subscribing...' : 'Get Notified'}
            </button>
          </div>
          {status === 'error' && (
            <p className="error-message">{message}</p>
          )}
        </form>
      )}
    </div>
  )
} 