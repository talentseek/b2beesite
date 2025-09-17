'use client'

import { Button } from '@/components/ui/button'

interface FormActionsProps {
  isSubmitting: boolean
  onCancel: () => void
  onDelete?: () => void
  submitText?: string
  showDelete?: boolean
}

export default function FormActions({ 
  isSubmitting, 
  onCancel, 
  onDelete, 
  submitText = "Save Changes",
  showDelete = false 
}: FormActionsProps) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 'clamp(12px, 2vw, 16px)',
      paddingTop: 'clamp(16px, 3vw, 24px)',
      borderTop: '1px solid #e2e8f0'
    }}>
      {showDelete && onDelete && (
        <Button
          type="button"
          onClick={onDelete}
          disabled={isSubmitting}
          style={{
            background: '#e53e3e',
            color: 'white',
            border: 'none',
            padding: 'clamp(12px, 2vw, 16px) clamp(24px, 4vw, 32px)',
            borderRadius: '12px',
            fontSize: 'clamp(14px, 3vw, 16px)',
            fontWeight: '600',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            opacity: isSubmitting ? 0.6 : 1
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.background = '#c53030'
            }
          }}
          onMouseLeave={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.background = '#e53e3e'
            }
          }}
        >
          Delete
        </Button>
      )}
      
      <Button
        type="button"
        onClick={onCancel}
        style={{
          background: 'rgba(255, 255, 255, 0.2)',
          color: '#2d3748',
          border: '2px solid #e2e8f0',
          padding: 'clamp(12px, 2vw, 16px) clamp(24px, 4vw, 32px)',
          borderRadius: '12px',
          fontSize: 'clamp(14px, 3vw, 16px)',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
          e.currentTarget.style.borderColor = '#fe8a00'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
          e.currentTarget.style.borderColor = '#e2e8f0'
        }}
      >
        Cancel
      </Button>
      
      <Button
        type="submit"
        disabled={isSubmitting}
        style={{
          background: '#fe8a00',
          color: 'white',
          border: 'none',
          padding: 'clamp(12px, 2vw, 16px) clamp(24px, 4vw, 32px)',
          borderRadius: '12px',
          fontSize: 'clamp(14px, 3vw, 16px)',
          fontWeight: '600',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          opacity: isSubmitting ? 0.6 : 1
        }}
        onMouseEnter={(e) => {
          if (!isSubmitting) {
            e.currentTarget.style.background = '#e67a00'
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)'
          }
        }}
        onMouseLeave={(e) => {
          if (!isSubmitting) {
            e.currentTarget.style.background = '#fe8a00'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)'
          }
        }}
      >
        {isSubmitting ? 'Saving...' : submitText}
      </Button>
    </div>
  )
}
