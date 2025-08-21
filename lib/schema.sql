-- Create subscribers table for email collection
CREATE TABLE IF NOT EXISTS subscribers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  source VARCHAR(100) DEFAULT 'coming-soon-page'
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

-- Create bees table for bee profiles
CREATE TABLE IF NOT EXISTS bees (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2),
  image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for bees table
CREATE INDEX IF NOT EXISTS idx_bees_is_active ON bees(is_active);
CREATE INDEX IF NOT EXISTS idx_bees_role ON bees(role);
CREATE INDEX IF NOT EXISTS idx_bees_created_at ON bees(created_at);

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

-- Indexes for bee_prices
CREATE INDEX IF NOT EXISTS idx_bee_prices_bee_id ON bee_prices(bee_id);
CREATE INDEX IF NOT EXISTS idx_bee_prices_currency ON bee_prices(currency_code);

-- Trigger to auto-update updated_at on bee_prices
DROP TRIGGER IF EXISTS update_bee_prices_updated_at ON bee_prices;
CREATE TRIGGER update_bee_prices_updated_at
  BEFORE UPDATE ON bee_prices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();