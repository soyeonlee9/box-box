import cron from 'node-cron';
import { supabase } from '../config/supabase';
import { dispatchNotification } from '../services/notification.service';

/**
 * Weekly Summary Report Schedule
 * Runs every Monday at 9:00 AM (0 9 * * 1)
 */
export const startWeeklyReportCron = () => {
    cron.schedule('0 9 * * 1', async () => {
        console.log('[CRON] Starting Weekly Summary Report Job...');
        try {
            // 1. Fetch all users who have the weekly_report preference enabled
            const { data: users, error: userError } = await supabase
                .from('users')
                .select('id, email, name, brand_id, notification_preferences');

            if (userError) throw userError;

            // Get date limits for the previous week
            const now = new Date();
            const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

            for (const user of users) {
                const prefs = user.notification_preferences || { weekly_report: true, email: true };

                if (prefs.weekly_report && user.email) {
                    let totalScans = 0;

                    // Fetch campaigns for this user's brand
                    if (user.brand_id) {
                        const { data: campaigns } = await supabase
                            .from('campaigns')
                            .select('id')
                            .eq('brand_id', user.brand_id);

                        if (campaigns && campaigns.length > 0) {
                            const campaignIds = campaigns.map(c => c.id);
                            const { count } = await supabase
                                .from('qr_scans')
                                .select('*', { count: 'exact', head: true })
                                .in('campaign_id', campaignIds)
                                .gte('scanned_at', oneWeekAgo.toISOString())
                                .lte('scanned_at', now.toISOString());

                            totalScans = count || 0;
                        }
                    }

                    const htmlContent = `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                            <h2>안녕하세요, ${user.name || '고객'}님!</h2>
                            <p>지난주 아키타이프(Archetype) 주간 성과 요약 리포트입니다.</p>
                            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                <h3 style="margin-top: 0; color: #555;">📊 지난주 QR 스캔 수</h3>
                                <p style="font-size: 24px; font-weight: bold; margin: 0; color: #2E8B57;">${totalScans}회</p>
                            </div>
                            <p>대시보드에 접속하여 더 자세한 고객 행동 분석 데이터를 확인해 보세요.</p>
                            <a href="https://archetypestandard.com/login" style="display: inline-block; padding: 10px 20px; background-color: #2E8B57; color: white; text-decoration: none; border-radius: 4px;">대시보드 바로가기</a>
                        </div>
                    `;

                    await dispatchNotification(
                        user.id,
                        user.brand_id,
                        'weekly_report',
                        '📊 아키타이프 주간 성과 요약 리포트 도착',
                        `지난 한 주 동안 모인 고객의 스캔 데이터를 확인하세요. 총 스캔수: ${totalScans}회!`,
                        htmlContent
                    );
                }
            }
            console.log('[CRON] Weekly Summary Report Job Completed');
        } catch (error) {
            console.error('[CRON] Error during weekly report execution:', error);
        }
    }, {
        timezone: "Asia/Seoul"
    });
};
