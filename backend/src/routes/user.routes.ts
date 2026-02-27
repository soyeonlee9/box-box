import { Router } from 'express';
import { getHeaderData } from '../controllers/header.controller';
import { createUserBrand } from '../controllers/user.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.get('/header', getHeaderData);
router.post('/brand', requireAuth, createUserBrand);

export default router;
