"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Github } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const { user, setIsLoggingInAsSuperAdmin } = useAuthStore();

    useEffect(() => {
        // 이미 로그인된 경우 대시보드로 리다이렉트
        if (user) {
            if (user.role === 'super_admin') {
                router.push("/superadmin/brands");
            } else {
                router.push("/");
            }
        }
    }, [user, router]);

    const handleKakaoLogin = async (asSuperAdmin: boolean = false) => {
        setIsLoggingInAsSuperAdmin(asSuperAdmin);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "kakao",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        if (error) console.error("Error logging in with Kakao:", error.message);
    };

    const handleGoogleLogin = async (asSuperAdmin: boolean = false) => {
        setIsLoggingInAsSuperAdmin(asSuperAdmin);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        if (error) console.error("Error logging in with Google:", error.message);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50/50 p-4">
            <Card className="w-full max-w-md border-0 bg-white/70 shadow-xl backdrop-blur-xl">
                <CardHeader className="space-y-3 pb-8 text-center pt-8">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2D6A4F] text-white shadow-lg">
                        <Lock className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                        <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">
                            관리자 로그인
                        </CardTitle>
                        <CardDescription className="text-sm font-medium text-gray-500">
                            파트너 대시보드 접근을 위해 서비스에 로그인해주세요
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 pb-8">
                    <Button
                        variant="outline"
                        className="w-full justify-between border-gray-200 bg-white font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900 h-14"
                        onClick={() => handleGoogleLogin(false)}
                    >
                        <span className="flex items-center gap-3">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l2.85-2.22.83-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            구글로 계속하기
                        </span>
                    </Button>

                    <Button
                        className="w-full justify-between bg-[#FEE500] text-[#191919] hover:bg-[#FEE500]/90 border-0 h-14 font-semibold"
                        onClick={() => handleKakaoLogin(false)}
                    >
                        <span className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M12 3C6.477 3 2 6.582 2 11c0 2.805 1.761 5.275 4.417 6.742L5.275 21a.5.5 0 00.783.565l4.135-2.864c.59.066 1.192.1 1.807.1 5.523 0 10-3.582 10-8s-4.477-8-10-8z" fill="#191919" />
                            </svg>
                            카카오로 계속하기
                        </span>
                    </Button>

                    <p className="pt-4 text-center text-xs text-gray-500">
                        소셜 로그인하면 서비스 약관 및 개인정보 처리방침에 동의하는 것으로 간주됩니다.
                    </p>

                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white/70 px-2 text-gray-500">System Admin</span>
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        className="w-full text-xs text-gray-500 hover:text-gray-900"
                        onClick={() => handleKakaoLogin(true)}
                    >
                        👑 최고 관리자 접속하기
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
