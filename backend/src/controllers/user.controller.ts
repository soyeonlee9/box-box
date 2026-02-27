import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import jwt from 'jsonwebtoken';

export const createUserBrand = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user; // from requireAuth middleware
        const { name, manager_email } = req.body;

        if (!user) {
            return res.status(401).json({ error: '인증이 필요합니다.' });
        }

        if (!name) {
            return res.status(400).json({ error: '브랜드 이름은 필수입니다.' });
        }

        // 1. Create a new brand
        const { data: brandData, error: brandError } = await supabase
            .from('brands')
            .insert([{ name, manager_email: manager_email || user.email }])
            .select()
            .single();

        if (brandError) throw brandError;

        // 2. Update user to point to this new brand
        const { error: userUpdateError } = await supabase
            .from('users')
            .update({ brand_id: brandData.id })
            .eq('id', user.id);

        if (userUpdateError) throw userUpdateError;

        // 3. Issue a new JWT token with the updated brand_id
        const secret = process.env.JWT_SECRET || '';
        const newToken = jwt.sign(
            { id: user.id, email: user.email, name: user.name, role: user.role, brand_id: brandData.id },
            secret,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: '브랜드가 성공적으로 생성되었습니다.',
            brand: brandData,
            token: newToken
        });
    } catch (error) {
        console.error('Error creating user brand:', error);
        res.status(500).json({ error: 'Internal server error while creating brand' });
    }
};
