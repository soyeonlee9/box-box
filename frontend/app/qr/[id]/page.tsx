"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { apiFetch } from "@/lib/api"
import { supabase } from "@/lib/supabase"
import { useAuthStore } from "@/store/useAuthStore"
import { QrCode, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react"

export default function QRLandingPage() {
    const params = useParams()
    const router = useRouter()
    const campaignId = params.id as string
    const user = useAuthStore(state => state.user)

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [campaign, setCampaign] = useState<any>(null)
    const [scanResult, setScanResult] = useState<any>(null)
    const hasScanned = useRef(false)

    useEffect(() => {
        async function initScan() {
            if (hasScanned.current) return
            hasScanned.current = true

            try {
                setLoading(true)

                // 1. Fetch Campaign Details directly from Supabase to get the URL
                const { data: campaignData, error: campaignError } = await supabase
                    .from("campaigns")
                    .select("*")
                    .eq("id", campaignId)
                    .single()

                if (campaignError || !campaignData) {
                    throw new Error("캠페인을 찾을 수 없습니다.")
                }

                if (!campaignData.is_active) {
                    throw new Error("현재 진행 중인 캠페인이 아닙니다.")
                }

                setCampaign(campaignData)

                // 2. Record the scan via our backend API
                // In a real app, you'd collect actual device info here
                const scanPayload = {
                    campaign_id: campaignId,
                    user_id: user?.id || null, // Add user ID if logged in
                    location: "Seoul",
                    device_type: navigator.userAgent.includes("Mobile") ? "Mobile" : "Desktop",
                    metadata: {
                        referrer: document.referrer,
                        time: new Date().toISOString()
                    }
                }

                // We use apiFetch so if the user happens to be logged in (e.g. testing), their user_id is passed
                const scanRes = await apiFetch("/scan", {
                    method: "POST",
                    body: JSON.stringify(scanPayload),
                })

                setScanResult(scanRes)

            } catch (err: any) {
                console.error("Scan error:", err)
                setError(err.message || "스캔 처리 중 오류가 발생했습니다.")
            } finally {
                setLoading(false)
            }
        }

        if (campaignId) {
            initScan()
        }
    }, [campaignId])

    const handleRedirect = () => {
        if (campaign?.url) {
            window.location.href = campaign.url
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-4">
                <div className="flex animate-pulse flex-col items-center space-y-4">
                    <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/20">
                        <QrCode className="size-8 text-primary" />
                    </div>
                    <p className="text-lg font-medium text-zinc-600">캠페인 정보를 불러오는 중...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-4">
                <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-lg">
                    <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-red-100">
                        <AlertCircle className="size-6 text-red-600" />
                    </div>
                    <h1 className="mb-2 text-xl font-bold text-zinc-900">연결 오류</h1>
                    <p className="mb-8 text-sm text-zinc-500">{error}</p>
                    <button
                        onClick={() => router.push("/")}
                        className="w-full rounded-xl bg-zinc-900 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
                    >
                        돌아가기
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-4">
            <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-zinc-100">

                {/* Banner area */}
                <div className="bg-primary px-6 py-10 text-center text-primary-foreground">
                    <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
                        <CheckCircle2 className="size-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">스캔 완료!</h1>
                    <p className="mt-2 text-sm text-primary-foreground/80">
                        {campaign?.name} 캠페인
                    </p>
                </div>

                {/* Content area */}
                <div className="p-6 text-center">

                    {scanResult?.badgeEarned && (
                        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
                            <p className="text-sm font-bold text-amber-800">🎉 축하합니다! 새로운 배지를 획득하셨습니다!</p>
                            <p className="mt-1 text-xs text-amber-700">{scanResult.earnedBadgeDetails?.name}</p>
                        </div>
                    )}

                    <h2 className="mb-2 text-lg font-semibold text-zinc-900">
                        브랜드 페이지로 이동합니다
                    </h2>
                    <p className="mb-8 text-sm text-zinc-500 line-clamp-2">
                        다양한 혜택과 이벤트가 준비되어 있습니다. 아래 버튼을 눌러 계속 진행해주세요.
                    </p>

                    <button
                        onClick={handleRedirect}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                        <span>브랜드 홈으로 이동</span>
                        <ArrowRight className="size-4" />
                    </button>

                    <p className="mt-6 text-[10px] text-zinc-400">
                        Powered by Archetype Insights
                    </p>
                </div>
            </div>
        </div>
    )
}
