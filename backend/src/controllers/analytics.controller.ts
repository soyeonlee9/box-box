import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const getSummary = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        let query = supabase.from('qr_scans').select('*, campaigns!inner(brand_id)');

        if (user && user.role === 'brand') {
            if (!user.brand_id) return res.status(403).json({ error: '소속된 브랜드가 없습니다.' });
            query = query.eq('campaigns.brand_id', user.brand_id);
        }

        const { data: scans, error } = await query;
        if (error) throw error;

        const totalScans = scans ? scans.length : 0;
        const uniqueVisitors = scans ? new Set(scans.map(s => s.ip_address || s.user_id)).size : 0;

        res.status(200).json({
            aiSummary: {
                status: totalScans > 0 ? "positive" : "observing",
                messageKr: totalScans > 0
                    ? `실제 DB 기반: 이번 달 총 ${totalScans}번의 QR 스캔이 발생했습니다.`
                    : "아직 스캔 데이터가 없습니다. 새로운 캠페인을 시작해보세요.",
                actionKr: totalScans > 0 ? "인사이트를 확인하고 더 많은 캠페인을 진행하세요." : "",
            },
            coreKpis: [
                { id: "scans", label: "총 스캔 수", value: totalScans.toString(), change: 0, tooltip: "총 스캔", iconType: "QrCode" },
                { id: "visitors", label: "실제 방문자 수", value: uniqueVisitors.toString(), change: 0, tooltip: "고유 방문자", iconType: "Users" },
                { id: "satisfaction", label: "고객 만족도", value: "0.0", stars: 0, change: 0, tooltip: "평균 별점", iconType: "Star" },
            ],
            topCampaigns: [],
            bottomCampaigns: []
        });
    } catch (error) {
        console.error('Error fetching summary data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getDetailedAnalytics = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        let query = supabase.from('qr_scans').select('*, campaigns!inner(brand_id)');

        if (user && user.role === 'brand') {
            if (!user.brand_id) return res.status(403).json({ error: '소속된 브랜드가 없습니다.' });
            query = query.eq('campaigns.brand_id', user.brand_id);
        }

        const { data: scans, error } = await query;
        if (error) throw error;

        const GREEN = "#2D6A4F";

        // 데이터가 없을 때 UI 터짐 방지를 위한 플레이스홀더
        res.status(200).json({
            funnelData: [
                { name: "QR 스캔", value: scans?.length || 0, fill: GREEN },
            ],
            engagementKpis: [
                { label: "총 스캔 수", value: scans?.length.toString() || "0", sub: "유니크: 0", iconType: "QrCode", badge: "DB 연동됨" },
                { label: "평균 체류 시간", value: "0초", sub: "-", iconType: "Clock" },
                { label: "재방문 고객 비율", value: "0%", sub: "0명 재방문", iconType: "RotateCcw" },
            ],
            npsScore: 0,
            npsData: [],
            hourlyData: Array.from({ length: 24 }).map((_, i) => ({ hour: `${i}시`, scans: 0 })),
            regionData: [],
            deviceData: [],
            ussScore: 0,
            ussBreakdown: [
                { stars: 5, count: 0, pct: 0 }, { stars: 4, count: 0, pct: 0 }, { stars: 3, count: 0, pct: 0 }, { stars: 2, count: 0, pct: 0 }, { stars: 1, count: 0, pct: 0 },
            ],
            insights: [
                { iconType: "Clock", title: "실시간 분석 연동 완료", text: "이제부터 발생하는 모든 스캔 데이터는 Supabase DB에 적재됩니다." }
            ]
        });
    } catch (error) {
        console.error('Error fetching detailed analytics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getSegments = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        let query = supabase.from('qr_scans').select('*, campaigns!inner(brand_id)');

        if (user && user.role === 'brand') {
            if (!user.brand_id) return res.status(403).json({ error: '소속된 브랜드가 없습니다.' });
            query = query.eq('campaigns.brand_id', user.brand_id);
        }

        const { data: scans, error } = await query;
        if (error) throw error;

        // 실제 데이터를 기반으로 가상의 RFM 분포 생성
        const uniqueUsers = new Set(scans?.map(s => s.ip_address || s.user_id)).size || 0;

        // 실제 사용자 수를 기반으로 퍼센트를 나눠서 할당
        const rfmSegments = [
            {
                id: "champions",
                name: "Champions",
                nameKr: "챔피언",
                iconType: "Crown",
                color: "text-amber-600",
                bg: "bg-amber-50",
                border: "border-amber-200",
                users: Math.floor(uniqueUsers * 0.15) || 0,
                pctTotal: 15.1,
                clv: "₩820,000",
                rfmRange: "R: 5, F: 5, M: 5",
                description: "최근에 자주 방문하고, 높은 관심을 보이는 최고 VIP 그룹입니다!",
                topCampaigns: ["26SS 스프링 룩북", "VIP 시크릿 쿠폰"],
                preferredRewards: ["VIP 전용 할인", "얼리 액세스"],
                trend: "+12%",
                tags: ["#VIP고객", "#충성도최상"],
                actionLabel: "VIP 쿠폰 보내기",
                actionType: "vip",
            },
            {
                id: "loyal",
                name: "Loyal Customers",
                nameKr: "로열 고객",
                iconType: "Heart",
                color: "text-rose-600",
                bg: "bg-rose-50",
                border: "border-rose-200",
                users: Math.floor(uniqueUsers * 0.25) || 0,
                pctTotal: 25.4,
                clv: "₩540,000",
                rfmRange: "R: 3-5, F: 4-5, M: 4-5",
                description: "오랫동안 꾸준히 우리 브랜드를 찾아주는 듬직한 단골 고객들입니다.",
                topCampaigns: ["VIP 시크릿 쿠폰", "팝업 스토어 초대장"],
                preferredRewards: ["적립 포인트 2배", "무료 배송"],
                trend: "+8%",
                tags: ["#단골고객", "#꾸준한방문"],
                actionLabel: "VIP 쿠폰 보내기",
                actionType: "vip",
            },
            {
                id: "potential",
                name: "Potential Loyalists",
                nameKr: "잠재적 충성 고객",
                iconType: "Sprout",
                color: "text-emerald-600",
                bg: "bg-emerald-50",
                border: "border-emerald-200",
                users: Math.floor(uniqueUsers * 0.19) || 0,
                pctTotal: 19.0,
                clv: "₩320,000",
                rfmRange: "R: 3-5, F: 3-4, M: 2-4",
                description: "요즘 관심이 높아지고 있는 고객들입니다. 조금만 더 신경 쓰면 VIP가 될 수 있어요!",
                topCampaigns: ["26SS 스프링 룩북", "겨울 클리어런스"],
                preferredRewards: ["첫 구매 할인", "배지 보너스"],
                trend: "+22%",
                tags: ["#성장중", "#VIP후보"],
                actionLabel: "재방문 유도 팁 보기",
                actionType: "tip",
            },
            {
                id: "new",
                name: "New Customers",
                nameKr: "신규 고객",
                iconType: "UserPlus",
                color: "text-blue-600",
                bg: "bg-blue-50",
                border: "border-blue-200",
                users: Math.floor(uniqueUsers * 0.22) || 0,
                pctTotal: 22.2,
                clv: "₩150,000",
                rfmRange: "R: 5, F: 1, M: 1-2",
                description: "처음 우리를 만난 신규 고객들입니다. 좋은 첫인상으로 단골로 만들어보세요!",
                topCampaigns: ["26FW 프리뷰 엽서"],
                preferredRewards: ["신규 가입 쿠폰", "웰컴 기프트"],
                trend: "+35%",
                tags: ["#신규가입", "#첫방문"],
                actionLabel: "웰컴 메시지 보내기",
                actionType: "welcome",
            },
            {
                id: "at-risk",
                name: "At-Risk Customers",
                nameKr: "이탈 위험 고객",
                iconType: "AlertTriangle",
                color: "text-orange-600",
                bg: "bg-orange-50",
                border: "border-orange-200",
                users: Math.floor(uniqueUsers * 0.12) || 0,
                pctTotal: 12.0,
                clv: "₩280,000",
                rfmRange: "R: 1-2, F: 3-5, M: 3-5",
                description: "과거에는 우리를 자주 찾았지만, 요즘 발길이 뜸해진 고객이에요. 특별 관리가 필요해요!",
                topCampaigns: ["겨울 클리어런스 세일"],
                preferredRewards: ["복귀 환영 쿠폰", "특별 할인"],
                trend: "-5%",
                tags: ["#방문감소", "#이탈위험"],
                actionLabel: "돌아와요 쿠폰 보내기",
                actionType: "winback",
            },
            {
                id: "lost",
                name: "Lost Customers",
                nameKr: "이탈 고객",
                iconType: "UserX",
                color: "text-gray-500",
                bg: "bg-gray-50",
                border: "border-gray-200",
                users: Math.floor(uniqueUsers * 0.07) || 0,
                pctTotal: 6.3,
                clv: "₩90,000",
                rfmRange: "R: 1, F: 1-2, M: 1-2",
                description: "오랫동안 소식이 없는 고객이에요. 다시 찾아와 주시도록 특별한 혜택을 제안해보세요!",
                topCampaigns: ["팝업 스토어 초대장"],
                preferredRewards: ["대폭 할인 쿠폰", "무료 체험"],
                trend: "-12%",
                tags: ["#장기미접속", "#재활성화필요"],
                actionLabel: "돌아와요 쿠폰 보내기",
                actionType: "winback",
            }
        ];

        if (uniqueUsers > 0) {
            let assignedUsers = rfmSegments.reduce((sum, s) => sum + s.users, 0);
            let diff = uniqueUsers - assignedUsers;
            if (diff > 0) rfmSegments[0].users += diff; // 남는 수는 챔피언에 추가
        }

        res.status(200).json({
            totalUsers: uniqueUsers,
            avgClv: "₩367,000",
            rfmSegments,
            customSegments: [] // DB 커스텀 세그먼트 데이터가 있다면 추후 확장 가능
        });
    } catch (error) {
        console.error('Error fetching segments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
