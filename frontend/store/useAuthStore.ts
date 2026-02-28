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

export interface InAppNotification {
    id: string;
    type: "success" | "warning" | "anomaly" | "info";
    text: string;
    time: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    selectedBrandId: string | null;
    selectedBrandName: string | null;
    isLoggingInAsSuperAdmin: boolean;
    notificationSettings: { email: boolean; inApp: boolean };
    inAppNotifications: InAppNotification[];
    setAuth: (user: User, token: string) => void;
    setSelectedBrandId: (brandId: string | null) => void;
    setSelectedBrandName: (brandName: string | null) => void;
    setIsLoggingInAsSuperAdmin: (val: boolean) => void;
    setNotificationSettings: (settings: { email: boolean; inApp: boolean }) => void;
    setInAppNotifications: (notis: InAppNotification[]) => void;
    addInAppNotification: (noti: Omit<InAppNotification, "id" | "time">) => void;
    clearInAppNotifications: () => void;
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
            notificationSettings: { email: true, inApp: true },
            inAppNotifications: [],
            setAuth: (user, token) => set({ user, token }),
            setSelectedBrandId: (brandId) => set({ selectedBrandId: brandId }),
            setSelectedBrandName: (brandName) => set({ selectedBrandName: brandName }),
            setIsLoggingInAsSuperAdmin: (val) => set({ isLoggingInAsSuperAdmin: val }),
            setNotificationSettings: (settings) => set({ notificationSettings: settings }),
            setInAppNotifications: (notis) => set({ inAppNotifications: notis }),
            addInAppNotification: (noti) => set((state) => ({
                inAppNotifications: [
                    { ...noti, id: Math.random().toString(36).substring(7), time: "방금 전" },
                    ...(state.inAppNotifications || [])
                ]
            })),
            clearInAppNotifications: () => set({ inAppNotifications: [] }),
            logout: () => set({ user: null, token: null, selectedBrandId: null, selectedBrandName: null, isLoggingInAsSuperAdmin: false }),
        }),
        {
            name: 'auth-storage', // 로컬 스토리지에 저장될 키 이름
        }
    )
);
