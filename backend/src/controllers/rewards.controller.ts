import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const getRewards = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        let query = supabase.from('rewards').select('*').order('created_at', { ascending: false });

        if (user && user.role === 'brand') {
            if (!user.brand_id) return res.status(403).json({ error: '소속된 브랜드가 없습니다.' });
            query = query.eq('brand_id', user.brand_id);
        }

        const { data, error } = await query;
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching rewards:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createReward = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const brand_id = user?.role === 'brand' ? user.brand_id : req.body.brand_id;

        if (!brand_id && user?.role === 'brand') {
            return res.status(403).json({ error: '소속된 브랜드가 없어 생성할 수 없습니다.' });
        }

        const { user_id, badge_id, title, description, code, expires_at } = req.body;
        const { data, error } = await supabase
            .from('rewards')
            .insert([{ brand_id, user_id, badge_id, title, description, code, expires_at }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        console.error('Error creating reward:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateReward = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = (req as any).user;
        const updates = req.body;

        if (user?.role === 'brand') {
            const { data: r } = await supabase.from('rewards').select('brand_id').eq('id', id).single();
            if (!r || r.brand_id !== user.brand_id) {
                return res.status(403).json({ error: '권한이 없습니다.' });
            }
        }

        const { data, error } = await supabase
            .from('rewards')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        console.error('Error updating reward:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteReward = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = (req as any).user;

        if (user?.role === 'brand') {
            const { data: r } = await supabase.from('rewards').select('brand_id').eq('id', id).single();
            if (!r || r.brand_id !== user.brand_id) {
                return res.status(403).json({ error: '권한이 없습니다.' });
            }
        }

        const { error } = await supabase
            .from('rewards')
            .delete()
            .eq('id', id);

        if (error) throw error;
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting reward:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const useReward = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = (req as any).user;

        const { data: reward, error: fetchError } = await supabase
            .from('rewards')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError || !reward) {
            return res.status(404).json({ error: '리워드를 찾을 수 없습니다.' });
        }

        // 브랜드인 경우 자기 소유 브랜드의 리워드인지 확인
        if (user?.role === 'brand' && reward.brand_id !== user.brand_id) {
            return res.status(403).json({ error: '권한이 없습니다.' });
        }

        if (reward.is_used) {
            return res.status(400).json({ error: '이미 사용된 리워드입니다.' });
        }

        const { data: updatedReward, error: updateError } = await supabase
            .from('rewards')
            .update({ is_used: true, used_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (updateError) throw updateError;
        res.status(200).json({ message: '리워드가 성공적으로 사용되었습니다.', reward: updatedReward });
    } catch (error) {
        console.error('Error using reward:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
