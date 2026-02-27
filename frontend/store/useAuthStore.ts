import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    email: string;
    name: string;
    avatar_url?: string;
    provider?: string;
    role?: string;
    brand_id?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    selectedBrandId: string | null;
    selectedBrandName: string | null;
    isLoggingInAsSuperAdmin: boolean;
    setAuth: (user: User, token: string) => void;
    setSelectedBrandId: (brandId: string | null) => void;
    setSelectedBrandName: (brandName: string | null) => void;
    setIsLoggingInAsSuperAdmin: (val: boolean) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            selectedBrandId: null,
            selectedBrandName: null,
            isLoggingInAsSuperAdmin: false,
            setAuth: (user, token) => set({ user, token }),
            setSelectedBrandId: (brandId) => set({ selectedBrandId: brandId }),
            setSelectedBrandName: (brandName) => set({ selectedBrandName: brandName }),
            setIsLoggingInAsSuperAdmin: (val) => set({ isLoggingInAsSuperAdmin: val }),
            logout: () => set({ user: null, token: null, selectedBrandId: null, selectedBrandName: null, isLoggingInAsSuperAdmin: false }),
        }),
        {
            name: 'auth-storage', // 로컬 스토리지에 저장될 키 이름
        }
    )
);
