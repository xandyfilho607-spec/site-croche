import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import saleRoutes from './routes/saleRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import { pool } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configuração de CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CORS_ORIGIN,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Permitir requisições sem origin (como mobile apps, curl ou postman)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, true); // Permissivo em ambiente de desenvolvimento
  },
  credentials: true,
}));

app.use(express.json());

// Rota de Health Check e status da conexão com o Neon
app.get('/api/health', async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    const dbTest = await pool.query('SELECT 1');
    if (dbTest.rowCount > 0) dbStatus = 'connected';
  } catch (err) {
    dbStatus = `error: ${err.message}`;
  }

  res.json({
    status: 'ok',
    store: 'Mereça Crochê API',
    timestamp: new Date().toISOString(),
    database: dbStatus,
  });
});

// Rotas da API
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/settings', settingsRoutes);

// Tratamento de rotas não encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint não encontrado.',
  });
});

// Middleware de tratamento de erro global
app.use((err, req, res, next) => {
  console.error('❌ Erro não tratado na aplicação:', err);
  res.status(500).json({
    success: false,
    error: 'Ocorreu um erro interno no servidor.',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

app.listen(PORT, () => {
  console.log('----------------------------------------------------');
  console.log(`🌸 Servidor Mereça Crochê rodando na porta ${PORT}`);
  console.log(`📡 URL base: http://localhost:${PORT}/api`);
  console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
  console.log('----------------------------------------------------');
});
