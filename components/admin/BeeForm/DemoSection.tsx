'use client'

import { Input } from '@/components/ui/input'

interface DemoSectionProps {
  formData: {
    demo_video_url: string
    demo_screenshots: string[]
    demo_documentation_url: string
  }
  setFormData: (data: any) => void
  errors?: Record<string, string | undefined>
}

export default function DemoSection({ formData, setFormData, errors }: DemoSectionProps) {
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
        Demo Assets (Optional)
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <label style={{ fontSize: '12px', color: '#666' }}>Demo Video URL</label>
          <Input
            type="url"
            value={formData.demo_video_url}
            onChange={(e) => setFormData({...formData, demo_video_url: e.target.value})}
            placeholder="https://example.com/demo-video"
            style={{
              padding: 'clamp(12px, 2vw, 16px)',
              fontSize: 'clamp(14px, 3vw, 16px)',
              borderRadius: '12px',
              border: errors?.demo_video_url ? '2px solid #e53e3e' : '2px solid #e2e8f0'
            }}
          />
          {errors?.demo_video_url && (
            <p style={{ color: '#e53e3e', fontSize: '12px', margin: '4px 0 0 0' }}>
              {errors.demo_video_url}
            </p>
          )}
        </div>
        <div>
          <label style={{ fontSize: '12px', color: '#666' }}>Documentation URL</label>
          <Input
            type="url"
            value={formData.demo_documentation_url}
            onChange={(e) => setFormData({...formData, demo_documentation_url: e.target.value})}
            placeholder="https://example.com/docs"
            style={{
              padding: 'clamp(12px, 2vw, 16px)',
              fontSize: 'clamp(14px, 3vw, 16px)',
              borderRadius: '12px',
              border: errors?.demo_documentation_url ? '2px solid #e53e3e' : '2px solid #e2e8f0'
            }}
          />
          {errors?.demo_documentation_url && (
            <p style={{ color: '#e53e3e', fontSize: '12px', margin: '4px 0 0 0' }}>
              {errors.demo_documentation_url}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
