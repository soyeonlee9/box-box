"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { InfoTooltip, GLOSSARY } from "@/components/ui/info-tooltip"
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Label,
  Funnel,
  FunnelChart,
  LabelList,
  Tooltip,
} from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { DesktopSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import {
  CalendarDays,
  ChevronDown,
  Lightbulb,
  TrendingUp,
  Clock,
  MapPin,
  Smartphone,
  QrCode,
  Users,
  RotateCcw,

  Star,

} from "lucide-react"
import { apiFetch } from "@/lib/api"

/* ── Color constants ── */
const GREEN = "#2D6A4F"
const GREEN_MID = "#40916C"
const GREEN_LIGHT = "#52B788"
const GREEN_PALE = "#95D5B2"
const GREEN_XPALE = "#B7E4C7"
const GREEN_DARK = "#1B4332"
const GRID = "#e5e5e0"
const TICK = "#6b7280"
const DEVICE_COLORS = [GREEN, GREEN_MID, GREEN_LIGHT, GREEN_PALE, GREEN_DARK]

/* ── Date range options ── */
const dateRanges = ["최근 7일", "최근 30일", "최근 90일", "이번 달", "지난 달"]

/* ── Funnel custom tooltip ── */
function FunnelTooltipContent({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md">
      <p className="text-xs font-semibold text-foreground">{d.name}</p>
      <p className="text-sm font-bold text-primary tabular-nums">{d.value.toLocaleString()}명</p>
    </div>
  )
}

// Icon Mapping
const iconMap: Record<string, any> = {
  QrCode, Clock, RotateCcw, MapPin, Smartphone,
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("최근 30일")
  const [selectedRegion, setSelectedRegion] = useState<any | null>(null)
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const jsonData = await apiFetch("/analytics/detailed")
        setData(jsonData)
      } catch (err) {
        console.error("Error fetching analytics:", err)
        toast.error("데이터를 불러오는 데 실패했습니다.")
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">데이터를 불러오는 중입니다...</p>
      </div>
    )
  }

  if (!data || ('error' in data) || !data.funnelData) {
    return (
      <div className="min-h-screen bg-background">
        <DesktopSidebar />
        <div className="lg:pl-64">
          <DashboardHeader />
          <main className="p-4 lg:p-6 flex flex-col items-center justify-center min-h-[60vh]">
            <div className="inline-flex size-16 items-center justify-center rounded-2xl bg-muted mb-4">
              <TrendingUp className="size-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold text-foreground">데이터가 없습니다</h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-md text-center">
              {(data as any)?.error || "상세 분석을 위한 데이터가 충분하지 않습니다. 캠페인을 진행하여 데이터를 모아보세요!"}
            </p>
          </main>
        </div>
      </div>
    )
  }

  const {
    funnelData,
    engagementKpis,
    npsScore,
    npsData,
    hourlyData,
    regionData,
    deviceData,
    ussScore,
    ussBreakdown,
    insights
  } = data;

  const maxRegionPercent = Math.max(...regionData.map((d: any) => d.percentage))
  const peakHour = hourlyData.reduce((max: any, d: any) => (d.scans > max.scans ? d : max), hourlyData[0])

  return (
    <div className="min-h-screen bg-background">
      <DesktopSidebar />

      <div className="lg:pl-64">
        <DashboardHeader />

        <main className="p-4 lg:p-6">
          {/* Title row */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl text-balance">
                {"\uC131\uACFC \uBD84\uC11D"}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                {"\uC694\uC57D \uB9AC\uD3EC\uD2B8\uC758 \uC0C1\uC138 \uB370\uC774\uD130\uB97C \uD655\uC778\uD558\uC138\uC694."}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <CalendarDays className="size-4" />
                  {dateRange}
                  <ChevronDown className="size-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                {dateRanges.map((range) => (
                  <DropdownMenuItem
                    key={range}
                    onClick={() => setDateRange(range)}
                    className={dateRange === range ? "font-semibold text-primary" : ""}
                  >
                    {range}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* ── Section 1: Engagement KPIs ── */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {engagementKpis.map((kpi: any) => {
              const IconComponent = iconMap[kpi.iconType] || Clock;
              return (
                <Card key={kpi.label}>
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <IconComponent className="size-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {kpi.label}
                      </p>
                      <p className="mt-0.5 text-xl font-bold text-foreground">{kpi.value}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground">{kpi.sub}</p>
                        {kpi.badge && (
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                            {kpi.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* ── Section 2: Funnel + NPS/Sentiment ── */}
          <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-5">
            {/* Funnel Chart (3 cols) */}
            <Card className="xl:col-span-3" data-tour="funnel-chart">
              <CardHeader>
                <div className="flex items-center gap-1.5">
                  <CardTitle className="text-base font-semibold">고객 행동 단계 분석</CardTitle>
                  <InfoTooltip content={GLOSSARY.funnel} />
                </div>
                <CardDescription>
                  {'QR 스캔 → 랜딩페이지 → 콘텐츠 클릭 → 전환 완료'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: { label: "고객 수", color: GREEN },
                  }}
                  className="h-[300px] w-full"
                >
                  <FunnelChart>
                    <Tooltip content={<FunnelTooltipContent />} />
                    <Funnel
                      dataKey="value"
                      data={funnelData}
                      isAnimationActive
                    >
                      <LabelList
                        position="center"
                        content={({ x, y, width, height, value, name }) => {
                          const cx = (x as number) + (width as number) / 2
                          const cy = (y as number) + (height as number) / 2
                          return (
                            <g>
                              <text x={cx} y={cy - 8} textAnchor="middle" className="text-sm font-semibold" fill="#fff">
                                {name}
                              </text>
                              <text x={cx} y={cy + 12} textAnchor="middle" className="text-xs" fill="rgba(255,255,255,0.8)">
                                {(value as number).toLocaleString()}명
                              </text>
                            </g>
                          )
                        }}
                      />
                    </Funnel>
                  </FunnelChart>
                </ChartContainer>
                {/* Funnel conversion rates */}
                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  {funnelData.slice(0, -1).map((d: any, i: number) => {
                    const next = funnelData[i + 1]
                    const rate = ((next.value / d.value) * 100).toFixed(1)
                    return (
                      <div key={d.name} className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1">
                        <span className="text-xs text-muted-foreground">{d.name}</span>
                        <span className="text-xs text-muted-foreground">{"→"}</span>
                        <span className="text-xs font-bold text-primary">{rate}%</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* NPS + Sentiment (2 cols) */}
            <div className="flex flex-col gap-4 xl:col-span-2">
              {/* NPS Gauge */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-1.5">
                    <CardTitle className="text-base font-semibold">고객 추천 지수 (NPS)</CardTitle>
                    <InfoTooltip content={GLOSSARY.nps} />
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <ChartContainer
                    config={{
                      value: { label: "NPS", color: GREEN },
                    }}
                    className="h-[160px] w-full"
                  >
                    <PieChart>
                      <Pie
                        data={npsData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        startAngle={180}
                        endAngle={0}
                        paddingAngle={2}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {npsData.map((entry: any) => (
                          <Cell key={entry.name} fill={entry.fill} />
                        ))}
                        <Label
                          content={({ viewBox }) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                              return (
                                <text x={viewBox.cx} y={(viewBox.cy || 0) - 5} textAnchor="middle" dominantBaseline="middle">
                                  <tspan className="text-3xl font-bold" fill={GREEN}>
                                    {npsScore}
                                  </tspan>
                                </text>
                              )
                            }
                          }}
                        />
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                  <div className="flex items-center gap-4 -mt-6">
                    <div className="flex items-center gap-1.5">
                      <div className="size-2.5 rounded-full" style={{ backgroundColor: GREEN }} />
                      <span className="text-xs text-muted-foreground">추천 72%</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="size-2.5 rounded-full" style={{ backgroundColor: GREEN_PALE }} />
                      <span className="text-xs text-muted-foreground">중립 18%</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="size-2.5 rounded-full bg-destructive" />
                      <span className="text-xs text-muted-foreground">비추천 10%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>

          {/* ── Section 3: Hourly + Region + Device ── */}
          <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
            {/* Hourly bar */}
            <Card className="xl:col-span-2">
              <CardHeader>
                <CardTitle className="text-base font-semibold">언박싱 피크 타임</CardTitle>
                <CardDescription>시간대별 QR 스캔 빈도 (24시간)</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{ scans: { label: "스캔 수", color: GREEN } }}
                  className="h-[280px] w-full"
                >
                  <BarChart data={hourlyData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GRID} />
                    <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: TICK }} interval={1} />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: TICK }}
                      tickFormatter={(v: number) => v.toLocaleString()}
                      width={40}
                    />
                    <ChartTooltip
                      cursor={{ fill: "rgba(0,0,0,0.04)" }}
                      content={({ active, payload, label }) => {
                        if (!active || !payload?.length) return null
                        const scans = payload[0].value as number
                        const isPeak = label === peakHour.hour
                        return (
                          <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md">
                            <p className="text-xs font-semibold text-foreground">{label}</p>
                            <p className="text-sm font-bold font-mono text-primary">{scans.toLocaleString()}회</p>
                            {isPeak && (
                              <p className="text-[10px] font-medium text-primary mt-0.5">Peak Time</p>
                            )}
                          </div>
                        )
                      }}
                    />
                    <Bar dataKey="scans" name="스캔 수" radius={[4, 4, 0, 0]} fill={GREEN}>
                      {hourlyData.map((entry: any) => (
                        <Cell
                          key={entry.hour}
                          fill={entry.hour === peakHour.hour ? GREEN : GREEN_LIGHT}
                          fillOpacity={entry.hour === peakHour.hour ? 1 : 0.6}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Region */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">지역별 스캔 분포</CardTitle>
                <CardDescription>Top 5 지역</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col gap-4">
                  {regionData.map((item: any, index: number) => (
                    <li key={item.region} className="flex flex-col gap-2 cursor-pointer rounded-lg px-2 py-1 transition-colors hover:bg-secondary" onClick={() => setSelectedRegion(item)}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                            {index + 1}
                          </span>
                          <span className="text-sm font-medium text-foreground">{item.region}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground tabular-nums">{item.scans.toLocaleString()}회</span>
                          <span className="text-sm font-bold text-primary tabular-nums">{item.percentage}%</span>
                        </div>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${(item.percentage / maxRegionPercent) * 100}%`,
                            backgroundColor: index === 0 ? GREEN : GREEN_LIGHT,
                            opacity: index === 0 ? 1 : 0.7 + index * -0.08,
                          }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Device donut */}
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-base font-semibold">디바이스 및 브라우저</CardTitle>
                <CardDescription>접속 환경별 스캔 비율</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col items-center">
                <ChartContainer
                  config={Object.fromEntries(
                    deviceData.map((d: any, i: any) => [d.name, { label: d.name, color: DEVICE_COLORS[i] }])
                  )}
                  className="h-[220px] w-full"
                >
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {deviceData.map((entry: any, index: number) => (
                        <Cell key={entry.name} fill={DEVICE_COLORS[index % DEVICE_COLORS.length]} />
                      ))}
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            return (
                              <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 6} className="text-2xl font-bold" fill={GREEN}>
                                  60%
                                </tspan>
                                <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 14} className="text-xs" fill={TICK}>
                                  iOS
                                </tspan>
                              </text>
                            )
                          }
                        }}
                      />
                    </Pie>
                  </PieChart>
                </ChartContainer>
                <div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2">
                  {deviceData.map((d: any, i: any) => (
                    <div key={d.name} className="flex items-center gap-1.5">
                      <div className="size-2.5 rounded-full" style={{ backgroundColor: DEVICE_COLORS[i] }} />
                      <span className="text-xs text-muted-foreground">{d.name}</span>
                      <span className="text-xs font-semibold text-foreground">{d.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── Section 5: USS ── */}
          <div className="mt-6">
            {/* USS - Unboxing Satisfaction Score */}
            <Card className="max-w-md">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Star className="size-4 text-amber-500" />
                  <CardTitle className="text-base font-semibold">언박싱 만족도 (USS)</CardTitle>
                  <InfoTooltip content={GLOSSARY.uss} />
                </div>
                <CardDescription>{'QR 스캔 후 "언박싱 경험은 어떠셨나요?" 설문 결과'}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center mb-4">
                  <p className="text-5xl font-bold text-foreground font-mono">{ussScore}</p>
                  <div className="flex items-center gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map((s: any) => (
                      <Star
                        key={s}
                        className={cn(
                          "size-5",
                          s <= Math.round(ussScore) ? "text-amber-500 fill-amber-500" : "text-muted-foreground/30"
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">총 {ussBreakdown.reduce((s: any, b: any) => s + b.count, 0).toLocaleString()}건 응답</p>
                </div>
                <div className="flex flex-col gap-2">
                  {ussBreakdown.map((item: any) => (
                    <div key={item.stars} className="flex items-center gap-2">
                      <span className="text-xs font-medium text-foreground w-4 text-right">{item.stars}</span>
                      <Star className="size-3 text-amber-500 fill-amber-500 shrink-0" />
                      <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full bg-amber-500 transition-all"
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-muted-foreground w-8 text-right">{item.pct}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── Section 6: AI Insights ── */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Lightbulb className="size-5 text-primary" />
                AI 인사이트 요약
              </CardTitle>
              <CardDescription>데이터를 기반으로 자동 생성된 마케팅 추천 사항</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-4">
                {insights.map((item: any) => {
                  const InsightIcon = iconMap[item.iconType] || Clock;
                  return (
                    <li key={item.title} className="flex gap-4 rounded-xl border border-border bg-secondary/40 p-4">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <InsightIcon className="size-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">{item.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Region detail dialog */}
      <Dialog open={!!selectedRegion} onOpenChange={(o) => !o && setSelectedRegion(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{selectedRegion?.region} 상세</DialogTitle>
          </DialogHeader>
          {selectedRegion && (
            <div className="flex flex-col gap-3 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border p-3">
                  <p className="text-xs text-muted-foreground">스캔 수</p>
                  <p className="text-xl font-bold font-mono text-primary">{selectedRegion.scans.toLocaleString()}</p>
                </div>
                <div className="rounded-xl border border-border p-3">
                  <p className="text-xs text-muted-foreground">비율</p>
                  <p className="text-xl font-bold font-mono text-foreground">{selectedRegion.percentage}%</p>
                </div>
              </div>
              <div className="rounded-xl border border-border p-3">
                <p className="text-xs text-muted-foreground mb-1">추천 액션</p>
                <p className="text-sm text-foreground leading-relaxed">
                  {selectedRegion.percentage >= 20
                    ? "이 지역은 높은 스캔 비율을 보입니다. 팝업스토어나 오프라인 이벤트를 고려해보세요."
                    : "\uC7A0\uC7AC \uC131\uC7A5 \uC9C0\uC5ED\uC785\uB2C8\uB2E4. \uD0C0\uAC9F \uAD11\uACE0\uB97C \uD1B5\uD574 \uC778\uC9C0\uB3C4\uB97C \uB192\uC5EC\uBCF4\uC138\uC694."}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRegion(null)}>닫기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
