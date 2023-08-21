import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'root',
  password: 'KVYkcrO1uxZSC3JQnnQrmIcmaVVw8xHl',
  host: 'dpg-cjdjecgq339s73avbamg-a.oregon-postgres.render.com',
  port: 5432,
  database: 'social_315h',
  idle_timeout: 600,
  ssl: true,
});

async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Connected to the database:', res.rows[0].now);
  } catch (error) {
    console.error('Error connecting to PostgreSQL:', error);
  }
}

testConnection();

export { pool };