import { Router } from 'express';
import { getSummary, getDetailedAnalytics, getSegments } from '../controllers/analytics.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

// GET /api/analytics/summary
router.get('/summary', requireAuth, getSummary);

// GET /api/analytics/detailed
router.get('/detailed', requireAuth, getDetailedAnalytics);

// GET /api/analytics/segments
router.get('/segments', requireAuth, getSegments);

export default router;
