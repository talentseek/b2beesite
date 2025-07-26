'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import './chat.css'

interface Message {
  id: number
  text: string
  sender: 'buzz' | 'user'
  timestamp: Date
  isTyping?: boolean
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isClient, setIsClient] = useState(false)
  const [isTyping, setIsTyping] = useState(true)
  const [email, setEmail] = useState('')
  const [subStatus, setSubStatus] = useState<'idle' | 'loading' | 'success' | 'error'>("idle")
  const [subMessage, setSubMessage] = useState('')

  useEffect(() => {
    setIsClient(true)
    
    // Animated welcome message
    const welcomeText = "Hey there! 🐝 I'm Buzz, your AI business assistant! I'm here to help your business *buzz* with efficiency and make sure you never get *stung* by missed opportunities. How can I help *pollinate* your business growth today? 🌸✨"
    
    let currentIndex = 0
    const typeInterval = setInterval(() => {
      if (currentIndex <= welcomeText.length) {
        setMessages([{
          id: 1,
          text: welcomeText.slice(0, currentIndex),
          sender: 'buzz',
          timestamp: new Date(),
          isTyping: currentIndex < welcomeText.length
        }])
        currentIndex++
      } else {
        setIsTyping(false)
        clearInterval(typeInterval)
      }
    }, 20) // Even faster typing speed

    return () => clearInterval(typeInterval)
  }, [])

  const formatTime = (date: Date) => {
    if (!isClient) return '' // Return empty string during SSR
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || isTyping) return

    const userMessage: Message = {
      id: messages.length + 1,
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages([...messages, userMessage])
    setNewMessage('')

    // Simulate Buzz response
    setTimeout(() => {
      const buzzResponse: Message = {
        id: messages.length + 2,
        text: "Thanks for your message! I'm still learning and will be fully operational soon. In the meantime, why not subscribe to our newsletter to be the first to know when I'm ready to help your business? 🐝✨",
        sender: 'buzz',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, buzzResponse])
    }, 1000)
  }

  // Subscription handler
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubStatus('loading')
    setSubMessage('')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      if (res.ok) {
        setSubStatus('success')
        setSubMessage('You are now subscribed!')
      } else {
        setSubStatus('error')
        setSubMessage(data.error || 'Subscription failed.')
      }
    } catch (err) {
      setSubStatus('error')
      setSubMessage('Subscription failed. Please try again.')
    }
  }

  return (
    <main className="chat-container">
      <div className="chat-header">
        <Link href="/" className="back-button">
          ← Back to Home
        </Link>
        <div className="chat-title">
          <Image
            src="/buzz.png"
            alt="Buzz"
            width={50}
            height={50}
            className="buzz-avatar"
          />
          <h1>Chat with Buzz</h1>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message, idx) => (
          <div
            key={message.id}
            className={`message ${message.sender === 'buzz' ? 'buzz-message' : 'user-message'}`}
          >
            {message.sender === 'buzz' && (
              <Image
                src="/buzz.png"
                alt="Buzz"
                width={40}
                height={40}
                className="message-avatar"
              />
            )}
            <div className="message-content">
              <p>
                {message.text}
                {message.isTyping && <span className="typing-cursor">|</span>}
              </p>
              <span className="message-time">
                {formatTime(message.timestamp)}
              </span>
              {/* Show subscription input after Buzz's final message */}
              {idx === messages.length - 1 && message.sender === 'buzz' && !message.isTyping && messages.length > 1 && subStatus !== 'success' && (
                <form onSubmit={handleSubscribe} className="chat-subscribe-form">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email to subscribe"
                    className="chat-subscribe-input"
                    required
                    disabled={subStatus === 'loading'}
                  />
                  <button
                    type="submit"
                    className="chat-subscribe-button"
                    disabled={subStatus === 'loading' || !email.trim()}
                  >
                    {subStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </form>
              )}
              {/* Show success or error message */}
              {idx === messages.length - 1 && message.sender === 'buzz' && subStatus === 'success' && (
                <div className="chat-subscribe-success">{subMessage}</div>
              )}
              {idx === messages.length - 1 && message.sender === 'buzz' && subStatus === 'error' && (
                <div className="chat-subscribe-error">{subMessage}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="chat-input-form">
        <div className="input-group">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={isTyping ? "Buzz is typing..." : "Type your message..."}
            className="chat-input"
            disabled={isTyping || messages.length > 2} // Disable during typing or after first exchange
          />
          <button
            type="submit"
            className="send-button"
            disabled={!newMessage.trim() || isTyping || messages.length > 2}
          >
            Send
          </button>
        </div>
        {messages.length > 2 && (
          <p className="demo-notice">
            This is a demo chat. Subscribe to our newsletter to be notified when Buzz is fully operational!
          </p>
        )}
      </form>

      <div className="chat-footer">
        <p>B2BEE - AI Support Coming Soon</p>
      </div>
    </main>
  )
} 