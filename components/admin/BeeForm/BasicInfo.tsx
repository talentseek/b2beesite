'use client'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface BasicInfoProps {
  formData: {
    slug: string
    name: string
    tagline: string
    role: string
    status: 'active' | 'inactive' | 'draft'
    short_description: string
    description: string
    long_description: string
  }
  setFormData: (data: any) => void
  errors: Record<string, string | undefined>
}

export default function BasicInfo({ formData, setFormData, errors }: BasicInfoProps) {
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
        Basic Information
      </h3>

      {/* Slug Field */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{
          fontSize: 'clamp(14px, 3vw, 16px)',
          fontWeight: '600',
          color: '#2d3748'
        }}>
          Slug *
        </label>
        <Input
          type="text"
          value={formData.slug}
          onChange={(e) => setFormData({...formData, slug: e.target.value})}
          placeholder="appointment-bee"
          required
          style={{
            padding: 'clamp(12px, 2vw, 16px)',
            fontSize: 'clamp(14px, 3vw, 16px)',
            borderRadius: '12px',
            border: errors.slug ? '2px solid #e53e3e' : '2px solid #e2e8f0',
            transition: 'all 0.3s ease'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#fe8a00'
            e.target.style.boxShadow = '0 0 0 3px rgba(254, 138, 0, 0.1)'
          }}
          onBlur={(e) => {
            e.target.style.borderColor = errors.slug ? '#e53e3e' : '#e2e8f0'
            e.target.style.boxShadow = 'none'
          }}
        />
        {errors.slug && (
          <span style={{ fontSize: '12px', color: '#e53e3e' }}>{errors.slug}</span>
        )}
      </div>

      {/* Name Field */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{
          fontSize: 'clamp(14px, 3vw, 16px)',
          fontWeight: '600',
          color: '#2d3748'
        }}>
          Name *
        </label>
        <Input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          placeholder="Appointment Bee"
          required
          style={{
            padding: 'clamp(12px, 2vw, 16px)',
            fontSize: 'clamp(14px, 3vw, 16px)',
            borderRadius: '12px',
            border: errors.name ? '2px solid #e53e3e' : '2px solid #e2e8f0',
            transition: 'all 0.3s ease'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#fe8a00'
            e.target.style.boxShadow = '0 0 0 3px rgba(254, 138, 0, 0.1)'
          }}
          onBlur={(e) => {
            e.target.style.borderColor = errors.name ? '#e53e3e' : '#e2e8f0'
            e.target.style.boxShadow = 'none'
          }}
        />
        {errors.name && (
          <span style={{ fontSize: '12px', color: '#e53e3e' }}>{errors.name}</span>
        )}
      </div>

      {/* Tagline Field */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{
          fontSize: 'clamp(14px, 3vw, 16px)',
          fontWeight: '600',
          color: '#2d3748'
        }}>
          Tagline
        </label>
        <Input
          type="text"
          value={formData.tagline}
          onChange={(e) => setFormData({...formData, tagline: e.target.value})}
          placeholder="Your 24/7 virtual receptionist"
          style={{
            padding: 'clamp(12px, 2vw, 16px)',
            fontSize: 'clamp(14px, 3vw, 16px)',
            borderRadius: '12px',
            border: '2px solid #e2e8f0',
            transition: 'all 0.3s ease'
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

      {/* Role Field */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{
          fontSize: 'clamp(14px, 3vw, 16px)',
          fontWeight: '600',
          color: '#2d3748'
        }}>
          Role *
        </label>
        <Input
          type="text"
          value={formData.role}
          onChange={(e) => setFormData({...formData, role: e.target.value})}
          placeholder="Virtual Receptionist"
          required
          style={{
            padding: 'clamp(12px, 2vw, 16px)',
            fontSize: 'clamp(14px, 3vw, 16px)',
            borderRadius: '12px',
            border: errors.role ? '2px solid #e53e3e' : '2px solid #e2e8f0',
            transition: 'all 0.3s ease'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#fe8a00'
            e.target.style.boxShadow = '0 0 0 3px rgba(254, 138, 0, 0.1)'
          }}
          onBlur={(e) => {
            e.target.style.borderColor = errors.role ? '#e53e3e' : '#e2e8f0'
            e.target.style.boxShadow = 'none'
          }}
        />
        {errors.role && (
          <span style={{ fontSize: '12px', color: '#e53e3e' }}>{errors.role}</span>
        )}
      </div>

      {/* Status Field */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{
          fontSize: 'clamp(14px, 3vw, 16px)',
          fontWeight: '600',
          color: '#2d3748'
        }}>
          Status
        </label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({...formData, status: e.target.value as 'active' | 'inactive' | 'draft'})}
          style={{
            padding: 'clamp(12px, 2vw, 16px)',
            fontSize: 'clamp(14px, 3vw, 16px)',
            borderRadius: '12px',
            border: '2px solid #e2e8f0',
            transition: 'all 0.3s ease',
            background: 'white'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#fe8a00'
            e.target.style.boxShadow = '0 0 0 3px rgba(254, 138, 0, 0.1)'
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e2e8f0'
            e.target.style.boxShadow = 'none'
          }}
        >
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Short Description Field */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{
          fontSize: 'clamp(14px, 3vw, 16px)',
          fontWeight: '600',
          color: '#2d3748'
        }}>
          Short Description
        </label>
        <Textarea
          value={formData.short_description}
          onChange={(e) => setFormData({...formData, short_description: e.target.value})}
          rows={2}
          placeholder="Brief description for listings..."
          style={{
            padding: 'clamp(12px, 2vw, 16px)',
            fontSize: 'clamp(14px, 3vw, 16px)',
            borderRadius: '12px',
            border: '2px solid #e2e8f0',
            transition: 'all 0.3s ease',
            resize: 'vertical'
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

      {/* Description Field */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{
          fontSize: 'clamp(14px, 3vw, 16px)',
          fontWeight: '600',
          color: '#2d3748'
        }}>
          Description *
        </label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          rows={4}
          placeholder="Detailed description of what this bee does..."
          required
          style={{
            padding: 'clamp(12px, 2vw, 16px)',
            fontSize: 'clamp(14px, 3vw, 16px)',
            borderRadius: '12px',
            border: errors.description ? '2px solid #e53e3e' : '2px solid #e2e8f0',
            transition: 'all 0.3s ease',
            resize: 'vertical'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#fe8a00'
            e.target.style.boxShadow = '0 0 0 3px rgba(254, 138, 0, 0.1)'
          }}
          onBlur={(e) => {
            e.target.style.borderColor = errors.description ? '#e53e3e' : '#e2e8f0'
            e.target.style.boxShadow = 'none'
          }}
        />
        {errors.description && (
          <span style={{ fontSize: '12px', color: '#e53e3e' }}>{errors.description}</span>
        )}
      </div>

      {/* Long Description Field */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{
          fontSize: 'clamp(14px, 3vw, 16px)',
          fontWeight: '600',
          color: '#2d3748'
        }}>
          Long Description
        </label>
        <Textarea
          value={formData.long_description}
          onChange={(e) => setFormData({...formData, long_description: e.target.value})}
          rows={6}
          placeholder="Comprehensive description with all details..."
          style={{
            padding: 'clamp(12px, 2vw, 16px)',
            fontSize: 'clamp(14px, 3vw, 16px)',
            borderRadius: '12px',
            border: '2px solid #e2e8f0',
            transition: 'all 0.3s ease',
            resize: 'vertical'
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
