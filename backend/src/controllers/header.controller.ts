import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

const initialConversations = [
    {
        id: 1, name: "김서연", avatar: "SY", lastMessage: "캠페인 A/B 테스트 결과 보셨나요?", time: "10분 전", unread: true,
        messages: [{ id: 1, sender: "other", text: "캠페인 A/B 테스트 결과 보셨나요?", time: "오전 10:30" }]
    }
];

const initialNotifications = [
    { id: 1, text: "새로운 알림 시스템이 연동되었습니다.", time: "방금 전", type: "info" }
];

const searchResults = [
    { label: "Spring 24 캠페인", href: "/campaigns", type: "캠페인" }
];

export const getHeaderData = async (req: Request, res: Response) => {
    try {
        // 실제로는 users 테이블이나 notifications 테이블을 쿼리해야 하나, 
        // 요구사항에 맞춰 임시 데이터 구조와 Supabase 기본 쿼리 형태를 결합합니다.
        // 예시로 첫번째 유저를 조회해봅니다.
        const { data: users, error } = await supabase.from('users').select('*').limit(1);

        const userName = users && users.length > 0 ? users[0].name : "사용자";

        // 임시 더미 데이터 반환 (실제 프론트엔드 연동을 터뜨리지 않기 위함)
        res.status(200).json({
            conversations: initialConversations,
            notifications: [
                ...initialNotifications,
                { id: 2, text: `${userName}님, 환영합니다!`, time: "1분 전", type: "success" }
            ],
            searchResults
        });
    } catch (error) {
        console.error('Error fetching header data from Supabase:', error);
        res.status(500).json({ error: 'Internal server error fetching header data' });
    }
};
