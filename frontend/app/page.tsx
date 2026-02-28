"use client"

import Link from "next/link"
import { DesktopSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { QrCode, Users, Star, ArrowUpRight, ArrowDownRight, ChevronRight, ThumbsUp, ThumbsDown, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { InfoTooltip } from "@/components/ui/info-tooltip"

/* ═══════════════════════════════════════════════════════════
   Summary Report Page - "5 Second Dashboard"
   Only 3 core elements for instant comprehension
═══════════════════════════════════════════════════════════ */

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { apiFetch } from "@/lib/api"
import { useAuthStore } from "@/store/useAuthStore"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface SummaryData {
  aiSummary: {
    status: "positive" | "negative" | "observing"
    messageKr: string
    actionKr: string
  }
  coreKpis: Array<{
    id: string
    label: string
    value: string
    change: number
    tooltip: string
    iconType: string
    stars?: number
  }>
  topCampaigns: Array<{ name: string; change: number }>
  bottomCampaigns: Array<{ name: string; change: number }>
}

export default function SummaryReportPage() {
  const router = useRouter()
  const [data, setData] = useState<SummaryData | null>(null)
  const [loading, setLoading] = useState(true)

  // Brand creation state
  const { user, setAuth, token, selectedBrandId, setSelectedBrandId, setSelectedBrandName } = useAuthStore()
  const [newBrandName, setNewBrandName] = useState("")
  const [isCreatingBrand, setIsCreatingBrand] = useState(false)

  useEffect(() => {
    // 최고관리자이면서, 특정 브랜드를 '관전(impersonate)' 중이지 않을 때만 포털로 이동
    if (user?.role === 'super_admin' && !selectedBrandId) {
      router.push("/superadmin/brands")
    }
  }, [user, router, selectedBrandId])

  useEffect(() => {
    async function fetchSummary() {
      try {
        const jsonData = await apiFetch("/analytics/summary")
        setData(jsonData)
      } catch (err) {
        console.error("Error fetching summary data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()
  }, [])

  const statusConfig = {
    positive: {
      icon: ThumbsUp,
      bg: "bg-primary/10",
      border: "border-primary/20",
      iconBg: "bg-primary",
    },
    negative: {
      icon: ThumbsDown,
      bg: "bg-destructive/10",
      border: "border-destructive/20",
      iconBg: "bg-destructive",
    },
    observing: {
      icon: Eye,
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      iconBg: "bg-amber-500",
    },
  }

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "QrCode": return QrCode;
      case "Users": return Users;
      case "Star": return Star;
      default: return QrCode;
    }
  }

  async function handleCreateBrand() {
    if (!newBrandName.trim()) return
    setIsCreatingBrand(true)
    try {
      const res = await apiFetch("/user/brand", {
        method: "POST",
        body: JSON.stringify({ name: newBrandName })
      })
      toast.success("브랜드가 생성되었습니다!")

      // Update global auth store with new brand logic and new JWT token
      if (user && res.token) {
        setAuth({ ...user, brand_id: res.brand.id }, res.token)
        setSelectedBrandId(res.brand.id)
        setSelectedBrandName(res.brand.name)
      }

      // Reload page to fetch real data
      window.location.reload()
    } catch (err) {
      toast.error("브랜드 생성에 실패했습니다.")
    } finally {
      setIsCreatingBrand(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">데이터를 불러오는 중입니다...</p>
      </div>
    )
  }

  // Handle super_admin immediate redirect state (prevents UI flicker)
  if (user?.role === 'super_admin' && !selectedBrandId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2D6A4F] border-t-transparent"></div>
      </div>
    )
  }

  // Handle case where user has NO brand
  if (user && !user.brand_id) {
    return (
      <div className="min-h-screen bg-background">
        <DesktopSidebar />
        <div className="lg:pl-64">
          <DashboardHeader />
          <main className="px-4 py-6 sm:px-6 lg:px-8 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[70vh]">
            <div className="inline-flex size-20 items-center justify-center rounded-3xl bg-primary/10 mb-6">
              <Users className="size-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">환영합니다, {user.name}님!</h2>
            <p className="text-muted-foreground mt-2 text-center mb-8">
              아키타입 시스템을 시작하려면 먼저 소속된 브랜드를 생성해주세요.<br />
              이후 생성된 브랜드 워크스페이스에서 캠페인과 데이터를 관리할 수 있습니다.
            </p>

            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-lg">새 브랜드 생성</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">브랜드 이름</label>
                  <Input
                    placeholder="예: 나이키 코리아"
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreateBrand()}
                    disabled={isCreatingBrand}
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={handleCreateBrand}
                  disabled={!newBrandName.trim() || isCreatingBrand}
                >
                  {isCreatingBrand ? "생성 중..." : "브랜드 생성하기"}
                </Button>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    )
  }

  if (!data || ('error' in data) || !data.aiSummary) {
    return (
      <div className="min-h-screen bg-background">
        <DesktopSidebar />
        <div className="lg:pl-64">
          <DashboardHeader />
          <main className="px-4 py-6 sm:px-6 lg:px-8 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
            <div className="inline-flex size-16 items-center justify-center rounded-2xl bg-muted mb-4">
              <QrCode className="size-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold text-foreground">데이터가 없습니다</h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-md text-center">
              {(data as any)?.error || "현재 접속하신 브랜드에는 아직 생성된 데이터가 없습니다. 새로운 캠페인을 만들어보세요!"}
            </p>
            <Link
              href="/campaigns"
              className="mt-6 flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              캠페인 만들러 가기
            </Link>
          </main>
        </div>
      </div>
    )
  }

  const { aiSummary, coreKpis, topCampaigns, bottomCampaigns } = data;

  const config = statusConfig[aiSummary.status]
  const StatusIcon = config.icon

  return (
    <div className="min-h-screen bg-background">
      <DesktopSidebar />

      <div className="lg:pl-64">
        <DashboardHeader />

        <main className="px-4 py-6 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">{"\uC694\uC57D \uB9AC\uD3EC\uD2B8"}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {"\uCE98\uD398\uC778 \uD604\uD669\uC744 5\uCD08 \uC548\uC5D0 \uD30C\uC545\uD558\uC138\uC694"}
            </p>
          </div>

          {/* ═══════════════════════════════════════════════════
            1. AI Summary Card (Top, Largest)
        ═══════════════════════════════════════════════════ */}
          <Card className={cn("mb-6 border-2", config.border, config.bg)}>
            <CardContent className="p-6">
              <div className="flex items-start gap-5">
                <div className={cn(
                  "flex size-16 shrink-0 items-center justify-center rounded-2xl",
                  config.iconBg
                )}>
                  <StatusIcon className="size-8 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    AI {"\uC694\uC57D"}
                  </p>
                  <p className="text-lg font-semibold text-foreground leading-relaxed">
                    {aiSummary.messageKr}
                  </p>
                  {aiSummary.actionKr && (
                    <p className="mt-3 text-sm font-bold text-primary bg-primary/10 rounded-lg px-3 py-2">
                      {"\uD83D\uDCA1"} {aiSummary.actionKr}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ═══════════════════════════════════════════════════
            2. Core KPI Cards (Only 3)
        ═══════════════════════════════════════════════════ */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-foreground">{"\uD575\uC2EC \uC131\uACFC"}</h2>
              <Link
                href="/analytics"
                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                {"\uC0C1\uC138 \uBD84\uC11D \uBCF4\uAE30"}
                <ChevronRight className="size-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {coreKpis.map((kpi) => {
                const isPositive = kpi.change >= 0
                return (
                  <Card key={kpi.id}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-medium text-muted-foreground">
                            {kpi.label}
                          </p>
                          <InfoTooltip content={kpi.tooltip} />
                        </div>
                        <div className="flex size-9 items-center justify-center rounded-lg bg-secondary">
                          {(() => {
                            const KPIIcon = getIcon(kpi.iconType);
                            return <KPIIcon className="size-4 text-foreground" />
                          })()}
                        </div>
                      </div>

                      <div className="mt-3">
                        {kpi.stars !== undefined ? (
                          <div className="flex items-center gap-2">
                            <span className="text-3xl font-bold text-foreground font-mono">
                              {kpi.value}
                            </span>
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  className={cn(
                                    "size-4",
                                    s <= Math.round(kpi.stars!)
                                      ? "text-amber-500 fill-amber-500"
                                      : "text-muted-foreground/30"
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                        ) : (
                          <span className="text-3xl font-bold text-foreground font-mono">
                            {kpi.value}
                          </span>
                        )}
                      </div>

                      <div className="mt-3 flex items-center gap-1.5">
                        <Badge
                          className={cn(
                            "gap-1 border-0 text-xs font-semibold",
                            isPositive
                              ? "bg-primary/10 text-primary"
                              : "bg-destructive/10 text-destructive"
                          )}
                        >
                          {isPositive ? (
                            <ArrowUpRight className="size-3" />
                          ) : (
                            <ArrowDownRight className="size-3" />
                          )}
                          {isPositive ? "+" : ""}{kpi.change}%
                        </Badge>
                        <span className="text-xs text-muted-foreground">{"\uC9C0\uB09C\uB2EC \uB300\uBE44"}</span>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════
            3. Campaign Traffic Light (Top 3 vs Bottom 3)
        ═══════════════════════════════════════════════════ */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-foreground">{"\uCE98\uD398\uC778 \uC131\uACFC \uC2E0\uD638\uB4F1"}</h2>
              <Link
                href="/campaigns"
                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                {"\uC804\uCCB4 \uCE98\uD398\uC778 \uBCF4\uAE30"}
                <ChevronRight className="size-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* TOP 3 - Green */}
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <span className="flex size-3 rounded-full bg-primary" />
                    TOP 3 {"\uCE98\uD398\uC778"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="flex flex-col gap-2.5">
                    {topCampaigns.map((campaign, idx) => (
                      <li key={campaign.name}>
                        <Link
                          href="/campaigns"
                          className="flex items-center justify-between rounded-lg bg-card p-3 transition-colors hover:bg-secondary"
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                              {idx + 1}
                            </span>
                            <span className="text-sm font-medium text-foreground">
                              {campaign.name}
                            </span>
                          </div>
                          <Badge className="bg-primary/10 text-primary border-0 text-xs font-semibold gap-1">
                            <ArrowUpRight className="size-3" />
                            +{campaign.change}%
                          </Badge>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 rounded-lg bg-card p-3 text-xs text-primary font-medium">
                    {"\uD83D\uDCA1"} {"\uC798\uB418\uB294 \uCE98\uD398\uC778\uC740 \uC608\uC0B0\uC744 \uB298\uB824 \uC131\uACFC\uB97C \uADF9\uB300\uD654\uD558\uC138\uC694."}
                  </div>
                </CardContent>
              </Card>

              {/* BOTTOM 3 - Red */}
              <Card className="border-destructive/20 bg-destructive/5">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <span className="flex size-3 rounded-full bg-destructive" />
                    BOTTOM 3 {"\uCE98\uD398\uC778"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="flex flex-col gap-2.5">
                    {bottomCampaigns.map((campaign, idx) => (
                      <li key={campaign.name}>
                        <Link
                          href="/campaigns"
                          className="flex items-center justify-between rounded-lg bg-card p-3 transition-colors hover:bg-secondary"
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex size-6 items-center justify-center rounded-full bg-destructive text-xs font-bold text-white">
                              {idx + 1}
                            </span>
                            <span className="text-sm font-medium text-foreground">
                              {campaign.name}
                            </span>
                          </div>
                          <Badge className="bg-destructive/10 text-destructive border-0 text-xs font-semibold gap-1">
                            <ArrowDownRight className="size-3" />
                            {campaign.change}%
                          </Badge>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 rounded-lg bg-card p-3 text-xs text-destructive font-medium">
                    {"\u26A0\uFE0F"} {"\uC131\uACFC\uAC00 \uB0AE\uC740 \uCE98\uD398\uC778\uC740 \uC6D0\uC778\uC744 \uBD84\uC11D\uD558\uAC70\uB098 \uC870\uAE30 \uC885\uB8CC\uB97C \uACE0\uB824\uD574\uBCF4\uC138\uC694."}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
