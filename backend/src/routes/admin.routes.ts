import { Router } from 'express';
import { getBrands, createBrand, updateBrand, deleteBrand } from '../controllers/admin.controller';
import { requireAuth, requireSuperAdmin } from '../middlewares/auth.middleware';

const router = Router();

// 모든 경로는 /api/admin/brands 하위에 매핑됨
// 슈퍼 관리자만 접근 가능하도록 미들웨어 적용
router.use(requireAuth, requireSuperAdmin);

router.get('/', getBrands);
router.post('/', createBrand);
router.put('/:id', updateBrand);
router.delete('/:id', deleteBrand);

export default router;
