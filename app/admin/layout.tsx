'use client'

import { useState, useEffect } from 'react'

const ADMIN_PASSWORD = 'b2beeadmin2025'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    // Check if already authenticated
    const authStatus = sessionStorage.getItem('b2bee-admin-auth')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      sessionStorage.setItem('b2bee-admin-auth', 'true')
      setError('')
    } else {
      setError('Incorrect password')
      setPassword('')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem('b2bee-admin-auth')
    setPassword('')
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="login-container">
          <h1>B2Bee Admin</h1>
          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
        </div>

        <style jsx>{`
          .admin-login {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #fcefdb 0%, #f8f4f0 100%);
            font-family: 'Inter', sans-serif;
          }

          .login-container {
            background: white;
            padding: 3rem;
            border-radius: 16px;
            box-shadow: 0 20px 40px rgba(32, 91, 65, 0.1);
            text-align: center;
            max-width: 400px;
            width: 90%;
          }

          h1 {
            color: #205b41;
            margin-bottom: 2rem;
            font-size: 2rem;
            font-weight: 700;
          }

          .login-form {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }

          .input-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            text-align: left;
          }

          label {
            color: #205b41;
            font-weight: 600;
            font-size: 0.875rem;
          }

          input {
            padding: 1rem;
            border: 2px solid rgba(32, 91, 65, 0.2);
            border-radius: 8px;
            font-size: 1rem;
            transition: all 0.3s ease;
            outline: none;
          }

          input:focus {
            border-color: #fe8a00;
            box-shadow: 0 0 0 3px rgba(254, 138, 0, 0.1);
          }

          .login-button {
            background: #fe8a00;
            color: white;
            border: none;
            padding: 1rem;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .login-button:hover {
            background: #e67a00;
            transform: translateY(-2px);
          }

          .error-message {
            color: #dc2626;
            font-size: 0.875rem;
            margin: 0;
          }

          @media (max-width: 480px) {
            .login-container {
              padding: 2rem;
              margin: 1rem;
            }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <h1>B2Bee Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>
      <main className="admin-content">
        {children}
      </main>

      <style jsx>{`
        .admin-layout {
          min-height: 100vh;
          background: #f8f9fa;
          font-family: 'Inter', sans-serif;
        }

        .admin-header {
          background: white;
          padding: 1rem 2rem;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .admin-header h1 {
          color: #205b41;
          margin: 0;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .logout-button {
          background: #dc2626;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .logout-button:hover {
          background: #b91c1c;
        }

        .admin-content {
          padding: 2rem;
        }

        @media (max-width: 768px) {
          .admin-header {
            padding: 1rem;
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .admin-content {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  )
} 