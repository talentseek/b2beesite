'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import LoadingSpinner from '@/components/LoadingSpinner'

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
    console.log('Fetching bees...')
    try {
      const response = await fetch('/api/bees')
      console.log('Response status:', response.status)
      if (response.ok) {
        const data = await response.json()
        console.log('Bees data:', data)
        setBees(data.bees || [])
      } else {
        console.error('Response not ok:', response.status)
      }
    } catch (error) {
      console.error('Error fetching bees:', error)
    } finally {
      console.log('Setting loading to false')
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
    return <LoadingSpinner />
  }

  return (
    <div className="bees-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Meet Our Busy Bees</h1>
          <p>Choose the perfect AI assistant for your business needs. Each bee is specialized in different areas to help your business thrive.</p>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search bees by name, role, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="role-filter">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="role-select"
          >
            {roles.map(role => (
              <option key={role} value={role}>
                {role === 'all' ? 'All Roles' : role}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bees-container">
        {filteredBees.length > 0 ? (
          <div className="bees-grid">
            {filteredBees.map((bee) => (
              <div key={bee.id} className="bee-card">
                <div className="bee-image-container">
                  {bee.image_url ? (
                    <Image
                      src={bee.image_url}
                      alt={bee.name}
                      width={300}
                      height={300}
                      className="bee-avatar"
                    />
                  ) : (
                    <div className="bee-placeholder">🐝</div>
                  )}
                  {bee.price && (
                    <div className="price-sticker">${bee.price}/month</div>
                  )}
                </div>
                <div className="bee-info">
                  <h3>{bee.name}</h3>
                  <div className="bee-role">{bee.role}</div>
                  <p className="bee-description">{bee.description}</p>
                  <div className="bee-actions">
                    <button 
                      className="hire-button"
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
          <div className="no-results">
            <p>No bees found matching your criteria. Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

              <div className="cta-section">
          <div className="cta-background">
            <div className="cta-content">
              <div className="cta-left">
                <div className="buzz-photo">
                  <Image
                    src="/buzz.png"
                    alt="Buzz - Your AI Assistant"
                    width={140}
                    height={140}
                    className="buzz-avatar"
                  />
                  <div className="buzz-status">
                    <div className="status-dot"></div>
                    <span>Online & Ready to Help</span>
                  </div>
                </div>
              </div>
              <div className="cta-right">
                <div className="cta-badge">🤖 AI Assistant</div>
                <h2>Can't find the perfect bee?</h2>
                <p className="cta-description">
                  Let Buzz, your AI recruitment specialist, help you find the right AI assistant for your specific needs. 
                  Get personalized recommendations in seconds!
                </p>
                <div className="cta-features">
                  <div className="feature">
                    <span className="feature-icon">⚡</span>
                    <span>Instant Recommendations</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon">🎯</span>
                    <span>Personalized Matching</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon">💬</span>
                    <span>24/7 Availability</span>
                  </div>
                </div>
                <Link href="/chat" className="chat-with-buzz-btn">
                  <span className="btn-icon">💬</span>
                  <span>Chat with Buzz Now</span>
                  <span className="btn-arrow">→</span>
                </Link>
              </div>
            </div>
          </div>
                </div>

        {/* Footer */}
        <footer className="footer">
          <p>&copy; 2024 B2BEE. All rights reserved.</p>
        </footer>

        <style jsx>{`
        .bees-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #ea3e93 0%, #fe8a00 100%);
        }

        .hero-section {
          padding: 4rem 2rem;
          text-align: center;
          color: white;
        }

        .hero-content h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .hero-content p {
          font-size: 1.25rem;
          max-width: 600px;
          margin: 0 auto;
          opacity: 0.9;
        }

        .filters-section {
          background: rgba(255, 255, 255, 0.95);
          padding: 2rem;
          margin: 0 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          display: flex;
          gap: 1rem;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
        }

        .search-filter {
          flex: 1;
          min-width: 300px;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #fe8a00;
        }

        .role-select {
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
          background: white;
          cursor: pointer;
          transition: border-color 0.3s ease;
        }

        .role-select:focus {
          outline: none;
          border-color: #fe8a00;
        }

        .bees-container {
          padding: 3rem 2rem;
        }

        .bees-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .bee-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(10px);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .bee-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.2);
        }

        .bee-image-container {
          height: 250px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
          position: relative;
          overflow: hidden;
          border-radius: 16px 16px 0 0;
        }

        .bee-avatar {
          object-fit: cover;
          width: 100%;
          height: 100%;
          border-radius: 16px 16px 0 0;
        }

        .price-sticker {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: linear-gradient(135deg, #fe8a00 0%, #e67a00 100%);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 700;
          font-size: 0.9rem;
          box-shadow: 0 4px 12px rgba(254, 138, 0, 0.3);
          backdrop-filter: blur(10px);
        }

        .bee-placeholder {
          font-size: 5rem;
          opacity: 0.7;
        }

        .bee-info {
          padding: 2rem;
        }

        .bee-info h3 {
          color: #2d3748;
          font-size: 1.5rem;
          margin: 0 0 0.5rem 0;
          font-weight: 700;
        }

        .bee-role {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
          display: inline-block;
          margin-bottom: 1rem;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        .bee-description {
          color: #4a5568;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .bee-actions {
          display: flex;
          gap: 1rem;
        }

        .hire-button {
          background: #fe8a00;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          flex: 1;
        }

        .hire-button:hover {
          background: #e67a00;
          transform: translateY(-2px);
        }



        .no-results {
          text-align: center;
          padding: 3rem;
          color: white;
          font-size: 1.2rem;
        }

        .cta-section {
          margin: 4rem 2rem;
        }

        .cta-background {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 24px;
          padding: 3rem;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
        }

        .cta-background::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          pointer-events: none;
        }

        .cta-content {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 3rem;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .cta-left {
          text-align: center;
        }

        .buzz-photo {
          position: relative;
          margin-bottom: 1rem;
        }

        .buzz-avatar {
          border-radius: 50%;
          border: 6px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
          background: white;
        }

        .buzz-status {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1rem;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.9);
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: #4ade80;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .cta-right {
          color: white;
        }

        .cta-badge {
          display: inline-block;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 1rem;
          backdrop-filter: blur(10px);
        }

        .cta-right h2 {
          font-size: 2.5rem;
          font-weight: 800;
          margin: 0 0 1rem 0;
          line-height: 1.2;
        }

        .cta-description {
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 2rem;
          opacity: 0.95;
        }

        .cta-features {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1rem;
        }

        .feature-icon {
          font-size: 1.2rem;
          width: 24px;
          text-align: center;
        }

        .chat-with-buzz-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          background: linear-gradient(135deg, #fe8a00 0%, #e67a00 100%);
          color: white;
          text-decoration: none;
          padding: 1.25rem 2rem;
          border-radius: 50px;
          font-weight: 700;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          box-shadow: 0 8px 24px rgba(254, 138, 0, 0.4);
          position: relative;
          overflow: hidden;
        }

        .chat-with-buzz-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .chat-with-buzz-btn:hover::before {
          left: 100%;
        }

        .chat-with-buzz-btn:hover {
          background: linear-gradient(135deg, #e67a00 0%, #d46a00 100%);
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(254, 138, 0, 0.5);
        }

        .btn-icon {
          font-size: 1.2rem;
        }

        .btn-arrow {
          font-size: 1.3rem;
          transition: transform 0.3s ease;
        }

        .chat-with-buzz-btn:hover .btn-arrow {
          transform: translateX(4px);
        }

        @media (max-width: 768px) {
          .hero-content h1 {
            font-size: 2rem;
          }

          .hero-content p {
            font-size: 1rem;
          }

          .filters-section {
            margin: 0 1rem;
            padding: 1.5rem;
            flex-direction: column;
          }

          .search-filter {
            min-width: auto;
            width: 100%;
          }

          .bees-container {
            padding: 2rem 1rem;
          }

          .bees-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .bee-info {
            padding: 1.5rem;
          }

          .bee-actions {
            flex-direction: column;
          }

          .cta-content {
            grid-template-columns: 1fr;
            gap: 2rem;
            text-align: center;
          }

          .cta-right h2 {
            font-size: 2rem;
          }

          .cta-features {
            align-items: center;
          }

          .feature {
            justify-content: center;
          }

          .footer {
            padding: 2rem;
            text-align: center;
            color: white;
            opacity: 0.9;
            font-size: 0.875rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          }
        }
      `}</style>
    </div>
  )
} 