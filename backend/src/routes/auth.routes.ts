import { Router } from 'express';
import { socialLogin } from '../controllers/auth.controller';

const router = Router();

// 프론트엔드가 소셜 계정 정보를 전달하면 DB에 유저 생성/업데이트 후 JWT 발급
router.post('/social', socialLogin);

export default router;
