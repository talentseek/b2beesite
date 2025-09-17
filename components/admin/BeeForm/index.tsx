'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BasicInfo from './BasicInfo'
import PricingSection from './PricingSection'
import FeaturesSection from './FeaturesSection'
import ROISection from './ROISection'
import DemoSection from './DemoSection'
import SEOSection from './SEOSection'
import FormActions from './FormActions'
import { validateBeeFormData, transformFormDataToApiData } from '@/lib/schemas'

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
  roi_traditional_admin_cost: string
  roi_time_savings_percent: string
  roi_accuracy_improvement_percent: string
  roi_customer_satisfaction_boost: string
  faqs: Array<{ question: string; answer: string }>
  demo_video_url: string
  demo_screenshots: string[]
  demo_documentation_url: string
  usage_pricing_usd: string
  usage_pricing_gbp: string
  usage_pricing_eur: string
  usage_type: string
  unit_description: string
}

interface FormErrors {
  slug?: string
  name?: string
  role?: string
  description?: string
  price?: string
  general?: string
  [key: string]: string | undefined
}

interface BeeFormProps {
  initialData?: Partial<FormData>
  mode: 'create' | 'edit'
  beeId?: number
  beeSlug?: string
  onSubmit: (data: any) => Promise<void>
  onDelete?: () => Promise<void>
}

export default function BeeForm({ 
  initialData, 
  mode, 
  beeId, 
  beeSlug, 
  onSubmit, 
  onDelete 
}: BeeFormProps) {
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
    image_url: '',
    features: [],
    integrations: [],
    seo_title: '',
    seo_description: '',
    seo_og_image: '',
    roi_traditional_admin_cost: '',
    roi_time_savings_percent: '',
    roi_accuracy_improvement_percent: '',
    roi_customer_satisfaction_boost: '',
    faqs: [],
    demo_video_url: '',
    demo_screenshots: [],
    demo_documentation_url: '',
    usage_pricing_usd: '',
    usage_pricing_gbp: '',
    usage_pricing_eur: '',
    usage_type: '',
    unit_description: '',
    ...initialData
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Auto-generate slug from name
  useEffect(() => {
    if (formData.name && !formData.slug) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      setFormData(prev => ({ ...prev, slug }))
    }
  }, [formData.name, formData.slug])

  // Track unsaved changes
  useEffect(() => {
    if (initialData) {
      const hasChanges = Object.keys(formData).some(key => {
        const currentValue = formData[key as keyof FormData]
        const initialValue = initialData[key as keyof FormData]
        return currentValue !== initialValue
      })
      setHasUnsavedChanges(hasChanges)
    }
  }, [formData, initialData])

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Use Zod validation for form data
    const formValidation = validateBeeFormData(formData)
    if (!formValidation.success) {
      console.error('Form validation errors:', formValidation.error.errors)
      
      // Convert Zod errors to form errors
      const newErrors: FormErrors = {}
      formValidation.error.errors.forEach(error => {
        const field = error.path.join('.')
        newErrors[field] = error.message
      })
      
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      // Transform form data to API format using Zod
      const apiData = transformFormDataToApiData(formData)
      if (mode === 'edit' && beeId) {
        (apiData as any).id = beeId
      }
      
      console.log('Submitting bee data:', apiData)
      await onSubmit(apiData)
      
      // Clear unsaved changes flag
      setHasUnsavedChanges(false)
      
    } catch (error) {
      console.error('Error submitting form:', error)
      setErrors({
        general: 'Failed to save changes. Please try again.'
      })
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

  const handleDelete = async () => {
    if (!onDelete) return
    
    if (!confirm('Are you sure you want to delete this bee? This action cannot be undone.')) {
      return
    }

    setIsSubmitting(true)
    try {
      await onDelete()
    } catch (error) {
      console.error('Error deleting bee:', error)
      alert('Failed to delete bee. Please try again.')
    } finally {
      setIsSubmitting(false)
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
          <span style={{ color: '#fe8a00', fontWeight: '600' }}>
            {mode === 'create' ? 'Create New Bee' : `Edit ${formData.name || 'Bee'}`}
          </span>
        </div>

        <h1 style={{
          fontSize: 'clamp(24px, 5vw, 32px)',
          fontWeight: 'bold',
          color: 'white',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
          margin: '0'
        }}>
          {mode === 'create' ? 'Create New Bee' : `Edit Bee: ${formData.name}`}
        </h1>
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
          
          {/* General Error Display */}
          {errors.general && (
            <div style={{
              padding: '12px 16px',
              background: '#fed7d7',
              border: '1px solid #feb2b2',
              borderRadius: '8px',
              color: '#c53030',
              fontSize: '14px'
            }}>
              {errors.general}
            </div>
          )}

          {/* Form Sections */}
          <BasicInfo formData={formData} setFormData={setFormData} errors={errors} />
          <PricingSection formData={formData} setFormData={setFormData} errors={errors} />
          <FeaturesSection formData={formData} setFormData={setFormData} />
          <ROISection formData={formData} setFormData={setFormData} />
          <DemoSection formData={formData} setFormData={setFormData} errors={errors} />
          <SEOSection formData={formData} setFormData={setFormData} />

          {/* Form Actions */}
          <FormActions
            isSubmitting={isSubmitting}
            onCancel={handleCancel}
            onDelete={mode === 'edit' ? handleDelete : undefined}
            submitText={mode === 'create' ? 'Create Bee' : 'Update Bee'}
            showDelete={mode === 'edit'}
          />
        </form>
      </div>
    </div>
  )
}
