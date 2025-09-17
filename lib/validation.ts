// Data validation utilities for B2BEE

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export interface BeeDataValidation {
  id?: number
  name: string
  slug: string
  role: string
  description: string
  tagline?: string
  status?: 'active' | 'inactive' | 'draft'
  short_description?: string
  long_description?: string
  image_url?: string
  features?: any[]
  integrations?: any[]
  roi_model?: any
  faqs?: any[]
  demo_assets?: any
  seo_title?: string
  seo_description?: string
  seo_og_image?: string
  prices?: any[]
  usage_pricing?: any[]
}

export function validateBeeData(data: any): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Required fields validation
  const requiredFields = ['name', 'slug', 'role', 'description']
  for (const field of requiredFields) {
    if (!data[field]) {
      errors.push(`Missing required field: ${field}`)
    }
  }

  // Slug format validation
  if (data.slug && !/^[a-z0-9-]+$/.test(data.slug)) {
    errors.push('Slug must contain only lowercase letters, numbers, and hyphens')
  }

  // Array fields validation
  if (data.features && !Array.isArray(data.features)) {
    errors.push('Features must be an array')
  }

  if (data.integrations && !Array.isArray(data.integrations)) {
    errors.push('Integrations must be an array')
  }

  if (data.faqs && !Array.isArray(data.faqs)) {
    errors.push('FAQs must be an array')
  }

  if (data.prices && !Array.isArray(data.prices)) {
    errors.push('Prices must be an array')
  }

  if (data.usage_pricing && !Array.isArray(data.usage_pricing)) {
    errors.push('Usage pricing must be an array')
  }

  // FAQ structure validation
  if (data.faqs && Array.isArray(data.faqs)) {
    for (let i = 0; i < data.faqs.length; i++) {
      const faq = data.faqs[i]
      if (!faq.question || !faq.answer) {
        errors.push(`FAQ at index ${i} must have both question and answer`)
      }
    }
  }

  // Price structure validation
  if (data.prices && Array.isArray(data.prices)) {
    for (let i = 0; i < data.prices.length; i++) {
      const price = data.prices[i]
      if (!price.currency_code || !price.amount) {
        errors.push(`Price at index ${i} must have currency_code and amount`)
      }
    }
  }

  // Usage pricing structure validation
  if (data.usage_pricing && Array.isArray(data.usage_pricing)) {
    for (let i = 0; i < data.usage_pricing.length; i++) {
      const usage = data.usage_pricing[i]
      if (!usage.currency_code || !usage.rate_per_unit || !usage.usage_type) {
        errors.push(`Usage pricing at index ${i} must have currency_code, rate_per_unit, and usage_type`)
      }
    }
  }

  // ROI model validation
  if (data.roi_model) {
    if (typeof data.roi_model !== 'object') {
      errors.push('ROI model must be an object')
    } else {
      if (data.roi_model.assumptions && typeof data.roi_model.assumptions !== 'object') {
        errors.push('ROI model assumptions must be an object')
      }
      if (data.roi_model.benefits && typeof data.roi_model.benefits !== 'object') {
        errors.push('ROI model benefits must be an object')
      }
    }
  }

  // SEO validation
  if (data.seo_description && data.seo_description.length > 160) {
    warnings.push('SEO description should be 160 characters or less')
  }

  // URL validation
  if (data.image_url && !isValidUrl(data.image_url)) {
    warnings.push('Image URL may not be valid')
  }

  if (data.seo_og_image && !isValidUrl(data.seo_og_image)) {
    warnings.push('SEO OG image URL may not be valid')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

export function validateFormData(formData: any): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Basic form validation
  if (!formData.name?.trim()) {
    errors.push('Name is required')
  }

  if (!formData.slug?.trim()) {
    errors.push('Slug is required')
  } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
    errors.push('Slug must contain only lowercase letters, numbers, and hyphens')
  }

  if (!formData.role?.trim()) {
    errors.push('Role is required')
  }

  if (!formData.description?.trim()) {
    errors.push('Description is required')
  }

  // Price validation
  const priceFields = [formData.price_usd, formData.price_gbp, formData.price_eur]
  for (const price of priceFields) {
    if (price && isNaN(parseFloat(price))) {
      errors.push('Prices must be valid numbers')
      break
    }
  }

  // ROI model validation
  const roiFields = [
    formData.roi_traditional_admin_cost,
    formData.roi_time_savings_percent,
    formData.roi_accuracy_improvement_percent,
    formData.roi_customer_satisfaction_boost
  ]
  for (const roi of roiFields) {
    if (roi && isNaN(parseFloat(roi))) {
      errors.push('ROI model values must be valid numbers')
      break
    }
  }

  // Usage pricing validation
  const usageFields = [formData.usage_pricing_usd, formData.usage_pricing_gbp, formData.usage_pricing_eur]
  for (const usage of usageFields) {
    if (usage && isNaN(parseFloat(usage))) {
      errors.push('Usage pricing values must be valid numbers')
      break
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

export function validateApiResponse(data: any): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (!data) {
    errors.push('API response is empty')
    return { isValid: false, errors, warnings }
  }

  if (!data.bee) {
    errors.push('API response missing bee data')
    return { isValid: false, errors, warnings }
  }

  // Validate the bee data structure
  const beeValidation = validateBeeData(data.bee)
  errors.push(...beeValidation.errors)
  warnings.push(...beeValidation.warnings)

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

function isValidUrl(string: string): boolean {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

// Data consistency check between API and form
export function checkDataConsistency(apiData: any, formData: any): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (!apiData || !formData) {
    errors.push('Cannot check consistency: missing data')
    return { isValid: false, errors, warnings }
  }

  // Check if key fields match
  const keyFields = ['name', 'slug', 'role', 'description']
  for (const field of keyFields) {
    if (apiData[field] !== formData[field]) {
      warnings.push(`Field mismatch: ${field}`)
    }
  }

  // Check array lengths
  if (apiData.integrations?.length !== formData.integrations?.length) {
    warnings.push('Integration count mismatch')
  }

  if (apiData.features?.length !== formData.features?.length) {
    warnings.push('Feature count mismatch')
  }

  if (apiData.faqs?.length !== formData.faqs?.length) {
    warnings.push('FAQ count mismatch')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

// Log validation results for debugging
export function logValidationResult(result: ValidationResult, context: string = 'Validation') {
  if (result.errors.length > 0) {
    console.error(`❌ ${context} Errors:`, result.errors)
  }
  if (result.warnings.length > 0) {
    console.warn(`⚠️ ${context} Warnings:`, result.warnings)
  }
  if (result.isValid && result.errors.length === 0) {
    console.log(`✅ ${context} passed`)
  }
}
