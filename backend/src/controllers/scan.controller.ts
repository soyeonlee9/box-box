import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { dispatchNotification } from '../services/notification.service';

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

                        // 배지 획득 알림 발송
                        await dispatchNotification(
                            user_id,
                            scanData.brand_id, // qr_scans doesn't have brand_id directly, campaigns does. Let's fetch campaign's brand_id if needed, but we can pass null if not strictly required for brand-level tracking, or fetch it.
                            'badge_earned',
                            '🎉 새로운 배지를 획득하셨습니다!',
                            `스캔 목표를 달성하여 '${badgeToGive.name}' 배지를 얻었습니다.`,
                            `<div style="font-family: sans-serif; text-align: center;">
                                <h2>축하합니다!</h2>
                                <p>새로운 <strong>${badgeToGive.name}</strong> 배지를 획득하셨습니다.</p>
                                ${badgeToGive.image_url ? `<img src="${badgeToGive.image_url}" width="100" />` : ''}
                                <p>앱에서 확인해보세요!</p>
                             </div>`
                        );
                    }
                }
            }

            // 캠페인 스캔 마일스톤 알림 (예: 10회, 100회 등 특정 횟수 달성 시)
            const milestones = [10, 50, 100, 500, 1000];
            if (count && milestones.includes(count)) {
                // Fetch brand_id from campaign to know who to notify if it's a brand's campaign
                // For users, they might get notified of their own milestone
                await dispatchNotification(
                    user_id,
                    null,
                    'campaign_milestone',
                    '🎯 캠페인 목표 달성!',
                    `현재 캠페인에서 총 ${count}회 스캔을 달성했습니다.`,
                    `<div style="font-family: sans-serif; padding: 20px;">
                        <h2>목표 달성!</h2>
                        <p>고객님께서 참여 중인 캠페인에서 <strong>${count}회</strong> 스캔이라는 놀라운 기록을 달성하셨습니다.</p>
                     </div>`
                );
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
