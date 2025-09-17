'use client'

import { Input } from '@/components/ui/input'

interface ROISectionProps {
  formData: {
    roi_traditional_admin_cost: string
    roi_time_savings_percent: string
    roi_accuracy_improvement_percent: string
    roi_customer_satisfaction_boost: string
  }
  setFormData: (data: any) => void
}

export default function ROISection({ formData, setFormData }: ROISectionProps) {
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
        ROI Model (Optional)
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        <div>
          <label style={{ fontSize: '12px', color: '#666' }}>Traditional Admin Cost (£)</label>
          <Input
            type="number"
            value={formData.roi_traditional_admin_cost}
            onChange={(e) => setFormData({...formData, roi_traditional_admin_cost: e.target.value})}
            min="0"
            step="100"
            placeholder="5000"
            style={{
              padding: 'clamp(12px, 2vw, 16px)',
              fontSize: 'clamp(14px, 3vw, 16px)',
              borderRadius: '12px',
              border: '2px solid #e2e8f0'
            }}
          />
        </div>
        <div>
          <label style={{ fontSize: '12px', color: '#666' }}>Time Savings (%)</label>
          <Input
            type="number"
            value={formData.roi_time_savings_percent}
            onChange={(e) => setFormData({...formData, roi_time_savings_percent: e.target.value})}
            min="0"
            max="100"
            step="5"
            placeholder="60"
            style={{
              padding: 'clamp(12px, 2vw, 16px)',
              fontSize: 'clamp(14px, 3vw, 16px)',
              borderRadius: '12px',
              border: '2px solid #e2e8f0'
            }}
          />
        </div>
        <div>
          <label style={{ fontSize: '12px', color: '#666' }}>Accuracy Improvement (%)</label>
          <Input
            type="number"
            value={formData.roi_accuracy_improvement_percent}
            onChange={(e) => setFormData({...formData, roi_accuracy_improvement_percent: e.target.value})}
            min="0"
            max="100"
            step="5"
            placeholder="25"
            style={{
              padding: 'clamp(12px, 2vw, 16px)',
              fontSize: 'clamp(14px, 3vw, 16px)',
              borderRadius: '12px',
              border: '2px solid #e2e8f0'
            }}
          />
        </div>
        <div>
          <label style={{ fontSize: '12px', color: '#666' }}>Customer Satisfaction Boost (%)</label>
          <Input
            type="number"
            value={formData.roi_customer_satisfaction_boost}
            onChange={(e) => setFormData({...formData, roi_customer_satisfaction_boost: e.target.value})}
            min="0"
            max="100"
            step="5"
            placeholder="40"
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
  )
}
