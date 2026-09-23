import { Router } from 'express';
import {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  toggleProductStatus,
  deleteProduct,
} from '../controllers/productController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Rotas públicas (Catálogo / Loja)
router.get('/', listProducts);
router.get('/:id', getProductById);

// Rotas administrativas protegidas
router.post('/', requireAuth, createProduct);
router.put('/:id', requireAuth, updateProduct);
router.patch('/:id/status', requireAuth, toggleProductStatus);
router.delete('/:id', requireAuth, deleteProduct);

export default router;
