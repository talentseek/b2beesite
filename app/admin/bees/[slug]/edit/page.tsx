'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import BeeForm from '@/components/admin/BeeForm'

export default function EditBee() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string
  const [bee, setBee] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBee = async () => {
      try {
        const response = await fetch(`/api/bees/slug/${slug}`)
        if (!response.ok) {
          throw new Error('Bee not found')
        }
        const beeData = await response.json()
        setBee(beeData)
      } catch (error) {
        console.error('Error fetching bee:', error)
        alert('Bee not found')
        router.push('/admin/bees')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchBee()
    }
  }, [slug, router])

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/bees', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error('Failed to update bee')
      }

      router.push('/admin/bees')
    } catch (error) {
      console.error('Error updating bee:', error)
      throw error
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/bees/slug/${slug}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete bee')
      }

      router.push('/admin/bees')
    } catch (error) {
      console.error('Error deleting bee:', error)
      throw error
    }
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        fontSize: '18px',
        color: 'white'
      }}>
        Loading...
      </div>
    )
  }

  if (!bee) {
    return null
  }

  // Transform API data to form data format
  const initialData = {
    slug: bee.slug || '',
    name: bee.name || '',
    tagline: bee.tagline || '',
    role: bee.role || '',
    status: bee.status || 'draft',
    short_description: bee.short_description || '',
    description: bee.description || '',
    long_description: bee.long_description || '',
    price_usd: bee.prices?.USD?.toString() || '',
    price_gbp: bee.prices?.GBP?.toString() || '',
    price_eur: bee.prices?.EUR?.toString() || '',
    image_url: bee.image_url || '',
    features: bee.features || [],
    integrations: bee.integrations || [],
    seo_title: bee.seo_title || '',
    seo_description: bee.seo_description || '',
    seo_og_image: bee.seo_og_image || '',
    roi_traditional_admin_cost: bee.roi_model?.assumptions?.traditional_admin_cost?.toString() || '',
    roi_time_savings_percent: bee.roi_model?.benefits?.time_savings_percent?.toString() || '60',
    roi_accuracy_improvement_percent: bee.roi_model?.benefits?.accuracy_improvement_percent?.toString() || '25',
    roi_customer_satisfaction_boost: bee.roi_model?.benefits?.customer_satisfaction_boost?.toString() || '40',
    faqs: bee.faqs || [],
    demo_video_url: bee.demo_assets?.video_url || '',
    demo_screenshots: bee.demo_assets?.screenshots || [],
    demo_documentation_url: bee.demo_assets?.documentation_url || '',
    usage_pricing_usd: bee.usage_pricing?.USD?.rate_per_unit?.toString() || '',
    usage_pricing_gbp: bee.usage_pricing?.GBP?.rate_per_unit?.toString() || '',
    usage_pricing_eur: bee.usage_pricing?.EUR?.rate_per_unit?.toString() || '',
    usage_type: bee.usage_pricing?.USD?.usage_type || '',
    unit_description: bee.usage_pricing?.USD?.unit_description || ''
  }

  return (
    <BeeForm
      mode="edit"
      beeId={bee.id}
      beeSlug={bee.slug}
      initialData={initialData}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
    />
  )
}
