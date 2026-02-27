import { useAuthStore } from "@/store/useAuthStore";

/**
 * 전역 인증 상태를 포함하여 API 요청을 보내는 래퍼 유틸리티입니다.
 * JWT 토큰이 있으면 자동으로 Authorization 헤더에 추가합니다.
 */
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const state = useAuthStore.getState();
    const token = state.token;
    const selectedBrandId = state.selectedBrandId;

    const headers = new Headers(options.headers || {});
    headers.set("Content-Type", "application/json");

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    // Impersonation: 슈퍼 관리자가 선택한 브랜드가 있다면 헤더에 추가
    // 단, 최고 관리자 전용 관리 라우트(/admin/*) 호출 시에는 강등되지 않도록 헤더를 제외합니다.
    if (selectedBrandId && !endpoint.startsWith("/admin/")) {
        headers.set("X-Brand-Id", selectedBrandId);
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
    const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const response = await fetch(url, {
        cache: "no-store",
        ...options,
        headers,
    });

    if (response.status === 401) {
        // 토큰 만료 또는 유효하지 않은 경우 로그아웃 처리
        useAuthStore.getState().logout();
        if (typeof window !== "undefined") {
            window.location.href = "/login";
        }
        throw new Error("인증이 필요합니다. 다시 로그인해주세요.");
    }

    // 데이터 반환이 필요 없는 204 No Content 처리
    if (response.status === 204) {
        return null;
    }

    return response.json();
}
