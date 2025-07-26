'use client'

import { useState, useEffect } from 'react'

interface Analytics {
  page_views: number
  button_clicks: number
  social_clicks: number
  total_subscribers: number
}

interface Subscriber {
  id: number
  email: string
  created_at: string
  is_active: boolean
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [analyticsRes, subscribersRes] = await Promise.all([
        fetch('/api/analytics'),
        fetch('/api/subscribers')
      ])

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json()
        setAnalytics(analyticsData)
      }

      if (subscribersRes.ok) {
        const subscribersData = await subscribersRes.json()
        setSubscribers(subscribersData.subscribers || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="loading">Loading dashboard...</div>
    )
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-nav">
        <h1>Admin Dashboard</h1>
        <nav>
          <a href="/admin" className="nav-link active">Dashboard</a>
          <a href="/admin/bees" className="nav-link">Busy Bees</a>
        </nav>
      </div>

      {analytics && (
        <div className="analytics-section">
          <h2>Analytics Overview</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Page Views</h3>
              <p className="stat-number">{analytics.page_views}</p>
            </div>
            <div className="stat-card">
              <h3>Button Clicks</h3>
              <p className="stat-number">{analytics.button_clicks}</p>
            </div>
            <div className="stat-card">
              <h3>Social Clicks</h3>
              <p className="stat-number">{analytics.social_clicks}</p>
            </div>
            <div className="stat-card">
              <h3>Total Subscribers</h3>
              <p className="stat-number">{analytics.total_subscribers}</p>
            </div>
          </div>
        </div>
      )}

      <div className="subscribers-section">
        <h2>Email Subscribers ({subscribers.length})</h2>
        <div className="subscribers-list">
          {subscribers.map((subscriber) => (
            <div key={subscriber.id} className="subscriber-item">
              <div className="subscriber-email">{subscriber.email}</div>
              <div className="subscriber-date">
                {new Date(subscriber.created_at).toLocaleDateString()}
              </div>
              <div className="subscriber-status">
                {subscriber.is_active ? 'Active' : 'Inactive'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .admin-dashboard {
          max-width: 1200px;
          margin: 0 auto;
        }

        .admin-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #f0f0f0;
        }

        .admin-nav h1 {
          color: #205b41;
          margin: 0;
        }

        .admin-nav nav {
          display: flex;
          gap: 1rem;
        }

        .nav-link {
          padding: 0.5rem 1rem;
          text-decoration: none;
          color: #666;
          border-radius: 6px;
          transition: all 0.3s ease;
        }

        .nav-link:hover {
          background: #f3f4f6;
          color: #205b41;
        }

        .nav-link.active {
          background: #fe8a00;
          color: white;
        }

        h2 {
          color: #205b41;
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }

        .analytics-section {
          margin-bottom: 3rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .stat-card h3 {
          color: #666;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .stat-number {
          color: #fe8a00;
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
        }

        .subscribers-list {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .subscriber-item {
          display: grid;
          grid-template-columns: 1fr auto auto;
          gap: 1rem;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #f0f0f0;
          align-items: center;
        }

        .subscriber-item:last-child {
          border-bottom: none;
        }

        .subscriber-email {
          font-weight: 500;
          color: #333;
        }

        .subscriber-date {
          color: #666;
          font-size: 0.875rem;
        }

        .subscriber-status {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
          background: #dcfce7;
          color: #166534;
        }

        .loading {
          text-align: center;
          padding: 2rem;
          color: #666;
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .subscriber-item {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  )
} 