import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth);
router.get('/stats', getDashboardStats);

export default router;
