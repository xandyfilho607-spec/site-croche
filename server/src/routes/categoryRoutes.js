import { Router } from 'express';
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Rota pública para catálogo/loja
router.get('/', listCategories);

// Rotas protegidas (apenas administradora autenticada)
router.post('/', requireAuth, createCategory);
router.put('/:id', requireAuth, updateCategory);
router.delete('/:id', requireAuth, deleteCategory);

export default router;
