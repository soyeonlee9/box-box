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

import { Resend } from 'resend';

export const testEmail = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const targetEmail = req.body.email || user?.email;

        if (!targetEmail) {
            return res.status(400).json({ error: '이메일 주소를 찾을 수 없습니다.' });
        }

        const resendKey = process.env.RESEND_API_KEY;

        if (!resendKey) {
            return res.status(400).json({
                error: 'Resend API 키가 설정되지 않았습니다.',
                details: '서버의 .env 파일에 RESEND_API_KEY 를 설정해주세요.'
            });
        }

        const resend = new Resend(resendKey);

        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            // Resend 테스트 모드에서는 가입된 소유자 이메일로만 발송 가능합니다.
            to: 'soyeon96120@gmail.com',
            subject: '🔔 아키타이프(Archetype) 테스트 알림 이메일',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">안녕하세요, ${user?.name || '고객'}님!</h2>
                    <p>요청하신 <strong>이메일 알림 테스트</strong>가 성공적으로 발송되었습니다.</p>
                    <p>앞으로 목표 달성, 리워드 발급 등의 중요 알림이 이 메일 주소로 전송됩니다.</p>
                    <hr style="border: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #999;">본 메일은 발신 전용이며, 아키타이프 대시보드 테스트 발송 기능에 의해 전송되었습니다.</p>
                </div>
            `
        });

        if (error) {
            console.error('Resend error:', error);
            return res.status(400).json({ error: '이메일 발송에 실패했습니다.', details: error });
        }

        res.status(200).json({
            message: '테스트 이메일이 성공적으로 발송되었습니다.',
            data
        });

    } catch (error: any) {
        console.error('Error sending Resend email:', error.message);
        res.status(500).json({
            error: '이메일 발송 중 서버 오류가 발생했습니다.',
            details: error.message
        });
    }
};

export const getNotifications = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { data, error } = await supabase
            .from('notification_logs')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateNotificationSettings = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        const preferences = req.body.preferences;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { data, error } = await supabase
            .from('users')
            .update({ notification_preferences: preferences })
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;

        res.status(200).json({ message: '설정이 저장되었습니다.', preferences: data.notification_preferences });
    } catch (error) {
        console.error('Error updating notification settings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
