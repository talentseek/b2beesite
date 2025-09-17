'use client'

import { Input } from '@/components/ui/input'

interface PricingSectionProps {
  formData: {
    price_usd: string
    price_gbp: string
    price_eur: string
    usage_pricing_usd: string
    usage_pricing_gbp: string
    usage_pricing_eur: string
    usage_type: string
    unit_description: string
  }
  setFormData: (data: any) => void
  errors: Record<string, string | undefined>
}

export default function PricingSection({ formData, setFormData, errors }: PricingSectionProps) {
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
        Pricing & Usage
      </h3>

      {/* Base Pricing */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <h4 style={{
          fontSize: 'clamp(16px, 3vw, 18px)',
          fontWeight: '600',
          color: '#2d3748',
          margin: '0'
        }}>
          Base Monthly Pricing
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#666' }}>USD Price</label>
            <Input
              type="number"
              value={formData.price_usd}
              onChange={(e) => setFormData({...formData, price_usd: e.target.value})}
              min="0"
              step="1"
              placeholder="200"
              style={{
                padding: 'clamp(12px, 2vw, 16px)',
                fontSize: 'clamp(14px, 3vw, 16px)',
                borderRadius: '12px',
                border: errors.price ? '2px solid #e53e3e' : '2px solid #e2e8f0'
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#666' }}>GBP Price</label>
            <Input
              type="number"
              value={formData.price_gbp}
              onChange={(e) => setFormData({...formData, price_gbp: e.target.value})}
              min="0"
              step="1"
              placeholder="150"
              style={{
                padding: 'clamp(12px, 2vw, 16px)',
                fontSize: 'clamp(14px, 3vw, 16px)',
                borderRadius: '12px',
                border: errors.price ? '2px solid #e53e3e' : '2px solid #e2e8f0'
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#666' }}>EUR Price</label>
            <Input
              type="number"
              value={formData.price_eur}
              onChange={(e) => setFormData({...formData, price_eur: e.target.value})}
              min="0"
              step="1"
              placeholder="180"
              style={{
                padding: 'clamp(12px, 2vw, 16px)',
                fontSize: 'clamp(14px, 3vw, 16px)',
                borderRadius: '12px',
                border: errors.price ? '2px solid #e53e3e' : '2px solid #e2e8f0'
              }}
            />
          </div>
        </div>
        {errors.price && (
          <span style={{ fontSize: '12px', color: '#e53e3e' }}>{errors.price}</span>
        )}
      </div>

      {/* Usage Pricing */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <h4 style={{
          fontSize: 'clamp(16px, 3vw, 18px)',
          fontWeight: '600',
          color: '#2d3748',
          margin: '0'
        }}>
          Usage-Based Pricing (Optional)
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#666' }}>USD Rate</label>
            <Input
              type="number"
              value={formData.usage_pricing_usd}
              onChange={(e) => setFormData({...formData, usage_pricing_usd: e.target.value})}
              min="0"
              step="0.01"
              placeholder="0.10"
              style={{
                padding: 'clamp(12px, 2vw, 16px)',
                fontSize: 'clamp(14px, 3vw, 16px)',
                borderRadius: '12px',
                border: '2px solid #e2e8f0'
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#666' }}>GBP Rate</label>
            <Input
              type="number"
              value={formData.usage_pricing_gbp}
              onChange={(e) => setFormData({...formData, usage_pricing_gbp: e.target.value})}
              min="0"
              step="0.01"
              placeholder="0.08"
              style={{
                padding: 'clamp(12px, 2vw, 16px)',
                fontSize: 'clamp(14px, 3vw, 16px)',
                borderRadius: '12px',
                border: '2px solid #e2e8f0'
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#666' }}>EUR Rate</label>
            <Input
              type="number"
              value={formData.usage_pricing_eur}
              onChange={(e) => setFormData({...formData, usage_pricing_eur: e.target.value})}
              min="0"
              step="0.01"
              placeholder="0.09"
              style={{
                padding: 'clamp(12px, 2vw, 16px)',
                fontSize: 'clamp(14px, 3vw, 16px)',
                borderRadius: '12px',
                border: '2px solid #e2e8f0'
              }}
            />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#666' }}>Usage Type</label>
            <Input
              type="text"
              value={formData.usage_type}
              onChange={(e) => setFormData({...formData, usage_type: e.target.value})}
              placeholder="per_minute"
              style={{
                padding: 'clamp(12px, 2vw, 16px)',
                fontSize: 'clamp(14px, 3vw, 16px)',
                borderRadius: '12px',
                border: '2px solid #e2e8f0'
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#666' }}>Unit Description</label>
            <Input
              type="text"
              value={formData.unit_description}
              onChange={(e) => setFormData({...formData, unit_description: e.target.value})}
              placeholder="per minute"
              style={{
                padding: 'clamp(12px, 2vw, 16px)',
                fontSize: 'clamp(14px, 3vw, 16px)',
                borderRadius: '12px',
                border: '2px solid #e2e8f0'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
