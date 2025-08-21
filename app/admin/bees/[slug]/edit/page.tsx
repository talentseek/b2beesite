'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import ImageUpload from '@/components/ImageUpload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { Bee } from '@/lib/types'

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
  image_url: string
  features: string[]
  integrations: string[]
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

export default function EditBee() {
  const router = useRouter()
  const params = useParams()
  const beeSlug = params.slug as string

  const [bee, setBee] = useState<Bee | null>(null)
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
    image_url: '',
    features: [],
    integrations: [],
    seo_title: '',
    seo_description: '',
    seo_og_image: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Fetch bee data
  useEffect(() => {
    const fetchBee = async () => {
      try {
        // Get the bee by slug
        const response = await fetch(`/api/bees/slug/${beeSlug}`)
        if (response.ok) {
          const data = await response.json()
          const fullBeeData = data.bee
          setBee(fullBeeData)
            
            setFormData({
              slug: fullBeeData.slug || '',
              name: fullBeeData.name || '',
              tagline: fullBeeData.tagline || '',
              role: fullBeeData.role || '',
              status: fullBeeData.status || 'draft',
              short_description: fullBeeData.short_description || '',
              description: fullBeeData.description || '',
              long_description: fullBeeData.long_description || '',
              price_usd: fullBeeData.display_price?.USD?.toString() || '',
              price_gbp: fullBeeData.display_price?.GBP?.toString() || '',
              price_eur: fullBeeData.display_price?.EUR?.toString() || '',
              image_url: fullBeeData.image_url || '',
              features: fullBeeData.features || [],
              integrations: fullBeeData.integrations || [],
              seo_title: fullBeeData.seo_title || '',
              seo_description: fullBeeData.seo_description || '',
              seo_og_image: fullBeeData.seo_og_image || ''
            })
          }
        } else {
          alert('Bee not found')
          router.push('/admin/bees')
        }
      } catch (error) {
        console.error('Error fetching bee:', error)
        alert('Failed to load bee data')
        router.push('/admin/bees')
      } finally {
        setIsLoading(false)
      }
    }

    if (beeSlug) {
      fetchBee()
    }
  }, [beeSlug, router])

  // Track unsaved changes
  useEffect(() => {
    if (bee) {
      const hasChanges = 
        formData.name !== bee.name ||
        formData.role !== bee.role ||
        formData.description !== bee.description ||
        formData.price_usd !== (bee.prices?.USD?.toString() || '') ||
        formData.price_gbp !== (bee.prices?.GBP?.toString() || '') ||
        formData.price_eur !== (bee.prices?.EUR?.toString() || '') ||
        formData.image_url !== (bee.image_url || '')
      
      setHasUnsavedChanges(hasChanges)
    }
  }, [formData, bee])

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
        id: bee?.id,
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
        seo_title: formData.seo_title,
        seo_description: formData.seo_description,
        seo_og_image: formData.seo_og_image,
        prices,
      }

      const response = await fetch('/api/bees', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(beeData)
      })

      if (response.ok) {
        alert('Bee updated successfully!')
        router.push('/admin/bees')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update bee')
      }
    } catch (error) {
      console.error('Error updating bee:', error)
      alert('Failed to update bee. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this bee? This action cannot be undone.')) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/bees/slug/${beeSlug}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert('Bee deleted successfully!')
        router.push('/admin/bees')
      } else {
        alert('Failed to delete bee')
      }
    } catch (error) {
      console.error('Error deleting bee:', error)
      alert('Failed to delete bee. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
        router.push('/admin/bees')
      }
    } else {
      router.push('/admin/bees')
    }
  }

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        color: 'white'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <div style={{
              fontSize: '24px',
              animation: 'bounce 1.4s ease-in-out infinite both'
            }}>🐝</div>
            <div style={{
              fontSize: '24px',
              animation: 'bounce 1.4s ease-in-out infinite both 0.2s'
            }}>🐝</div>
            <div style={{
              fontSize: '24px',
              animation: 'bounce 1.4s ease-in-out infinite both 0.4s'
            }}>🐝</div>
          </div>
          <p style={{
            fontSize: 'clamp(16px, 3vw, 18px)',
            fontWeight: '500',
            opacity: '0.9'
          }}>
            Loading bee data...
          </p>
        </div>
        
        <style jsx>{`
          @keyframes bounce {
            0%, 80%, 100% {
              transform: scale(0);
            }
            40% {
              transform: scale(1);
            }
          }
        `}</style>
      </div>
    )
  }

  if (!bee) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        color: 'white'
      }}>
        <p style={{
          fontSize: 'clamp(18px, 4vw, 24px)',
          margin: '0'
        }}>
          Bee not found
        </p>
      </div>
    )
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
          <span style={{ color: '#fe8a00', fontWeight: '600' }}>Edit {bee.name}</span>
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
            Edit Bee: {bee.name}
          </h1>

          <div style={{
            display: 'flex',
            gap: 'clamp(8px, 2vw, 12px)'
          }}>
            <Button
              onClick={handleDelete}
              disabled={isSubmitting}
              style={{
                background: '#e53e3e',
                color: 'white',
                border: 'none',
                padding: 'clamp(8px, 1.5vw, 12px) clamp(16px, 3vw, 24px)',
                borderRadius: '8px',
                fontSize: 'clamp(12px, 2.5vw, 14px)',
                fontWeight: '500',
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
              Delete Bee
            </Button>
            
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
              Description *
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
              {isSubmitting ? 'Updating Bee...' : 'Update Bee'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
