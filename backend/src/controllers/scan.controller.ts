import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

/**
 * QR 스캔 처리 로직
 * 1. qr_scans 테이블에 스캔 내역 INSERT
 * 2. 해당 유저가 존재할 경우, 배지 획득 조건을 체크하여 user_badges 기록
 */
export const recordScan = async (req: Request, res: Response) => {
    try {
        const { campaign_id, user_id, location, device_type, ip_address, metadata } = req.body;

        if (!campaign_id) {
            return res.status(400).json({ error: '캠페인 ID가 필요합니다.' });
        }

        // 1. 스캔 기록 추가
        const { data: scanData, error: scanError } = await supabase
            .from('qr_scans')
            .insert([{ campaign_id, user_id, location, device_type, ip_address, metadata }])
            .select()
            .single();

        if (scanError) throw scanError;

        let badgeEarned = false;
        let earnedBadgeDetails = null;

        // 2. 비회원이 아닐 경우 배지 획득 로직 트리거
        if (user_id) {
            // 이번 스캔을 포함한 유저의 이 캠페인 누적 스캔 횟수 조회
            const { count } = await supabase
                .from('qr_scans')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user_id)
                .eq('campaign_id', campaign_id);

            // 해당 캠페인 스캔 수에 따른 조건 배지가 있는지 조회 (단순화: metadata 룰 예시)
            // 실제 구현에서는 trigger_condition 필드를 JSON 형태로 파싱하여 룰을 검사해야 함
            // 여기서는 임시로 특정 스캔 횟수에 도달하면 시스템상 존재하는 아무 배지나 하나 지급하는 방식(예시)
            if (count && count >= 1) {
                // 이미 가지고 있지 않은 배지 중 하나를 찾아서 수여
                const { data: existingUserBadges } = await supabase
                    .from('user_badges')
                    .select('badge_id')
                    .eq('user_id', user_id);

                const existingBadgeIds = existingUserBadges?.map(b => b.badge_id) || [];

                const query = supabase
                    .from('badges')
                    .select('*')
                    .limit(1);

                if (existingBadgeIds.length > 0) {
                    // query.not('id', 'in', `(${existingBadgeIds.join(',')})`); // supabase 필터 형식
                }

                const { data: availableBadges } = await query;

                if (availableBadges && availableBadges.length > 0) {
                    const badgeToGive = availableBadges[0];

                    // user_badges 에 중복 획득 시 에러 무시를 위해 upsert 또는 사전 검사
                    const { error: badgeError } = await supabase
                        .from('user_badges')
                        .insert([{ user_id, badge_id: badgeToGive.id }]);

                    if (!badgeError) {
                        badgeEarned = true;
                        earnedBadgeDetails = badgeToGive;
                    }
                }
            }
        }

        res.status(201).json({
            message: '스캔 기록 완료',
            scanData,
            badgeEarned,
            earnedBadgeDetails
        });

    } catch (error) {
        console.error('Error recording scan:', error);
        res.status(500).json({ error: 'Internal server error while recording scan' });
    }
};
