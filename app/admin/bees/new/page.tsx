'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import ImageUpload from '@/components/ImageUpload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface FormData {
  slug: string
  name: string
  tagline: string
  role: string
  status: 'active' | 'inactive' | 'draft'
  short_description: string
  description: string
  long_description: string
  price_usd: string
  price_gbp: string
  price_eur: string
  usage_pricing: {
    USD?: { usage_type: string; rate_per_unit: string; unit_description: string }
    GBP?: { usage_type: string; rate_per_unit: string; unit_description: string }
    EUR?: { usage_type: string; rate_per_unit: string; unit_description: string }
  }
  image_url: string
  features: string[]
  integrations: string[]
  roi_model: any
  faqs: any[]
  seo_title: string
  seo_description: string
  seo_og_image: string
}

interface FormErrors {
  slug?: string
  name?: string
  role?: string
  description?: string
  price?: string
}

export default function AddNewBee() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    slug: '',
    name: '',
    tagline: '',
    role: '',
    status: 'draft',
    short_description: '',
    description: '',
    long_description: '',
    price_usd: '',
    price_gbp: '',
    price_eur: '',
    usage_pricing: {},
    image_url: '',
    features: [],
    integrations: [],
    roi_model: {},
    faqs: [],
    seo_title: '',
    seo_description: '',
    seo_og_image: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Auto-save draft to localStorage
  useEffect(() => {
    const savedDraft = localStorage.getItem('bee-form-draft')
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft)
        setFormData(draft)
        setHasUnsavedChanges(true)
      } catch (error) {
        console.error('Error loading draft:', error)
      }
    }
  }, [])

  // Auto-generate slug from name
  useEffect(() => {
    if (formData.name && !formData.slug) {
      const generatedSlug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      setFormData(prev => ({ ...prev, slug: generatedSlug }))
    }
  }, [formData.name])

  // Save draft when form data changes
  useEffect(() => {
    if (formData.name || formData.role || formData.description) {
      localStorage.setItem('bee-form-draft', JSON.stringify(formData))
      setHasUnsavedChanges(true)
    }
  }, [formData])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required'
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens'
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.role.trim()) {
      newErrors.role = 'Role is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    const priceFields = [formData.price_usd, formData.price_gbp, formData.price_eur]
    if (priceFields.some(p => p && isNaN(parseFloat(p)))) {
      newErrors.price = 'Prices must be valid numbers'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const prices: Record<string, number | undefined> = {
        USD: formData.price_usd ? Math.round(Number(formData.price_usd)) : undefined,
        GBP: formData.price_gbp ? Math.round(Number(formData.price_gbp)) : undefined,
        EUR: formData.price_eur ? Math.round(Number(formData.price_eur)) : undefined,
      }

      const beeData: any = {
        slug: formData.slug,
        name: formData.name,
        tagline: formData.tagline,
        role: formData.role,
        status: formData.status,
        short_description: formData.short_description,
        description: formData.description,
        long_description: formData.long_description,
        image_url: formData.image_url || null,
        features: formData.features,
        integrations: formData.integrations,
        roi_model: formData.roi_model,
        faqs: formData.faqs,
        seo_title: formData.seo_title,
        seo_description: formData.seo_description,
        seo_og_image: formData.seo_og_image,
        prices,
        usage_pricing: formData.usage_pricing,
      }

      const response = await fetch('/api/bees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(beeData)
      })

      if (response.ok) {
        // Clear draft and navigate back
        localStorage.removeItem('bee-form-draft')
        setHasUnsavedChanges(false)
        
        // Show success message (you can add a toast notification here)
        alert('Bee added successfully!')
        router.push('/admin/bees')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to add bee')
      }
    } catch (error) {
      console.error('Error adding bee:', error)
      alert('Failed to add bee. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
        localStorage.removeItem('bee-form-draft')
        router.push('/admin/bees')
      }
    } else {
      router.push('/admin/bees')
    }
  }

  const clearDraft = () => {
    if (confirm('Clear the current draft?')) {
      localStorage.removeItem('bee-form-draft')
      setFormData({
        slug: '',
        name: '',
        tagline: '',
        role: '',
        status: 'draft',
        short_description: '',
        description: '',
        long_description: '',
        price_usd: '',
        price_gbp: '',
        price_eur: '',
        image_url: '',
        features: [],
        integrations: [],
        seo_title: '',
        seo_description: '',
        seo_og_image: ''
      })
      setHasUnsavedChanges(false)
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'clamp(32px, 6vw, 48px)',
      maxWidth: '800px',
      margin: '0 auto',
      padding: 'clamp(20px, 4vw, 32px)'
    }}>
      {/* Header with Breadcrumbs */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(16px, 3vw, 24px)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(8px, 2vw, 12px)',
          fontSize: 'clamp(14px, 3vw, 16px)',
          color: 'rgba(255, 255, 255, 0.8)'
        }}>
          <Link href="/admin" style={{
            color: 'rgba(255, 255, 255, 0.8)',
            textDecoration: 'none',
            transition: 'color 0.3s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#fe8a00' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)' }}>
            Admin
          </Link>
          <span>›</span>
          <Link href="/admin/bees" style={{
            color: 'rgba(255, 255, 255, 0.8)',
            textDecoration: 'none',
            transition: 'color 0.3s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#fe8a00' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)' }}>
            Bees
          </Link>
          <span>›</span>
          <span style={{ color: '#fe8a00', fontWeight: '600' }}>Add New Bee</span>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'clamp(16px, 3vw, 24px)'
        }}>
          <h1 style={{
            fontSize: 'clamp(24px, 5vw, 32px)',
            fontWeight: 'bold',
            color: 'white',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            margin: '0'
          }}>
            Add New Bee
          </h1>

          <div style={{
            display: 'flex',
            gap: 'clamp(8px, 2vw, 12px)'
          }}>
            {hasUnsavedChanges && (
              <Button
                onClick={clearDraft}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  padding: 'clamp(8px, 1.5vw, 12px) clamp(16px, 3vw, 24px)',
                  borderRadius: '8px',
                  fontSize: 'clamp(12px, 2.5vw, 14px)',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                }}
              >
                Clear Draft
              </Button>
            )}
            
            <Button
              onClick={handleCancel}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: 'clamp(8px, 1.5vw, 12px) clamp(16px, 3vw, 24px)',
                borderRadius: '8px',
                fontSize: 'clamp(12px, 2.5vw, 14px)',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
        padding: 'clamp(24px, 4vw, 32px)'
      }}>
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(24px, 4vw, 32px)'
        }}>
          {/* Slug Field */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <label htmlFor="slug" style={{
              fontSize: 'clamp(16px, 3vw, 18px)',
              fontWeight: '600',
              color: '#2d3748'
            }}>
              Slug *
            </label>
            <Input
              type="text"
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({...formData, slug: e.target.value})}
              required
              placeholder="e.g., appointment-bee"
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
              <p style={{
                fontSize: 'clamp(12px, 2.5vw, 14px)',
                color: '#e53e3e',
                margin: '0'
              }}>
                {errors.slug}
              </p>
            )}
          </div>

          {/* Name Field */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <label htmlFor="name" style={{
              fontSize: 'clamp(16px, 3vw, 18px)',
              fontWeight: '600',
              color: '#2d3748'
            }}>
              Name *
            </label>
            <Input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
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
              <p style={{
                fontSize: 'clamp(12px, 2.5vw, 14px)',
                color: '#e53e3e',
                margin: '0'
              }}>
                {errors.name}
              </p>
            )}
          </div>

          {/* Tagline Field */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <label htmlFor="tagline" style={{
              fontSize: 'clamp(16px, 3vw, 18px)',
              fontWeight: '600',
              color: '#2d3748'
            }}>
              Tagline
            </label>
            <Input
              type="text"
              id="tagline"
              value={formData.tagline}
              onChange={(e) => setFormData({...formData, tagline: e.target.value})}
              placeholder="e.g., Your 24/7 virtual receptionist"
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

          {/* Status Field */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <label htmlFor="status" style={{
              fontSize: 'clamp(16px, 3vw, 18px)',
              fontWeight: '600',
              color: '#2d3748'
            }}>
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value as 'active' | 'inactive' | 'draft'})}
              style={{
                padding: 'clamp(12px, 2vw, 16px)',
                fontSize: 'clamp(14px, 3vw, 16px)',
                borderRadius: '12px',
                border: '2px solid #e2e8f0',
                transition: 'all 0.3s ease',
                backgroundColor: 'white'
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
              <option value="inactive">Inactive (Coming Soon)</option>
              <option value="active">Active</option>
            </select>
          </div>

          {/* Role Field */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <label htmlFor="role" style={{
              fontSize: 'clamp(16px, 3vw, 18px)',
              fontWeight: '600',
              color: '#2d3748'
            }}>
              Role *
            </label>
            <Input
              type="text"
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
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
              <p style={{
                fontSize: 'clamp(12px, 2.5vw, 14px)',
                color: '#e53e3e',
                margin: '0'
              }}>
                {errors.role}
              </p>
            )}
          </div>

          {/* Short Description Field */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <label htmlFor="short_description" style={{
              fontSize: 'clamp(16px, 3vw, 18px)',
              fontWeight: '600',
              color: '#2d3748'
            }}>
              Short Description
            </label>
            <Textarea
              id="short_description"
              value={formData.short_description}
              onChange={(e) => setFormData({...formData, short_description: e.target.value})}
              rows={3}
              placeholder="Brief description for cards and previews"
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

          {/* Long Description Field */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <label htmlFor="long_description" style={{
              fontSize: 'clamp(16px, 3vw, 18px)',
              fontWeight: '600',
              color: '#2d3748'
            }}>
              Long Description
            </label>
            <Textarea
              id="long_description"
              value={formData.long_description}
              onChange={(e) => setFormData({...formData, long_description: e.target.value})}
              rows={4}
              placeholder="Detailed description for the bee profile page"
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
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <label htmlFor="description" style={{
              fontSize: 'clamp(16px, 3vw, 18px)',
              fontWeight: '600',
              color: '#2d3748'
            }}>
              Main Description *
            </label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
              rows={6}
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
              <p style={{
                fontSize: 'clamp(12px, 2.5vw, 14px)',
                color: '#e53e3e',
                margin: '0'
              }}>
                {errors.description}
              </p>
            )}
          </div>

          {/* Prices (USD/GBP/EUR) */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <label style={{
              fontSize: 'clamp(16px, 3vw, 18px)',
              fontWeight: '600',
              color: '#2d3748'
            }}>
              Prices (optional)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#666' }}>USD ($)</label>
                <Input
                  type="number"
                  value={formData.price_usd}
                  onChange={(e) => setFormData({...formData, price_usd: e.target.value})}
                  min="0"
                  step="1"
                  placeholder="0"
                  style={{
                    padding: 'clamp(12px, 2vw, 16px)',
                    fontSize: 'clamp(14px, 3vw, 16px)',
                    borderRadius: '12px',
                    border: errors.price ? '2px solid #e53e3e' : '2px solid #e2e8f0'
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#666' }}>GBP (£)</label>
                <Input
                  type="number"
                  value={formData.price_gbp}
                  onChange={(e) => setFormData({...formData, price_gbp: e.target.value})}
                  min="0"
                  step="1"
                  placeholder="0"
                  style={{
                    padding: 'clamp(12px, 2vw, 16px)',
                    fontSize: 'clamp(14px, 3vw, 16px)',
                    borderRadius: '12px',
                    border: errors.price ? '2px solid #e53e3e' : '2px solid #e2e8f0'
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#666' }}>EUR (€)</label>
                <Input
                  type="number"
                  value={formData.price_eur}
                  onChange={(e) => setFormData({...formData, price_eur: e.target.value})}
                  min="0"
                  step="1"
                  placeholder="0"
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
              <p style={{
                fontSize: 'clamp(12px, 2.5vw, 14px)',
                color: '#e53e3e',
                margin: '0'
              }}>
                {errors.price}
              </p>
            )}
          </div>

          {/* Usage Pricing Section */}
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
              Usage-Based Pricing (Optional)
            </h3>
            <p style={{
              fontSize: 'clamp(14px, 3vw, 16px)',
              color: '#666',
              margin: '0'
            }}>
              Set up usage-based pricing in addition to base monthly cost (e.g., £0.15 per minute)
            </p>
            
            {['USD', 'GBP', 'EUR'].map((currency) => (
              <div key={currency} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                padding: '16px',
                background: 'white',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                <h4 style={{
                  fontSize: 'clamp(16px, 3vw, 18px)',
                  fontWeight: '600',
                  color: '#2d3748',
                  margin: '0'
                }}>
                  {currency} Usage Pricing
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#666' }}>Usage Type</label>
                    <Input
                      type="text"
                      value={formData.usage_pricing[currency as keyof typeof formData.usage_pricing]?.usage_type || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        usage_pricing: {
                          ...formData.usage_pricing,
                          [currency]: {
                            ...formData.usage_pricing[currency as keyof typeof formData.usage_pricing],
                            usage_type: e.target.value
                          }
                        }
                      })}
                      placeholder="e.g., per_minute"
                      style={{
                        padding: 'clamp(8px, 1.5vw, 12px)',
                        fontSize: 'clamp(12px, 2.5vw, 14px)',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#666' }}>Rate per Unit</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.usage_pricing[currency as keyof typeof formData.usage_pricing]?.rate_per_unit || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        usage_pricing: {
                          ...formData.usage_pricing,
                          [currency]: {
                            ...formData.usage_pricing[currency as keyof typeof formData.usage_pricing],
                            rate_per_unit: e.target.value
                          }
                        }
                      })}
                      placeholder="0.15"
                      style={{
                        padding: 'clamp(8px, 1.5vw, 12px)',
                        fontSize: 'clamp(12px, 2.5vw, 14px)',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#666' }}>Unit Description</label>
                    <Input
                      type="text"
                      value={formData.usage_pricing[currency as keyof typeof formData.usage_pricing]?.unit_description || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        usage_pricing: {
                          ...formData.usage_pricing,
                          [currency]: {
                            ...formData.usage_pricing[currency as keyof typeof formData.usage_pricing],
                            unit_description: e.target.value
                          }
                        }
                      })}
                      placeholder="per minute"
                      style={{
                        padding: 'clamp(8px, 1.5vw, 12px)',
                        fontSize: 'clamp(12px, 2.5vw, 14px)',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0'
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Image Upload Section */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(16px, 3vw, 24px)'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <label style={{
                fontSize: 'clamp(16px, 3vw, 18px)',
                fontWeight: '600',
                color: '#2d3748'
              }}>
                Bee Profile Image (optional)
              </label>
              
              {/* Enhanced Image Upload */}
              <div style={{
                display: 'flex',
                gap: 'clamp(16px, 3vw, 24px)',
                alignItems: 'flex-start'
              }}>
                <div style={{ flex: '1' }}>
                  <ImageUpload
                    currentImageUrl={formData.image_url}
                    onImageUpload={(url) => setFormData({...formData, image_url: url})}
                    onImageRemove={() => setFormData({...formData, image_url: ''})}
                  />
                </div>

                {/* Large Image Preview */}
                {formData.image_url && (
                  <div style={{
                    flex: '1',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <p style={{
                      fontSize: 'clamp(14px, 3vw, 16px)',
                      fontWeight: '600',
                      color: '#2d3748',
                      margin: '0'
                    }}>
                      Preview:
                    </p>
                    <div style={{
                      position: 'relative',
                      width: '100%',
                      height: '300px',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      border: '3px solid #e2e8f0',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}>
                      <Image
                        src={formData.image_url}
                        alt="Bee preview"
                        fill
                        style={{
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <Input
                type="text"
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                placeholder="Or enter image URL directly..."
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
          </div>

          {/* Features Section */}
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

          {/* SEO Section */}
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
              SEO Settings
            </h3>
            
            {/* SEO Title */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <label htmlFor="seo_title" style={{
                fontSize: 'clamp(14px, 3vw, 16px)',
                fontWeight: '600',
                color: '#2d3748'
              }}>
                SEO Title
              </label>
              <Input
                type="text"
                id="seo_title"
                value={formData.seo_title}
                onChange={(e) => setFormData({...formData, seo_title: e.target.value})}
                placeholder="e.g., Appointment Bee - 24/7 Virtual Receptionist"
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

            {/* SEO Description */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <label htmlFor="seo_description" style={{
                fontSize: 'clamp(14px, 3vw, 16px)',
                fontWeight: '600',
                color: '#2d3748'
              }}>
                SEO Description
              </label>
              <Textarea
                id="seo_description"
                value={formData.seo_description}
                onChange={(e) => setFormData({...formData, seo_description: e.target.value})}
                rows={3}
                placeholder="Brief description for search engines (150-160 characters)"
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

            {/* SEO OG Image */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <label htmlFor="seo_og_image" style={{
                fontSize: 'clamp(14px, 3vw, 16px)',
                fontWeight: '600',
                color: '#2d3748'
              }}>
                Social Media Image URL
              </label>
              <Input
                type="text"
                id="seo_og_image"
                value={formData.seo_og_image}
                onChange={(e) => setFormData({...formData, seo_og_image: e.target.value})}
                placeholder="https://example.com/social-image.jpg"
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
          </div>

          {/* Form Actions */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 'clamp(12px, 2vw, 16px)',
            paddingTop: 'clamp(16px, 3vw, 24px)',
            borderTop: '1px solid #e2e8f0'
          }}>
            <Button
              type="button"
              onClick={handleCancel}
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
              {isSubmitting ? 'Adding Bee...' : 'Add Bee'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
