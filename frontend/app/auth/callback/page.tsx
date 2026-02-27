"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthCallbackPage() {
    const router = useRouter();
    const { setAuth, isLoggingInAsSuperAdmin, setIsLoggingInAsSuperAdmin } = useAuthStore();
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        const handleAuthCallback = async () => {
            // 1. URL의 해시에 포함된 토큰이나 코드를 Supabase 세션으로 교환
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

            if (sessionError || !session) {
                console.error("Session error:", sessionError);
                setErrorMsg("로그인 세션을 가져올 수 없습니다.");
                setTimeout(() => router.push("/login"), 3000);
                return;
            }

            const supabaseUser = session.user;

            // 2. 백엔드로 유저 정보 전송 및 자체 JWT 획득
            try {
                const payload = {
                    provider: supabaseUser.app_metadata.provider || 'social',
                    providerId: supabaseUser.id,
                    email: supabaseUser.email || '',
                    name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || 'User',
                    avatar_url: supabaseUser.user_metadata?.avatar_url || ''
                };

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/social`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                if (!res.ok) {
                    throw new Error("Failed to authenticate with backend");
                }

                const data = await res.json();

                // 3. Zustand 스토어에 유저 정보와 JWT 저장
                setAuth(data.user, data.token);

                // 4. 권한에 따른 대시보드 리다이렉트
                if (data.user?.role === 'super_admin' && isLoggingInAsSuperAdmin) {
                    router.push("/superadmin/brands");
                } else {
                    router.push("/");
                }

                // 로그인 진행 플래그 초기화
                setIsLoggingInAsSuperAdmin(false);
            } catch (err: any) {
                console.error("Backend auth error:", err);
                setErrorMsg("백엔드 인증 중 오류가 발생했습니다.");
                setTimeout(() => router.push("/login"), 3000);
            }
        };

        handleAuthCallback();
    }, [router, setAuth]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 flex-col gap-4">
            {errorMsg ? (
                <div className="text-red-500 font-medium">{errorMsg}</div>
            ) : (
                <>
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2D6A4F] border-t-transparent"></div>
                    <p className="text-gray-500 font-medium">로그인 정보를 처리 중입니다...</p>
                </>
            )}
        </div>
    );
}
