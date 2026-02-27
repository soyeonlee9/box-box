import { Router } from 'express';
import { getCampaigns, createCampaign, updateCampaign, deleteCampaign } from '../controllers/campaigns.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

// GET은 프론트엔드 연동이 기존에 오픈되어 있었으므로 유지하거나 인증 추가 가능 (지금은 유지)
router.get('/', requireAuth, getCampaigns);

// 수정, 생성, 삭제는 관리자/인증 유저만 가능하도록 middleware 적용
router.post('/', requireAuth, createCampaign);
router.put('/:id', requireAuth, updateCampaign);
router.delete('/:id', requireAuth, deleteCampaign);

export default router;
