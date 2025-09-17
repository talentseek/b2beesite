// PlanBee TypeScript Interfaces

export interface Bee {
  id: number
  slug: string
  name: string
  tagline?: string
  role: string
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT'
  shortDescription?: string
  description: string
  longDescription?: string
  imageUrl?: string
  features?: any
  integrations?: any
  roiModel?: any
  faqs?: any[]
  demoAssets?: any
  seoTitle?: string
  seoDescription?: string
  seoOgImage?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  prices?: Record<string, number>
  usagePricing?: any[]
  usage_pricing?: Record<string, any>
}

export interface BeePrice {
  id: number
  bee_id: number
  currency_code: 'USD' | 'GBP' | 'EUR'
  amount: number
  created_at: string
  updated_at: string
}

export interface BeeUsagePricing {
  id: number
  bee_id: number
  currency_code: 'USD' | 'GBP' | 'EUR'
  usage_type: string
  rate_per_unit: number
  unit_description: string
  created_at: string
  updated_at: string
}

export interface CTAPack {
  id: number
  name: string
  primary_label: string
  primary_action: string
  secondary_label?: string
  secondary_action?: string
  microcopy?: string
  created_at: string
  updated_at: string
}

export interface BeeCTAAssignment {
  id: number
  bee_id: number
  cta_pack_id: number
  is_default: boolean
  created_at: string
}

export interface UseCase {
  id: number
  bee_id: number
  slug: string
  industry: string
  headline: string
  subheadline?: string
  problem_section?: ProblemSection
  solution_section?: SolutionSection
  example_scenarios?: ExampleScenario[]
  playbooks?: Playbook[]
  roi_assumptions?: ROIAssumptions
  integrations?: string[]
  social_proof?: SocialProof
  faqs?: FAQ[]
  primary_ctas?: CTA[]
  secondary_ctas?: CTA[]
  seo_title?: string
  seo_description?: string
  status: 'active' | 'inactive' | 'draft'
  created_at: string
  updated_at: string
}

export interface Subscriber {
  id: number
  email: string
  created_at: string
  updated_at: string
  is_active: boolean
  source: string
  bee_id?: number
  use_case_slug?: string
}

// Supporting interfaces
export interface ROIModel {
  assumptions?: {
    traditional_admin_cost?: number
    traditional_security_cost?: number
    bee_cost_per_month?: number
    bee_coverage_hours?: number
  }
  benefits?: {
    time_savings_percent?: number
    accuracy_improvement_percent?: number
    customer_satisfaction_boost?: number
  }
  traditional_cost_description?: string
}

export interface FAQ {
  question: string
  answer: string
}

export interface DemoAssets {
  audio_samples?: string[]
  video_demo?: string
  screenshots?: string[]
}

export interface ProblemSection {
  pains: Pain[]
}

export interface Pain {
  title: string
  description: string
  impact: string
}

export interface SolutionSection {
  solutions: Solution[]
}

export interface Solution {
  pain_index: number // References the pain this solves
  title: string
  description: string
  features: string[]
}

export interface ExampleScenario {
  title: string
  situation: string
  what_happens: string
  outcome: string
}

export interface Playbook {
  title: string
  description: string
  steps: PlaybookStep[]
}

export interface PlaybookStep {
  step_number: number
  title: string
  description: string
  duration?: string
}

export interface ROIAssumptions {
  calls_per_month: number
  avg_call_length_minutes: number
  staff_cost_per_month: number
  bee_base_cost: number
  bee_usage_rate?: number
  estimated_savings_percentage: number
}

export interface SocialProof {
  testimonials?: Testimonial[]
  logos?: string[]
  case_studies?: CaseStudy[]
}

export interface Testimonial {
  quote: string
  author: string
  company: string
  role?: string
}

export interface CaseStudy {
  title: string
  company: string
  industry: string
  results: string
  metrics: string[]
}

export interface CTA {
  label: string
  action: string
  type: 'primary' | 'secondary' | 'tertiary'
  external?: boolean
}

// API Response interfaces
export interface BeesResponse {
  bees: Bee[]
}

export interface BeeResponse {
  bee: Bee
}

export interface UseCasesResponse {
  use_cases: UseCase[]
}

export interface UseCaseResponse {
  use_case: UseCase
}

export interface CTAPacksResponse {
  cta_packs: CTAPack[]
}

export interface SubscribersResponse {
  subscribers: Subscriber[]
}

// Form interfaces
export interface CreateBeeForm {
  slug: string
  name: string
  tagline?: string
  role: string
  status: 'active' | 'inactive' | 'draft'
  short_description?: string
  description: string
  long_description?: string
  image_url?: string
  features?: string[]
  integrations?: string[]
  roi_model?: ROIModel
  faqs?: FAQ[]
  demo_assets?: DemoAssets
  seo_title?: string
  seo_description?: string
  seo_og_image?: string
  prices: {
    GBP?: number
    USD?: number
    EUR?: number
  }
  usage_pricing?: {
    GBP?: { usage_type: string; rate_per_unit: number; unit_description: string }
    USD?: { usage_type: string; rate_per_unit: number; unit_description: string }
    EUR?: { usage_type: string; rate_per_unit: number; unit_description: string }
  }
}

export interface CreateUseCaseForm {
  bee_id: number
  slug: string
  industry: string
  headline: string
  subheadline?: string
  problem_section?: ProblemSection
  solution_section?: SolutionSection
  example_scenarios?: ExampleScenario[]
  playbooks?: Playbook[]
  roi_assumptions?: ROIAssumptions
  integrations?: string[]
  social_proof?: SocialProof
  faqs?: FAQ[]
  primary_ctas?: CTA[]
  secondary_ctas?: CTA[]
  seo_title?: string
  seo_description?: string
  status: 'active' | 'inactive' | 'draft'
}

export interface CreateCTAPackForm {
  name: string
  primary_label: string
  primary_action: string
  secondary_label?: string
  secondary_action?: string
  microcopy?: string
}
