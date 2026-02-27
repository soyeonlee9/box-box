import { Router } from 'express';
import { recordScan } from '../controllers/scan.controller';

const router = Router();

// 스캔 기록 라우터 (비회원 가능이므로 현재는 auth 미들웨어 생략)
router.post('/', recordScan);

export default router;
