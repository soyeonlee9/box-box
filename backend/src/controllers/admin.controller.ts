import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

// 모든 브랜드 가져오기 (슈퍼 관리자용)
export const getBrands = async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('brands')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        // 추가적으로 각 브랜드별 통계(캠페인 수 등)를 결합할 수도 있음
        // 여기서는 가장 단순한 형태로 브랜드 목록만 반환
        console.log("getBrands SUCCESS, returning items:", data?.length);
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching brands:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// 새로운 브랜드 등록 (슈퍼 관리자가 승인)
export const createBrand = async (req: Request, res: Response) => {
    try {
        const { name, manager_email, metadata } = req.body;
        const { data, error } = await supabase
            .from('brands')
            .insert([{ name, manager_email, metadata }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        console.error('Error creating brand:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// 브랜드 정보 수정
export const updateBrand = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const { data, error } = await supabase
            .from('brands')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        console.error('Error updating brand:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// 브랜드 삭제
export const deleteBrand = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { error } = await supabase
            .from('brands')
            .delete()
            .eq('id', id);

        if (error) throw error;
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting brand:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
