import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: '인증 토큰이 제공되지 않았습니다.' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const secret = process.env.JWT_SECRET || '';
        const decoded = jwt.verify(token, secret) as any;

        // Impersonation 로직: 슈퍼 관리자만 X-Brand-Id 헤더를 통해 권한을 위임받아 타겟 브랜드 데이터에 접근 가능
        const requestedBrandId = req.headers['x-brand-id'];
        if (decoded.role === 'super_admin') {
            decoded.original_role = 'super_admin'; // 원래 권한은 보존 (관리자 라우트용)
            if (requestedBrandId) {
                decoded.brand_id = requestedBrandId;
            }
            decoded.role = 'brand'; // 컨트롤러에서 brand_id 필터링이 정상 동작하도록 권한을 항상 강등
        }

        (req as any).user = decoded; // 요청 객체에 유저 정보(id, email, name, role, brand_id) 저장
        next();
    } catch (err) {
        return res.status(401).json({ error: '유효하지 않은 토큰입니다.' });
    }
};

export const requireSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
    // 먼저 requireAuth가 실행되었다고 가정
    const user = (req as any).user;
    if (!user || (user.role !== 'super_admin' && user.original_role !== 'super_admin')) {
        return res.status(403).json({ error: '최고 관리자 권한이 필요합니다.' });
    }
    next();
};
