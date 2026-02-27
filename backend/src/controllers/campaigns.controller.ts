import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const getCampaigns = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        let query = supabase.from('campaigns').select('*').order('created_at', { ascending: false });

        if (user && user.role === 'brand') {
            if (!user.brand_id) return res.status(403).json({ error: '소속된 브랜드가 없습니다.' });
            query = query.eq('brand_id', user.brand_id);
        }

        const { data: campaigns, error } = await query;

        if (error) throw error;

        // DB 컬럼을 프론트엔드가 기대하는 형태로 매핑
        const formattedCampaigns = campaigns.map((c: any) => ({
            id: c.id,
            name: c.name,
            url: c.url,
            urlB: c.url_b,
            active: c.is_active,
            scans: 0,
            conversions: 0,
            conversionRate: 0,
            roi: 0,
            abTest: c.is_ab_test,
            createdAt: c.created_at ? c.created_at.split('T')[0] : '2026-01-01',
            cpa: c.original_cpa || 0,
            topRegions: []
        }));

        res.status(200).json(formattedCampaigns);
    } catch (error) {
        console.error('Error fetching campaigns from Supabase:', error);
        res.status(500).json({ error: 'Internal server error fetching campaigns' });
    }
};

export const createCampaign = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const reqBrandId = req.body.brand_id;
        const brand_id = user?.role === 'brand' ? user.brand_id : reqBrandId;

        if (!brand_id && user?.role === 'brand') {
            return res.status(403).json({ error: '소속된 브랜드가 없어 캠페인을 생성할 수 없습니다.' });
        }

        const { name, url, url_b, is_active, is_ab_test, original_cpa } = req.body;
        const { data, error } = await supabase
            .from('campaigns')
            .insert([{ brand_id, name, url, url_b, is_active, is_ab_test, original_cpa }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        console.error('Error creating campaign:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateCampaign = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = (req as any).user;
        const updates = req.body;

        // 권한 체크: brand일 경우 본인 브랜드의 캠페인인지 확인
        if (user?.role === 'brand') {
            const { data: camp } = await supabase.from('campaigns').select('brand_id').eq('id', id).single();
            if (!camp || camp.brand_id !== user.brand_id) {
                return res.status(403).json({ error: '권한이 없습니다.' });
            }
        }

        const { data, error } = await supabase
            .from('campaigns')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        console.error('Error updating campaign:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteCampaign = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = (req as any).user;

        // 권한 체크
        if (user?.role === 'brand') {
            const { data: camp } = await supabase.from('campaigns').select('brand_id').eq('id', id).single();
            if (!camp || camp.brand_id !== user.brand_id) {
                return res.status(403).json({ error: '권한이 없습니다.' });
            }
        }

        const { error } = await supabase
            .from('campaigns')
            .delete()
            .eq('id', id);

        if (error) throw error;
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting campaign:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
