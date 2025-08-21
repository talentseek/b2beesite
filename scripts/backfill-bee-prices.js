const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: false });

(async () => {
  try {
    const client = await pool.connect();
    console.log('🔌 Connected, backfilling bee_prices from bees.price (USD) ...');

    const { rows } = await client.query('SELECT id, price FROM bees WHERE price IS NOT NULL');
    for (const row of rows) {
      const amount = Math.round(Number(row.price));
      if (Number.isFinite(amount)) {
        await client.query(
          `INSERT INTO bee_prices (bee_id, currency_code, amount)
           VALUES ($1, 'USD', $2)
           ON CONFLICT (bee_id, currency_code)
           DO UPDATE SET amount = EXCLUDED.amount`,
          [row.id, amount]
        );
      }
    }

    console.log('✅ Backfill complete');
    client.release();
  } catch (e) {
    console.error('❌ Backfill failed:', e);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();
