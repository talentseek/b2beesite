import React from 'react'

interface LoadingSpinnerProps {
  message?: string
}

export default function LoadingSpinner({ message = "Loading our busy bees..." }: LoadingSpinnerProps) {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="bee-spinner">
          <div className="bee">🐝</div>
          <div className="bee">🐝</div>
          <div className="bee">🐝</div>
        </div>
        <p className="loading-text">{message}</p>
      </div>
      
      <style jsx>{`
        .loading-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #ea3e93 0%, #fe8a00 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .loading-content {
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

        @media (max-width: 768px) {
          .bee {
            font-size: 1.5rem;
          }
          
          .loading-text {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  )
} 