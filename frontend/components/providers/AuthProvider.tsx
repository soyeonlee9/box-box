"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

const publicRoutes = ["/login", "/auth/callback"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, token } = useAuthStore();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;

        const isPublicRoute = publicRoutes.some((route) => pathname?.startsWith(route));

        if (!user || !token) {
            if (!isPublicRoute) {
                router.push("/login");
            }
        } else {
            if (isPublicRoute) {
                router.push("/");
            }
        }
    }, [user, token, pathname, router, isMounted]);

    // 하이드레이션 에러 방지를 위해 마운트 될 때까지 라우팅 깜박임 처리
    if (!isMounted) {
        return null;
    }

    return <>{children}</>;
}
