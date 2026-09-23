import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carregar server/.env explicitamente
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') });
dotenv.config();

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn('⚠️ AVISO: DATABASE_URL não foi definida em server/.env.');
  console.warn('   As operações com o banco Neon exigirão essa variável configurada.');
}

export const pool = new Pool({
  connectionString: connectionString || undefined,
  ssl: connectionString ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  console.error('❌ Erro inesperado no cliente do pool PostgreSQL:', err.message);
});

export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'production') {
      console.log('⚡ Query executada:', { text: text.slice(0, 80), duration: `${duration}ms`, rows: res.rowCount });
    }
    return res;
  } catch (error) {
    console.error('❌ Erro na query PostgreSQL:', { text, error: error.message });
    throw error;
  }
};
