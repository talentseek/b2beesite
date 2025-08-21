-- Create subscribers table for email collection
CREATE TABLE IF NOT EXISTS subscribers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  source VARCHAR(100) DEFAULT 'coming-soon-page',
  bee_id INTEGER REFERENCES bees(id) ON DELETE SET NULL,
  use_case_slug VARCHAR(255)
);

-- Create page_analytics table for tracking visits and interactions
CREATE TABLE IF NOT EXISTS page_analytics (
  id SERIAL PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  event_data JSONB,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_created_at ON subscribers(created_at);
CREATE INDEX IF NOT EXISTS idx_subscribers_bee_id ON subscribers(bee_id);
CREATE INDEX IF NOT EXISTS idx_page_analytics_event_type ON page_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_page_analytics_created_at ON page_analytics(created_at);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_subscribers_updated_at ON subscribers;
CREATE TRIGGER update_subscribers_updated_at 
  BEFORE UPDATE ON subscribers 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Create bees table for bee profiles (UPDATED FOR PLANBEE)
CREATE TABLE IF NOT EXISTS bees (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  tagline VARCHAR(500),
  role VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('active', 'inactive', 'draft')),
  short_description TEXT,
  description TEXT NOT NULL,
  long_description TEXT,
  price DECIMAL(10,2),
  image_url VARCHAR(500),
  features JSONB,
  integrations JSONB,
  roi_model JSONB,
  faqs JSONB,
  demo_assets JSONB,
  seo_title VARCHAR(255),
  seo_description TEXT,
  seo_og_image VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for bees table
CREATE INDEX IF NOT EXISTS idx_bees_is_active ON bees(is_active);
CREATE INDEX IF NOT EXISTS idx_bees_role ON bees(role);
CREATE INDEX IF NOT EXISTS idx_bees_created_at ON bees(created_at);
CREATE INDEX IF NOT EXISTS idx_bees_slug ON bees(slug);
CREATE INDEX IF NOT EXISTS idx_bees_status ON bees(status);

-- Create trigger to automatically update bees updated_at
DROP TRIGGER IF EXISTS update_bees_updated_at ON bees;
CREATE TRIGGER update_bees_updated_at 
  BEFORE UPDATE ON bees 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column(); 

-- Regional pricing table for bees
CREATE TABLE IF NOT EXISTS bee_prices (
  id SERIAL PRIMARY KEY,
  bee_id INTEGER NOT NULL REFERENCES bees(id) ON DELETE CASCADE,
  currency_code VARCHAR(3) NOT NULL,
  amount INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT bee_prices_currency_check CHECK (currency_code IN ('USD','GBP','EUR')),
  CONSTRAINT bee_prices_unique UNIQUE (bee_id, currency_code)
);

-- Usage pricing table for bees (NEW)
CREATE TABLE IF NOT EXISTS bee_usage_pricing (
  id SERIAL PRIMARY KEY,
  bee_id INTEGER NOT NULL REFERENCES bees(id) ON DELETE CASCADE,
  currency_code VARCHAR(3) NOT NULL,
  usage_type VARCHAR(50) NOT NULL,
  rate_per_unit DECIMAL(10,4) NOT NULL,
  unit_description VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT bee_usage_pricing_currency_check CHECK (currency_code IN ('USD','GBP','EUR')),
  CONSTRAINT bee_usage_pricing_unique UNIQUE (bee_id, currency_code, usage_type)
);

-- CTA Packs table (NEW)
CREATE TABLE IF NOT EXISTS cta_packs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  primary_label VARCHAR(255) NOT NULL,
  primary_action VARCHAR(500) NOT NULL,
  secondary_label VARCHAR(255),
  secondary_action VARCHAR(500),
  microcopy TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bee CTA Assignments table (NEW)
CREATE TABLE IF NOT EXISTS bee_cta_assignments (
  id SERIAL PRIMARY KEY,
  bee_id INTEGER NOT NULL REFERENCES bees(id) ON DELETE CASCADE,
  cta_pack_id INTEGER NOT NULL REFERENCES cta_packs(id) ON DELETE CASCADE,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT bee_cta_assignments_unique UNIQUE (bee_id, cta_pack_id)
);

-- Use Cases table (NEW)
CREATE TABLE IF NOT EXISTS use_cases (
  id SERIAL PRIMARY KEY,
  bee_id INTEGER NOT NULL REFERENCES bees(id) ON DELETE CASCADE,
  slug VARCHAR(255) NOT NULL,
  industry VARCHAR(255) NOT NULL,
  headline VARCHAR(500) NOT NULL,
  subheadline TEXT,
  problem_section JSONB,
  solution_section JSONB,
  example_scenarios JSONB,
  playbooks JSONB,
  roi_assumptions JSONB,
  integrations JSONB,
  social_proof JSONB,
  faqs JSONB,
  primary_ctas JSONB,
  secondary_ctas JSONB,
  seo_title VARCHAR(255),
  seo_description TEXT,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('active', 'inactive', 'draft')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT use_cases_unique UNIQUE (bee_id, slug)
);

-- Indexes for new tables
CREATE INDEX IF NOT EXISTS idx_bee_prices_bee_id ON bee_prices(bee_id);
CREATE INDEX IF NOT EXISTS idx_bee_prices_currency ON bee_prices(currency_code);
CREATE INDEX IF NOT EXISTS idx_bee_usage_pricing_bee_id ON bee_usage_pricing(bee_id);
CREATE INDEX IF NOT EXISTS idx_bee_usage_pricing_currency ON bee_usage_pricing(currency_code);
CREATE INDEX IF NOT EXISTS idx_bee_cta_assignments_bee_id ON bee_cta_assignments(bee_id);
CREATE INDEX IF NOT EXISTS idx_bee_cta_assignments_cta_pack_id ON bee_cta_assignments(cta_pack_id);
CREATE INDEX IF NOT EXISTS idx_use_cases_bee_id ON use_cases(bee_id);
CREATE INDEX IF NOT EXISTS idx_use_cases_slug ON use_cases(slug);
CREATE INDEX IF NOT EXISTS idx_use_cases_status ON use_cases(status);

-- Triggers to auto-update updated_at on all tables
DROP TRIGGER IF EXISTS update_bee_prices_updated_at ON bee_prices;
CREATE TRIGGER update_bee_prices_updated_at
  BEFORE UPDATE ON bee_prices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bee_usage_pricing_updated_at ON bee_usage_pricing;
CREATE TRIGGER update_bee_usage_pricing_updated_at
  BEFORE UPDATE ON bee_usage_pricing
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cta_packs_updated_at ON cta_packs;
CREATE TRIGGER update_cta_packs_updated_at
  BEFORE UPDATE ON cta_packs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_use_cases_updated_at ON use_cases;
CREATE TRIGGER update_use_cases_updated_at
  BEFORE UPDATE ON use_cases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();