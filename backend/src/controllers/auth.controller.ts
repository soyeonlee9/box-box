import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import jwt from 'jsonwebtoken';

/**
 * 프론트엔드에서 소셜 로그인(구글/카카오) 성공 후 받아온 유저 정보를 우리 DB에 싱크하고 JWT를 발급합니다.
 * 예상 body: { provider: 'kakao'|'google', providerId: '...', email: '...', name: '...', avatar_url: '...' }
 */
export const socialLogin = async (req: Request, res: Response) => {
    try {
        const { provider, providerId, email, name, avatar_url } = req.body;

        if (!provider || !providerId || !email) {
            return res.status(400).json({ error: '필수 인증 정보가 누락되었습니다.' });
        }

        // 1. 기존 유저 존재 여부 확인 (auth_id 혹은 email)
        const { data: existingUser, error: selectError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        let userId: string;
        let userRole: string = 'brand';
        let userBrandId: string | null = null;

        if (existingUser) {
            // 이미 가입된 유저 -> 정보 업데이트
            const { data: updatedUser, error: updateError } = await supabase
                .from('users')
                .update({ provider, auth_id: providerId, name, avatar_url })
                .eq('id', existingUser.id)
                .select()
                .single();

            if (updateError) throw updateError;
            userId = updatedUser.id;
            userRole = updatedUser.role || 'brand';
            userBrandId = updatedUser.brand_id;
        } else {
            // 신규 유저 생성
            const { data: newUser, error: insertError } = await supabase
                .from('users')
                .insert([{ provider, auth_id: providerId, email, name, avatar_url }])
                .select()
                .single();

            if (insertError) throw insertError;
            userId = newUser.id;
            userRole = newUser.role || 'brand';
            userBrandId = newUser.brand_id;
        }

        // 2. JWT 토큰 발급
        const secret = process.env.JWT_SECRET || '';
        const token = jwt.sign({ id: userId, email, name, role: userRole, brand_id: userBrandId }, secret, {
            expiresIn: '7d' // 7일 유효
        });

        res.json({
            message: '로그인 성공',
            token,
            user: { id: userId, email, name, avatar_url, role: userRole, brand_id: userBrandId }
        });

    } catch (error: any) {
        console.error('Login error:', error);
        res.status(500).json({ error: '로그인 처리 중 서버 오류가 발생했습니다.' });
    }
};
