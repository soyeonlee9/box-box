import { Router } from 'express';
import analyticsRoutes from './analytics.routes';
import campaignsRoutes from './campaigns.routes';
import userRoutes from './user.routes';
import authRoutes from './auth.routes';
import badgesRoutes from './badges.routes';
import rewardsRoutes from './rewards.routes';
import scanRoutes from './scan.routes';
import adminRoutes from './admin.routes';
import teamRoutes from './team.routes';

const router = Router();

router.use('/analytics', analyticsRoutes);
router.use('/campaigns', campaignsRoutes);
router.use('/user', userRoutes);
router.use('/auth', authRoutes);
router.use('/badges', badgesRoutes);
router.use('/rewards', rewardsRoutes);
router.use('/scan', scanRoutes);
router.use('/admin/brands', adminRoutes);
router.use('/team', teamRoutes);

export default router;
