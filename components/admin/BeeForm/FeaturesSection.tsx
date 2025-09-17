'use client'

import { Textarea } from '@/components/ui/textarea'

interface FeaturesSectionProps {
  formData: {
    features: string[]
    integrations: string[]
    faqs: Array<{ question: string; answer: string }>
  }
  setFormData: (data: any) => void
}

export default function FeaturesSection({ formData, setFormData }: FeaturesSectionProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'clamp(16px, 3vw, 24px)',
      padding: 'clamp(20px, 4vw, 24px)',
      background: 'rgba(254, 138, 0, 0.05)',
      borderRadius: '12px',
      border: '1px solid rgba(254, 138, 0, 0.2)'
    }}>
      <h3 style={{
        fontSize: 'clamp(18px, 4vw, 20px)',
        fontWeight: '600',
        color: '#2d3748',
        margin: '0'
      }}>
        Features & Integrations
      </h3>
      
      {/* Features */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <label style={{
          fontSize: 'clamp(14px, 3vw, 16px)',
          fontWeight: '600',
          color: '#2d3748'
        }}>
          Features (JSON format)
        </label>
        <Textarea
          value={JSON.stringify(formData.features, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value)
              setFormData({...formData, features: parsed})
            } catch (error) {
              // Keep the string value if invalid JSON
            }
          }}
          rows={4}
          placeholder='["24/7 Availability", "Multi-language Support", "Custom Branding"]'
          style={{
            padding: 'clamp(12px, 2vw, 16px)',
            fontSize: 'clamp(14px, 3vw, 16px)',
            borderRadius: '12px',
            border: '2px solid #e2e8f0',
            transition: 'all 0.3s ease',
            resize: 'vertical',
            fontFamily: 'monospace'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#fe8a00'
            e.target.style.boxShadow = '0 0 0 3px rgba(254, 138, 0, 0.1)'
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e2e8f0'
            e.target.style.boxShadow = 'none'
          }}
        />
      </div>

      {/* Integrations */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <label style={{
          fontSize: 'clamp(14px, 3vw, 16px)',
          fontWeight: '600',
          color: '#2d3748'
        }}>
          Integrations (JSON format)
        </label>
        <Textarea
          value={JSON.stringify(formData.integrations, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value)
              setFormData({...formData, integrations: parsed})
            } catch (error) {
              // Keep the string value if invalid JSON
            }
          }}
          rows={4}
          placeholder='["Google Calendar", "Outlook", "Slack", "Zapier"]'
          style={{
            padding: 'clamp(12px, 2vw, 16px)',
            fontSize: 'clamp(14px, 3vw, 16px)',
            borderRadius: '12px',
            border: '2px solid #e2e8f0',
            transition: 'all 0.3s ease',
            resize: 'vertical',
            fontFamily: 'monospace'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#fe8a00'
            e.target.style.boxShadow = '0 0 0 3px rgba(254, 138, 0, 0.1)'
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e2e8f0'
            e.target.style.boxShadow = 'none'
          }}
        />
      </div>

      {/* FAQs */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <label style={{
          fontSize: 'clamp(14px, 3vw, 16px)',
          fontWeight: '600',
          color: '#2d3748'
        }}>
          FAQs (JSON format)
        </label>
        <Textarea
          value={JSON.stringify(formData.faqs, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value)
              setFormData({...formData, faqs: parsed})
            } catch (error) {
              // Keep the string value if invalid JSON
            }
          }}
          rows={6}
          placeholder='[{"question": "How does it work?", "answer": "Our AI handles calls automatically..."}]'
          style={{
            padding: 'clamp(12px, 2vw, 16px)',
            fontSize: 'clamp(14px, 3vw, 16px)',
            borderRadius: '12px',
            border: '2px solid #e2e8f0',
            transition: 'all 0.3s ease',
            resize: 'vertical',
            fontFamily: 'monospace'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#fe8a00'
            e.target.style.boxShadow = '0 0 0 3px rgba(254, 138, 0, 0.1)'
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e2e8f0'
            e.target.style.boxShadow = 'none'
          }}
        />
      </div>
    </div>
  )
}
