import { z } from 'zod'

// Base schemas
export const CurrencyCodeSchema = z.enum(['USD', 'GBP', 'EUR'])
export const BeeStatusSchema = z.enum(['active', 'inactive', 'draft'])

// FAQ schema
export const FAQSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required')
})

// ROI Model schema
export const ROIModelSchema = z.object({
  assumptions: z.object({
    traditional_admin_cost: z.number().min(0).optional(),
    traditional_security_cost: z.number().min(0).optional(),
    bee_cost_per_month: z.number().min(0).optional(),
    bee_coverage_hours: z.number().min(0).optional()
  }).optional(),
  benefits: z.object({
    time_savings_percent: z.number().min(0).max(100).optional(),
    accuracy_improvement_percent: z.number().min(0).max(100).optional(),
    customer_satisfaction_boost: z.number().min(0).max(100).optional()
  }).optional(),
  traditional_cost_description: z.string().optional()
})

// Demo Assets schema
export const DemoAssetsSchema = z.object({
  video_url: z.string().url().optional(),
  screenshots: z.array(z.string().url()).optional(),
  documentation_url: z.string().url().optional()
})

// Bee Price schema
export const BeePriceSchema = z.object({
  currency_code: CurrencyCodeSchema,
  amount: z.number().min(0)
})

// Usage Pricing schema
export const UsagePricingSchema = z.object({
  currency_code: CurrencyCodeSchema,
  usage_type: z.string().min(1, 'Usage type is required'),
  rate_per_unit: z.number().min(0, 'Rate must be positive'),
  unit_description: z.string().min(1, 'Unit description is required')
})

// Main Bee schema
export const BeeSchema = z.object({
  id: z.number().optional(),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  name: z.string().min(1, 'Name is required'),
  tagline: z.string().optional(),
  role: z.string().min(1, 'Role is required'),
  status: BeeStatusSchema.default('draft'),
  short_description: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  long_description: z.string().optional(),
  image_url: z.string().url().optional().nullable(),
  features: z.array(z.string()).optional(),
  integrations: z.array(z.string()).optional(),
  roi_model: ROIModelSchema.optional(),
  faqs: z.array(FAQSchema).optional(),
  demo_assets: DemoAssetsSchema.optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().max(160, 'SEO description should be 160 characters or less').optional(),
  seo_og_image: z.string().url().optional(),
  prices: z.array(BeePriceSchema).optional(),
  usage_pricing: z.array(UsagePricingSchema).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
})

// Form data schema for creating/editing bees
export const BeeFormDataSchema = z.object({
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  name: z.string().min(1, 'Name is required'),
  tagline: z.string().optional(),
  role: z.string().min(1, 'Role is required'),
  status: BeeStatusSchema.default('draft'),
  short_description: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  long_description: z.string().optional(),
  price_usd: z.string().optional(),
  price_gbp: z.string().optional(),
  price_eur: z.string().optional(),
  image_url: z.string().optional(),
  features: z.array(z.string()).optional(),
  integrations: z.array(z.string()).optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().max(160, 'SEO description should be 160 characters or less').optional(),
  seo_og_image: z.string().optional(),
  // ROI Model fields
  roi_traditional_admin_cost: z.string().optional(),
  roi_time_savings_percent: z.string().optional(),
  roi_accuracy_improvement_percent: z.string().optional(),
  roi_customer_satisfaction_boost: z.string().optional(),
  // FAQ fields
  faqs: z.array(FAQSchema).optional(),
  // Demo Assets fields
  demo_video_url: z.string().optional(),
  demo_screenshots: z.array(z.string()).optional(),
  demo_documentation_url: z.string().optional(),
  // Usage Pricing fields
  usage_pricing_usd: z.string().optional(),
  usage_pricing_gbp: z.string().optional(),
  usage_pricing_eur: z.string().optional(),
  usage_type: z.string().optional(),
  unit_description: z.string().optional()
})

// API request schema for creating bees
export const CreateBeeRequestSchema = z.object({
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  name: z.string().min(1, 'Name is required'),
  tagline: z.string().optional(),
  role: z.string().min(1, 'Role is required'),
  status: BeeStatusSchema.default('draft'),
  short_description: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  long_description: z.string().optional(),
  image_url: z.string().optional(),
  features: z.array(z.string()).optional(),
  integrations: z.array(z.string()).optional(),
  roi_model: ROIModelSchema.optional(),
  faqs: z.array(FAQSchema).optional(),
  demo_assets: DemoAssetsSchema.optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().max(160, 'SEO description should be 160 characters or less').optional(),
  seo_og_image: z.string().optional(),
  prices: z.record(CurrencyCodeSchema, z.number().min(0)).optional(),
  usage_pricing: z.record(CurrencyCodeSchema, z.object({
    usage_type: z.string().min(1, 'Usage type is required'),
    rate_per_unit: z.number().min(0, 'Rate must be positive'),
    unit_description: z.string().min(1, 'Unit description is required')
  })).optional()
})

// API request schema for updating bees
export const UpdateBeeRequestSchema = CreateBeeRequestSchema.extend({
  id: z.number().min(1, 'Bee ID is required')
})

// API request schema for deleting bees
export const DeleteBeeRequestSchema = z.object({
  id: z.number().min(1, 'Bee ID is required')
})

