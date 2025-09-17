'use client'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface SEOSectionProps {
  formData: {
    seo_title: string
    seo_description: string
    seo_og_image: string
  }
  setFormData: (data: any) => void
}

export default function SEOSection({ formData, setFormData }: SEOSectionProps) {
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
        SEO Settings (Optional)
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <label style={{ fontSize: '12px', color: '#666' }}>SEO Title</label>
          <Input
            type="text"
            value={formData.seo_title}
            onChange={(e) => setFormData({...formData, seo_title: e.target.value})}
            placeholder="Custom SEO title..."
            style={{
              padding: 'clamp(12px, 2vw, 16px)',
              fontSize: 'clamp(14px, 3vw, 16px)',
              borderRadius: '12px',
              border: '2px solid #e2e8f0'
            }}
          />
        </div>
        <div>
          <label style={{ fontSize: '12px', color: '#666' }}>SEO Description</label>
          <Textarea
            value={formData.seo_description}
            onChange={(e) => setFormData({...formData, seo_description: e.target.value})}
            rows={3}
            placeholder="Custom SEO description..."
            style={{
              padding: 'clamp(12px, 2vw, 16px)',
              fontSize: 'clamp(14px, 3vw, 16px)',
              borderRadius: '12px',
              border: '2px solid #e2e8f0',
              resize: 'vertical'
            }}
          />
        </div>
        <div>
          <label style={{ fontSize: '12px', color: '#666' }}>SEO OG Image URL</label>
          <Input
            type="url"
            value={formData.seo_og_image}
            onChange={(e) => setFormData({...formData, seo_og_image: e.target.value})}
            placeholder="https://example.com/og-image.jpg"
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
