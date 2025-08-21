const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function migrateToPlanBee() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Starting PlanBee migration...');
    
    // 1. Add new columns to bees table
    console.log('📝 Adding new columns to bees table...');
    await client.query(`
      ALTER TABLE bees 
      ADD COLUMN IF NOT EXISTS slug VARCHAR(255),
      ADD COLUMN IF NOT EXISTS tagline VARCHAR(500),
      ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'draft',
      ADD COLUMN IF NOT EXISTS short_description TEXT,
      ADD COLUMN IF NOT EXISTS long_description TEXT,
      ADD COLUMN IF NOT EXISTS features JSONB,
      ADD COLUMN IF NOT EXISTS integrations JSONB,
      ADD COLUMN IF NOT EXISTS roi_model JSONB,
      ADD COLUMN IF NOT EXISTS faqs JSONB,
      ADD COLUMN IF NOT EXISTS demo_assets JSONB,
      ADD COLUMN IF NOT EXISTS seo_title VARCHAR(255),
      ADD COLUMN IF NOT EXISTS seo_description TEXT,
      ADD COLUMN IF NOT EXISTS seo_og_image VARCHAR(500)
    `);
    
    // 2. Add constraint for status enum
    console.log('🔒 Adding status constraint...');
    await client.query(`
      ALTER TABLE bees 
      DROP CONSTRAINT IF EXISTS bees_status_check
    `);
    await client.query(`
      ALTER TABLE bees 
      ADD CONSTRAINT bees_status_check CHECK (status IN ('active', 'inactive', 'draft'))
    `);
    
    // 3. Generate slugs for existing bees
    console.log('🏷️  Generating slugs for existing bees...');
    const beesResult = await client.query('SELECT id, name FROM bees');
    
    for (const bee of beesResult.rows) {
      const slug = bee.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      await client.query(
        'UPDATE bees SET slug = $1 WHERE id = $2',
        [slug, bee.id]
      );
    }
    
    // 4. Make slug unique and not null
    console.log('🔑 Making slug unique and not null...');
    await client.query(`
      ALTER TABLE bees 
      ALTER COLUMN slug SET NOT NULL
    `);
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS bees_slug_unique ON bees(slug)
    `);
    
    // 5. Add new columns to subscribers table
    console.log('📧 Adding bee tracking to subscribers...');
    await client.query(`
      ALTER TABLE subscribers 
      ADD COLUMN IF NOT EXISTS bee_id INTEGER REFERENCES bees(id) ON DELETE SET NULL,
      ADD COLUMN IF NOT EXISTS use_case_slug VARCHAR(255)
    `);
    
    // 6. Create new tables
    console.log('🆕 Creating new tables...');
    
    // Usage pricing table
    await client.query(`
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
      )
    `);
    
    // CTA Packs table
    await client.query(`
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
      )
    `);
    
    // Bee CTA Assignments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS bee_cta_assignments (
        id SERIAL PRIMARY KEY,
        bee_id INTEGER NOT NULL REFERENCES bees(id) ON DELETE CASCADE,
        cta_pack_id INTEGER NOT NULL REFERENCES cta_packs(id) ON DELETE CASCADE,
        is_default BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT bee_cta_assignments_unique UNIQUE (bee_id, cta_pack_id)
      )
    `);
    
    // Use Cases table
    await client.query(`
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
      )
    `);
    
    // 7. Create indexes
    console.log('📊 Creating indexes...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_bee_usage_pricing_bee_id ON bee_usage_pricing(bee_id);
      CREATE INDEX IF NOT EXISTS idx_bee_usage_pricing_currency ON bee_usage_pricing(currency_code);
      CREATE INDEX IF NOT EXISTS idx_bee_cta_assignments_bee_id ON bee_cta_assignments(bee_id);
      CREATE INDEX IF NOT EXISTS idx_bee_cta_assignments_cta_pack_id ON bee_cta_assignments(cta_pack_id);
      CREATE INDEX IF NOT EXISTS idx_use_cases_bee_id ON use_cases(bee_id);
      CREATE INDEX IF NOT EXISTS idx_use_cases_slug ON use_cases(slug);
      CREATE INDEX IF NOT EXISTS idx_use_cases_status ON use_cases(status);
      CREATE INDEX IF NOT EXISTS idx_subscribers_bee_id ON subscribers(bee_id);
      CREATE INDEX IF NOT EXISTS idx_bees_slug ON bees(slug);
      CREATE INDEX IF NOT EXISTS idx_bees_status ON bees(status);
    `);
    
    // 8. Create triggers for updated_at
    console.log('⏰ Creating triggers...');
    await client.query(`
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
    `);
    
    // 9. Create default CTA packs
    console.log('🎯 Creating default CTA packs...');
    const defaultCTAs = [
      {
        name: 'Default Demo Booking',
        primary_label: 'Book a Demo',
        primary_action: '/demo-booking',
        secondary_label: 'Learn More',
        secondary_action: '#features',
        microcopy: '15-minute demo • No commitment required'
      },
      {
        name: 'Default Coming Soon',
        primary_label: 'Notify Me at Launch',
        primary_action: '#notify-form',
        secondary_label: 'Learn More',
        secondary_action: '#features',
        microcopy: 'Get notified when we launch'
      }
    ];
    
    for (const cta of defaultCTAs) {
      await client.query(`
        INSERT INTO cta_packs (name, primary_label, primary_action, secondary_label, secondary_action, microcopy)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT DO NOTHING
      `, [cta.name, cta.primary_label, cta.primary_action, cta.secondary_label, cta.secondary_action, cta.microcopy]);
    }
    
    // 10. Update existing bees to active status
    console.log('✅ Updating existing bees to active status...');
    await client.query(`
      UPDATE bees SET status = 'active' WHERE status IS NULL OR status = 'draft'
    `);
    
    console.log('🎉 PlanBee migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateToPlanBee()
    .then(() => {
      console.log('✅ Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateToPlanBee };
