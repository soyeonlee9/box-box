import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

// Helper to check admin role
const isAdmin = (role: string) => role === 'super_admin' || role === 'admin';

export const getTeamMembers = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        if (!user || !user.brand_id) {
            return res.status(401).json({ error: '인증되지 않거나 브랜드에 속하지 않은 사용자입니다.' });
        }

        const { data: members, error } = await supabase
            .from('users')
            .select('id, name, email, role, created_at, avatar_url')
            .eq('brand_id', user.brand_id)
            .order('created_at', { ascending: true });

        if (error) throw error;

        // Map to standard format expected by frontend
        const mappedMembers = members.map(m => ({
            id: m.id,
            name: m.name || m.email.split('@')[0], // Default name if null
            email: m.email,
            role: m.role ? m.role.charAt(0).toUpperCase() + m.role.slice(1) : 'Viewer', // Capitalized
            lastAccess: new Date(m.created_at).toISOString().split('T')[0], // Using created_at as a fallback for lastAccess
            avatar: m.avatar_url || ''
        }));

        res.status(200).json(mappedMembers);
    } catch (error) {
        console.error('Error fetching team members:', error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
};

export const inviteTeamMember = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const { email, role } = req.body;

        if (!user || !user.brand_id) {
            return res.status(401).json({ error: 'Unauthorized.' });
        }

        if (!isAdmin(user.role)) {
            return res.status(403).json({ error: '관리자(Admin) 권한이 필요합니다.' });
        }

        if (!email || !role) {
            return res.status(400).json({ error: '이메일과 역할은 필수 항목입니다.' });
        }

        const lowercaseRole = typeof role === 'string' ? role.toLowerCase() : 'viewer';

        // Check if user already exists
        const { data: existingUser, error: searchError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (existingUser) {
            if (existingUser.brand_id && existingUser.brand_id !== user.brand_id) {
                return res.status(400).json({ error: '해당 이메일은 이미 다른 브랜드에 소속되어 있습니다.' });
            }
            if (existingUser.brand_id === user.brand_id) {
                return res.status(400).json({ error: '이미 팀에 소속된 멤버입니다.' });
            }

            // User exists but has no brand, so assign to this brand
            const { error: updateError } = await supabase
                .from('users')
                .update({ brand_id: user.brand_id, role: lowercaseRole })
                .eq('id', existingUser.id);
            if (updateError) throw updateError;
        } else {
            // User does not exist, create a placeholder via direct insert
            // Since auth_id is unique and required, we generate a random UUID for the placeholder. 
            // When they actually log in via Kakao, auth.controller.ts will match by email and overwrite the auth_id.
            // Note: need to make sure auth_id is generated uniquely
            const placeholderAuthId = crypto.randomUUID();

            const { error: insertError } = await supabase
                .from('users')
                .insert([{
                    auth_id: placeholderAuthId,
                    email,
                    provider: 'invited', // marks as a placeholder
                    role: lowercaseRole,
                    brand_id: user.brand_id
                }]);

            if (insertError) throw insertError;
        }

        res.status(200).json({ message: '멤버가 성공적으로 초대되었습니다.' });
    } catch (error) {
        console.error('Error inviting team member:', error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
};

export const updateTeamMemberRole = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const memberId = req.params.id;
        const { role } = req.body;

        if (!user || !user.brand_id) return res.status(401).json({ error: 'Unauthorized.' });
        if (!isAdmin(user.role)) return res.status(403).json({ error: '관리자 권한이 필요합니다.' });

        // Ensure target member belongs to the same brand
        const { data: targetMember } = await supabase.from('users').select('brand_id').eq('id', memberId).single();
        if (!targetMember || targetMember.brand_id !== user.brand_id) {
            return res.status(403).json({ error: '권한이 없습니다.' });
        }

        const lowercaseRole = typeof role === 'string' ? role.toLowerCase() : 'viewer';

        const { error: updateError } = await supabase
            .from('users')
            .update({ role: lowercaseRole })
            .eq('id', memberId);

        if (updateError) throw updateError;

        res.status(200).json({ message: '역할이 성공적으로 변경되었습니다.' });
    } catch (error) {
        console.error('Error updating team member role:', error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
};

export const removeTeamMember = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const memberId = req.params.id;

        if (!user || !user.brand_id) return res.status(401).json({ error: 'Unauthorized.' });
        if (!isAdmin(user.role)) return res.status(403).json({ error: '관리자 권한이 필요합니다.' });

        if (user.id === memberId) {
            return res.status(400).json({ error: '자기 자신을 삭제할 수 없습니다.' });
        }

        const { data: targetMember } = await supabase.from('users').select('brand_id, provider').eq('id', memberId).single();
        if (!targetMember || targetMember.brand_id !== user.brand_id) {
            return res.status(403).json({ error: '권한이 없습니다.' });
        }

        if (targetMember.provider === 'invited') {
            // If they are just a placeholder and haven't logged in, we can completely delete them to keep it clean.
            const { error: deleteError } = await supabase.from('users').delete().eq('id', memberId);
            if (deleteError) throw deleteError;
        } else {
            // If they are a real user, just strip them of the brand association.
            const { error: updateError } = await supabase
                .from('users')
                .update({ brand_id: null, role: 'brand' }) // Reset to default role and remove from brand
                .eq('id', memberId);
            if (updateError) throw updateError;
        }

        res.status(200).json({ message: '멤버가 팀에서 제외되었습니다.' });
    } catch (error) {
        console.error('Error removing team member:', error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
};
