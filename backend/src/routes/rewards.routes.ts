import { Router } from 'express';
import { getRewards, createReward, updateReward, deleteReward, useReward } from '../controllers/rewards.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', requireAuth, getRewards);
router.post('/', requireAuth, createReward);
router.put('/:id', requireAuth, updateReward);
router.delete('/:id', requireAuth, deleteReward);
router.post('/:id/use', requireAuth, useReward);

export default router;
