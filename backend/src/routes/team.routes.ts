import { Router } from 'express';
import { getTeamMembers, inviteTeamMember, updateTeamMemberRole, removeTeamMember } from '../controllers/team.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

// Define routes
router.get('/', requireAuth, getTeamMembers);
router.post('/invite', requireAuth, inviteTeamMember);
router.patch('/:id/role', requireAuth, updateTeamMemberRole);
router.delete('/:id', requireAuth, removeTeamMember);

export default router;