// API response schema
export const BeeResponseSchema = z.object({
  bee: BeeSchema
})

export const BeesResponseSchema = z.object({
  bees: z.array(BeeSchema)
})

// Validation functions
export function validateBeeData(data: unknown) {
  return BeeSchema.safeParse(data)
}

export function validateBeeFormData(data: unknown) {
  return BeeFormDataSchema.safeParse(data)
}

export function validateCreateBeeRequest(data: unknown) {
  return CreateBeeRequestSchema.safeParse(data)
}

export function validateUpdateBeeRequest(data: unknown) {
  return UpdateBeeRequestSchema.safeParse(data)
}

export function validateDeleteBeeRequest(data: unknown) {
  return DeleteBeeRequestSchema.safeParse(data)
}

export function validateBeeResponse(data: unknown) {
  return BeeResponseSchema.safeParse(data)
}

// Transform functions for converting form data to API format
export function transformFormDataToApiData(formData: z.infer<typeof BeeFormDataSchema>) {
  const prices: Record<string, number> = {}
  const usage_pricing: Record<string, any> = {}

  // Transform prices
  if (formData.price_usd && !isNaN(parseFloat(formData.price_usd))) {
    prices.USD = parseFloat(formData.price_usd)
  }
  if (formData.price_gbp && !isNaN(parseFloat(formData.price_gbp))) {
    prices.GBP = parseFloat(formData.price_gbp)
  }
  if (formData.price_eur && !isNaN(parseFloat(formData.price_eur))) {
    prices.EUR = parseFloat(formData.price_eur)
  }

  // Transform usage pricing
  if (formData.usage_pricing_usd && !isNaN(parseFloat(formData.usage_pricing_usd)) && formData.usage_type && formData.unit_description) {
    usage_pricing.USD = {
      usage_type: formData.usage_type,
      rate_per_unit: parseFloat(formData.usage_pricing_usd),
      unit_description: formData.unit_description
    }
  }
  if (formData.usage_pricing_gbp && !isNaN(parseFloat(formData.usage_pricing_gbp)) && formData.usage_type && formData.unit_description) {
    usage_pricing.GBP = {
      usage_type: formData.usage_type,
      rate_per_unit: parseFloat(formData.usage_pricing_gbp),
      unit_description: formData.unit_description
    }
  }
  if (formData.usage_pricing_eur && !isNaN(parseFloat(formData.usage_pricing_eur)) && formData.usage_type && formData.unit_description) {
    usage_pricing.EUR = {
      usage_type: formData.usage_type,
      rate_per_unit: parseFloat(formData.usage_pricing_eur),
      unit_description: formData.unit_description
    }
  }

  // Transform ROI model
  const roi_model = {
    assumptions: {
      traditional_admin_cost: formData.roi_traditional_admin_cost ? parseFloat(formData.roi_traditional_admin_cost) : undefined
    },
    benefits: {
      time_savings_percent: formData.roi_time_savings_percent ? parseFloat(formData.roi_time_savings_percent) : undefined,
      accuracy_improvement_percent: formData.roi_accuracy_improvement_percent ? parseFloat(formData.roi_accuracy_improvement_percent) : undefined,
      customer_satisfaction_boost: formData.roi_customer_satisfaction_boost ? parseFloat(formData.roi_customer_satisfaction_boost) : undefined
    }
  }

  // Transform demo assets
  const demo_assets = {
    video_url: formData.demo_video_url || undefined,
    screenshots: formData.demo_screenshots || undefined,
    documentation_url: formData.demo_documentation_url || undefined
  }

  return {
    slug: formData.slug,
    name: formData.name,
    tagline: formData.tagline,
    role: formData.role,
    status: formData.status,
    short_description: formData.short_description,
    description: formData.description,
    long_description: formData.long_description,
    image_url: formData.image_url,
    features: formData.features,
    integrations: formData.integrations,
    roi_model: Object.values(roi_model.assumptions).some(v => v !== undefined) || Object.values(roi_model.benefits).some(v => v !== undefined) ? roi_model : undefined,
    faqs: formData.faqs,
    demo_assets: Object.values(demo_assets).some(v => v !== undefined) ? demo_assets : undefined,
    seo_title: formData.seo_title,
    seo_description: formData.seo_description,
    seo_og_image: formData.seo_og_image,
    prices: Object.keys(prices).length > 0 ? prices : undefined,
    usage_pricing: Object.keys(usage_pricing).length > 0 ? usage_pricing : undefined
  }
}

// Type exports
export type Bee = z.infer<typeof BeeSchema>
export type BeeFormData = z.infer<typeof BeeFormDataSchema>
export type CreateBeeRequest = z.infer<typeof CreateBeeRequestSchema>
export type UpdateBeeRequest = z.infer<typeof UpdateBeeRequestSchema>
export type DeleteBeeRequest = z.infer<typeof DeleteBeeRequestSchema>
export type BeeResponse = z.infer<typeof BeeResponseSchema>
export type FAQ = z.infer<typeof FAQSchema>
export type ROIModel = z.infer<typeof ROIModelSchema>
export type DemoAssets = z.infer<typeof DemoAssetsSchema>
export type BeePrice = z.infer<typeof BeePriceSchema>
export type UsagePricing = z.infer<typeof UsagePricingSchema>
