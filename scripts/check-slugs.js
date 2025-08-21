const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkSlugs() {
  try {
    const result = await pool.query('SELECT id, name, slug FROM bees ORDER BY id');
    console.log('Bees with slugs:');
    result.rows.forEach(bee => {
      console.log(`${bee.id}: ${bee.name} -> ${bee.slug}`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

checkSlugs();
