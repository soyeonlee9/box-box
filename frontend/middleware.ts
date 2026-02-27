import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 실제 서버사이드 JWT 검증이 이상적이지만,
  // 클라이언트(zustand/localStorage) 의존성이 있는 아키텍처이므로
  // 미들웨어에서는 단순 라우팅 통제를 약하게 하거나, 클라이언트 사이드 가드로 대체할 수 있습니다.
  // 여기서는 클라이언트 측 보호를 우선으로 하되 SSR 접근을 방지하는 기초 예시만 둡니다.
  return NextResponse.next()
}
