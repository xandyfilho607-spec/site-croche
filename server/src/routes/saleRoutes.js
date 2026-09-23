import { Router } from 'express';
import {
  listSales,
  getSaleById,
  createSale,
  deleteSale,
} from '../controllers/saleController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Todas as rotas de vendas exigem autenticação do administrador
router.use(requireAuth);

router.get('/', listSales);
router.get('/:id', getSaleById);
router.post('/', createSale);
router.delete('/:id', deleteSale);

export default router;
