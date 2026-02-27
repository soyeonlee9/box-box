import { Router } from 'express';
import { getBadges, createBadge, updateBadge, deleteBadge } from '../controllers/badges.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', requireAuth, getBadges);
router.post('/', requireAuth, createBadge);
router.put('/:id', requireAuth, updateBadge);
router.delete('/:id', requireAuth, deleteBadge);

export default router;
