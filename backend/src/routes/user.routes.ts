import { Router } from 'express';
import { getHeaderData } from '../controllers/header.controller';
import { createUserBrand, testEmail } from '../controllers/user.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.get('/header', getHeaderData);
router.post('/brand', requireAuth, createUserBrand);
router.post('/test-email', requireAuth, testEmail);

export default router;
