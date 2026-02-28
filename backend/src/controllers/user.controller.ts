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

import axios from 'axios';

export const testEmail = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const targetEmail = req.body.email || user?.email;

        if (!targetEmail) {
            return res.status(400).json({ error: '이메일 주소를 찾을 수 없습니다.' });
        }

        const stibeeKey = process.env.STIBEE_API_KEY;
        const stibeeEndpoint = process.env.STIBEE_AUTO_EMAIL_ENDPOINT;

        if (!stibeeKey || !stibeeEndpoint) {
            return res.status(400).json({
                error: 'Stibee 연동이 설정되지 않았습니다.',
                details: '서버의 .env 파일에 STIBEE_API_KEY 와 STIBEE_AUTO_EMAIL_ENDPOINT 를 설정해주세요.'
            });
        }

        // Stibee 자동 이메일 발송 API 호출
        // 구독자(subscriber) 항목에 이메일을 넣어 발송
        const response = await axios.post(
            stibeeEndpoint,
            {
                subscribers: [
                    {
                        email: targetEmail,
                        name: user?.name || '고객님'
                    }
                ]
            },
            {
                headers: {
                    'AccessToken': stibeeKey,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.status(200).json({
            message: '테스트 이메일이 발송되었습니다.',
            stibeeResponse: response.data
        });

    } catch (error: any) {
        console.error('Error sending Stibee email:', error?.response?.data || error.message);
        res.status(500).json({
            error: '이메일 발송 중 오류가 발생했습니다.',
            details: error?.response?.data || error.message
        });
    }
};
