"use client";

import { useVapi } from "@/hooks/use-vapi";

export default function VapiWidget() {
  const { callStatus, conversation, toggleCall } = useVapi();

  const renderCallButton = () => {
    switch (callStatus) {
      case "loading":
        return (
          <button 
            style={{
              width: '100%',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'not-allowed',
              fontWeight: 'bold',
              backgroundColor: '#6b7280',
              color: 'white',
              fontSize: '16px'
            }}
            disabled
          >
            Connecting...
          </button>
        );
      case "active":
        return (
          <button 
            style={{
              width: '100%',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              backgroundColor: '#dc2626',
              color: 'white',
              fontSize: '16px',
              transition: 'background-color 0.2s'
            }}
            onClick={toggleCall}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
          >
            End Call
          </button>
        );
      case "error":
        return (
          <button 
            style={{
              width: '100%',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              backgroundColor: '#f59e0b',
              color: 'black',
              fontSize: '16px',
              transition: 'background-color 0.2s'
            }}
            onClick={toggleCall}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d97706'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f59e0b'}
          >
            Retry
          </button>
        );
      case "inactive":
      default:
        return (
          <button 
            style={{
              width: '100%',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              backgroundColor: '#14B8A6',
              color: 'white',
              fontSize: '16px',
              transition: 'background-color 0.2s'
            }}
            onClick={toggleCall}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0d9488'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#14B8A6'}
          >
            Start Voice Call
          </button>
        );
    }
  };

  return (
    <div style={{
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      padding: '20px',
      maxWidth: '400px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: 'white',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}>
      <h3 style={{
        margin: '0 0 16px 0',
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#1f2937'
      }}>
        🎤 Talk with Buzz
      </h3>
      
      <div style={{
        height: '200px',
        overflowY: 'auto',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '16px',
        backgroundColor: '#f9fafb',
        fontSize: '14px'
      }}>
        {conversation.length > 0 ? (
          conversation.map((msg, index) => (
            <p key={index} style={{
              margin: '8px 0',
              color: msg.role === 'assistant' ? '#059669' : '#1d4ed8'
            }}>
              <strong>{msg.role === 'assistant' ? 'Buzz' : 'You'}:</strong> {msg.transcript}
            </p>
          ))
        ) : callStatus === 'active' ? (
          <p style={{ color: '#6b7280', fontStyle: 'italic' }}>Listening...</p>
        ) : (
          <p style={{ color: '#6b7280', fontStyle: 'italic' }}>
            Click "Start Voice Call" to begin talking with Buzz!
          </p>
        )}
      </div>
      
      {renderCallButton()}
    </div>
  );
} 