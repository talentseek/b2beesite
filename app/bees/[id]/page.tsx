'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
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

export default function BeeProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [bee, setBee] = useState<Bee | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
    const averageSalary = 50000 // Average annual salary
    const monthlySalary = averageSalary / 12
    const monthlySavings = monthlySalary - beePrice
    const annualSavings = monthlySavings * 12
    return { monthlySavings, annualSavings }
  }

  if (loading) {
    return (
      <div className="bee-profile-page">
        <div className="loading-section">
          <div className="bee-spinner">
            <div className="bee">🐝</div>
            <div className="bee">🐝</div>
            <div className="bee">🐝</div>
          </div>
          <p className="loading-text">Loading bee profile...</p>
        </div>
      </div>
    )
  }

  if (error || !bee) {
    return (
      <div className="bee-profile-page">
        <div className="error-section">
          <h1>Bee Not Found</h1>
          <p>{error || 'The bee you\'re looking for doesn\'t exist.'}</p>
          <Link href="/bees" className="back-button">
            Back to All Bees
          </Link>
        </div>
      </div>
    )
  }

  const savings = bee.price ? calculateSavings(bee.price) : null

  return (
    <div className="bee-profile-page">
      <div className="hero-section">
        <div className="hero-content">
          <Link href="/bees" className="back-link">
            ← Back to All Bees
          </Link>
          <div className="bee-header">
            <div className="bee-image-large">
              {bee.image_url ? (
                <Image
                  src={bee.image_url}
                  alt={bee.name}
                  width={400}
                  height={400}
                  className="bee-avatar-large"
                />
              ) : (
                <div className="bee-placeholder-large">🐝</div>
              )}
            </div>
            <div className="bee-intro">
              <h1>{bee.name}</h1>
              <div className="bee-role-large">{bee.role}</div>
              <p className="bee-description-large">{bee.description}</p>
              {bee.price && (
                <div className="bee-price-large">
                  <span className="price-amount">${bee.price}</span>
                  <span className="price-period">/month</span>
                </div>
              )}
              <div className="bee-actions-large">
                <button className="hire-button-large">
                  Hire {bee.name}
                </button>
                <button className="contact-button">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="content-section">
        <div className="container">
          <div className="main-content">
            <div className="section">
              <h2>Meet Your New AI Dream Team – No Sick Days, No HR Headaches! 🐝</h2>
              <p className="lead">
                Why hire one person when you can have a whole hive of AI agents working around the clock for a fraction of the cost?
              </p>
              
              <p>
                At B2BEE, we're flipping recruitment on its head:
              </p>
              <ul>
                <li>Choose your perfect team member – {bee.name} is ready to work!</li>
                <li>We handle the rest – onboarding, training, updates… no HR dramas, no coffee breaks.</li>
                <li>Always on – 24/7 availability, buzzing with productivity.</li>
              </ul>

              <p>Imagine a world where:</p>
              <ul>
                <li>No one takes a day off</li>
                <li>No one asks for a raise</li>
                <li>And your calls, leads, and admin just… get done!</li>
              </ul>

              <p>
                From as little as a fraction of the cost of a full-time hire, your new AI teammate will transform how you work.
              </p>
            </div>

            <div className="section">
              <h2>What Your B2BEE Agent Can Do For You:</h2>
              <ul>
                <li>Book meetings, appointments, and property viewings</li>
                <li>Make outbound sales calls and follow up with prospects</li>
                <li>Generate new leads and keep your pipeline buzzing</li>
                <li>Send appointment reminders so no one forgets</li>
                <li>Re-engage old sales leads and warm them back up</li>
                <li>Share offers and promotions with your audience</li>
              </ul>
              <p>
                And they'll do it all across email, phone, Facebook, Instagram, and LinkedIn – so your new team Bee takes care of the heavy lifting while you focus on closing deals.
              </p>
            </div>

            {savings && (
              <div className="section savings-section">
                <h2>💰 Cost Savings Comparison</h2>
                <div className="savings-grid">
                  <div className="savings-card traditional">
                    <h3>Traditional Hire</h3>
                    <div className="cost">$4,167/month</div>
                    <div className="cost-breakdown">
                      <p>• Base salary: $3,500</p>
                      <p>• Benefits: $500</p>
                      <p>• Overhead: $167</p>
                    </div>
                    <div className="limitations">
                      <p>• 8 hours/day availability</p>
                      <p>• Sick days & vacation</p>
                      <p>• Training time</p>
                      <p>• HR management</p>
                    </div>
                  </div>
                  <div className="savings-card ai">
                    <h3>AI {bee.name}</h3>
                    <div className="cost">${bee.price}/month</div>
                    <div className="benefits">
                      <p>• 24/7 availability</p>
                      <p>• No sick days</p>
                      <p>• Instant onboarding</p>
                      <p>• No HR overhead</p>
                    </div>
                    <div className="savings-highlight">
                      <p>You save <strong>${savings.monthlySavings.toLocaleString()}/month</strong></p>
                      <p>That's <strong>${savings.annualSavings.toLocaleString()}/year!</strong></p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="section">
              <h2>Ready to Transform Your Business?</h2>
              <p>
                Join hundreds of businesses that have already discovered the power of AI-driven productivity. 
                {bee.name} is ready to start working for you today!
              </p>
              <div className="cta-buttons">
                <button className="hire-button-large">
                  Hire {bee.name} Now
                </button>
                <Link href="/chat" className="chat-button">
                  Chat with Buzz
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bee-profile-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #ea3e93 0%, #fe8a00 100%);
        }

        .hero-section {
          padding: 4rem 2rem;
          color: white;
        }

        .hero-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .back-link {
          color: white;
          text-decoration: none;
          font-size: 1.1rem;
          margin-bottom: 2rem;
          display: inline-block;
          opacity: 0.9;
          transition: opacity 0.3s ease;
        }

        .back-link:hover {
          opacity: 1;
        }

        .bee-header {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 3rem;
          align-items: center;
        }

        .bee-image-large {
          text-align: center;
        }

        .bee-avatar-large {
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          object-fit: cover;
        }

        .bee-placeholder-large {
          width: 400px;
          height: 400px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8rem;
          backdrop-filter: blur(10px);
        }

        .bee-intro h1 {
          font-size: 3.5rem;
          margin-bottom: 0.5rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .bee-role-large {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          opacity: 0.9;
          font-weight: 500;
        }

        .bee-description-large {
          font-size: 1.25rem;
          margin-bottom: 2rem;
          line-height: 1.6;
          opacity: 0.9;
        }

        .bee-price-large {
          margin-bottom: 2rem;
        }

        .price-amount {
          font-size: 2.5rem;
          font-weight: bold;
        }

        .price-period {
          font-size: 1.5rem;
          opacity: 0.8;
        }

        .bee-actions-large {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .hire-button-large {
          background: #205b41;
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-size: 1.2rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .hire-button-large:hover {
          background: #1a4a35;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }

        .contact-button {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid white;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-size: 1.2rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .contact-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .content-section {
          background: white;
          padding: 4rem 2rem;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section {
          margin-bottom: 4rem;
        }

        .section h2 {
          font-size: 2.5rem;
          color: #205b41;
          margin-bottom: 1.5rem;
        }

        .lead {
          font-size: 1.3rem;
          color: #666;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .section p {
          font-size: 1.1rem;
          line-height: 1.7;
          color: #444;
          margin-bottom: 1.5rem;
        }

        .section ul {
          margin: 1.5rem 0;
          padding-left: 2rem;
        }

        .section li {
          font-size: 1.1rem;
          line-height: 1.7;
          color: #444;
          margin-bottom: 0.5rem;
        }

        .savings-section {
          background: linear-gradient(135deg, #ea3e93 0%, #fe8a00 100%);
          padding: 3rem;
          border-radius: 20px;
          margin: 3rem 0;
          color: white;
        }

        .savings-section h2 {
          color: white;
          text-align: center;
        }

        .savings-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-top: 2rem;
        }

        .savings-card {
          padding: 2rem;
          border-radius: 15px;
          text-align: center;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .savings-card.traditional {
          border: 2px solid #e5e7eb;
        }

        .savings-card.ai {
          background: #205b41;
          color: white;
          border: 2px solid #205b41;
        }

        .savings-card h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #205b41;
        }

        .savings-card.ai h3 {
          color: white;
        }

        .cost {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 1rem;
          color: #205b41;
        }

        .savings-card.ai .cost {
          color: white;
        }

        .cost-breakdown, .benefits {
          text-align: left;
          margin-bottom: 1rem;
        }

        .cost-breakdown p, .benefits p {
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
          color: #666;
        }

        .savings-card.ai .cost-breakdown p,
        .savings-card.ai .benefits p {
          color: rgba(255, 255, 255, 0.9);
        }

        .limitations {
          text-align: left;
          color: #666;
        }

        .limitations p {
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
        }

        .savings-highlight {
          background: #fe8a00;
          color: white;
          padding: 1.5rem;
          border-radius: 15px;
          margin-top: 1rem;
          text-align: center;
        }

        .savings-highlight p {
          margin-bottom: 0.5rem;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .savings-highlight strong {
          font-size: 1.4rem;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 2rem;
        }

        .chat-button {
          background: #ea3e93;
          color: white;
          text-decoration: none;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-size: 1.2rem;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .chat-button:hover {
          background: #d63384;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }

        .loading-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          text-align: center;
          color: white;
        }

        .bee-spinner {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }

        .bee {
          font-size: 2rem;
          animation: bounce 1.4s ease-in-out infinite both;
        }

        .bee:nth-child(1) {
          animation-delay: -0.32s;
        }

        .bee:nth-child(2) {
          animation-delay: -0.16s;
        }

        .bee:nth-child(3) {
          animation-delay: 0s;
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }

        .loading-text {
          font-size: 1.2rem;
          font-weight: 500;
          opacity: 0.9;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .error-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          color: white;
          text-align: center;
        }

        .error-section h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .error-section p {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          opacity: 0.9;
        }

        .back-button {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          text-decoration: none;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-weight: 600;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .back-button:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        @media (max-width: 768px) {
          .bee-header {
            grid-template-columns: 1fr;
            gap: 2rem;
            text-align: center;
          }

          .bee-intro h1 {
            font-size: 2.5rem;
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