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
      <div className="bees-page">
        <div className="loading">Loading our busy bees...</div>
      </div>
    )
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
                <div className="bee-image">
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
                </div>
                <div className="bee-info">
                  <h3>{bee.name}</h3>
                  <div className="bee-role">{bee.role}</div>
                  <p className="bee-description">{bee.description}</p>
                  {bee.price && (
                    <div className="bee-price">${bee.price}/month</div>
                  )}
                  <div className="bee-actions">
                    <button className="hire-button">
                      Hire {bee.name}
                    </button>
                    <Link href={`/bees/${bee.id}`} className="learn-more-button">
                      Learn More
                    </Link>
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
        <div className="cta-content">
          <h2>Can't find the perfect bee?</h2>
          <p>Let Buzz help you find the right AI assistant for your specific needs.</p>
          <Link href="/chat" className="chat-with-buzz-btn">
            Chat with Buzz
          </Link>
        </div>
      </div>

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

        .bee-image {
          height: 250px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
          position: relative;
          overflow: hidden;
        }

        .bee-avatar {
          object-fit: contain;
          width: 100%;
          height: 100%;
          background: #f3f4f6;
        }

        .bee-placeholder {
          font-size: 5rem;
          opacity: 0.7;
        }

        .bee-info {
          padding: 2rem;
        }

        .bee-info h3 {
          color: #205b41;
          font-size: 1.5rem;
          margin: 0 0 0.5rem 0;
          font-weight: 700;
        }

        .bee-role {
          color: #fe8a00;
          font-weight: 600;
          font-size: 1.1rem;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .bee-description {
          color: #666;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .bee-price {
          background: #205b41;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
          display: inline-block;
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

        .learn-more-button {
          background: #205b41;
          color: white;
          border: 2px solid #205b41;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          flex: 1;
          text-decoration: none;
          display: inline-block;
          text-align: center;
        }

        .learn-more-button:hover {
          background: #1a4a35;
          border-color: #1a4a35;
          transform: translateY(-2px);
        }

        .no-results {
          text-align: center;
          padding: 3rem;
          color: white;
          font-size: 1.2rem;
        }

        .cta-section {
          padding: 4rem 2rem;
          text-align: center;
          color: white;
        }

        .cta-content h2 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .cta-content p {
          font-size: 1.25rem;
          margin-bottom: 2rem;
          opacity: 0.9;
        }

        .chat-with-buzz-btn {
          display: inline-block;
          background: #205b41;
          color: white;
          text-decoration: none;
          padding: 1rem 2rem;
          border-radius: 50px;
          font-weight: 600;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(32, 91, 65, 0.3);
        }

        .chat-with-buzz-btn:hover {
          background: #1a4a35;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(32, 91, 65, 0.4);
        }

        .loading {
          text-align: center;
          padding: 4rem 2rem;
          color: white;
          font-size: 1.2rem;
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

          .cta-content h2 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  )
} 