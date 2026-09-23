import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Rota pública para o site obter o nome da loja, número do WhatsApp e contatos
router.get('/', getSettings);

// Rota administrativa para alterar as configurações
router.put('/', requireAuth, updateSettings);

export default router;
