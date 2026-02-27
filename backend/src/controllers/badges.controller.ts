import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const getBadges = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        let query = supabase.from('badges').select('*').order('created_at', { ascending: false });

        if (user && user.role === 'brand') {
            if (!user.brand_id) return res.status(403).json({ error: '소속된 브랜드가 없습니다.' });
            query = query.eq('brand_id', user.brand_id);
        }

        const { data, error } = await query;
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching badges from Supabase:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createBadge = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const brand_id = user?.role === 'brand' ? user.brand_id : req.body.brand_id;

        if (!brand_id && user?.role === 'brand') {
            return res.status(403).json({ error: '소속된 브랜드가 없어 생성할 수 없습니다.' });
        }

        const { name, description, image_url, trigger_condition } = req.body;
        const { data, error } = await supabase
            .from('badges')
            .insert([{ brand_id, name, description, image_url, trigger_condition }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        console.error('Error creating badge:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateBadge = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = (req as any).user;
        const updates = req.body;

        if (user?.role === 'brand') {
            const { data: b } = await supabase.from('badges').select('brand_id').eq('id', id).single();
            if (!b || b.brand_id !== user.brand_id) {
                return res.status(403).json({ error: '권한이 없습니다.' });
            }
        }

        const { data, error } = await supabase
            .from('badges')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        console.error('Error updating badge:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteBadge = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = (req as any).user;

        if (user?.role === 'brand') {
            const { data: b } = await supabase.from('badges').select('brand_id').eq('id', id).single();
            if (!b || b.brand_id !== user.brand_id) {
                return res.status(403).json({ error: '권한이 없습니다.' });
            }
        }

        const { error } = await supabase
            .from('badges')
            .delete()
            .eq('id', id);

        if (error) throw error;
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting badge:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
