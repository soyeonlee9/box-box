"use client"

import { TrendingUp, Target, BarChart3, Calendar } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

const forecasts = [
  {
    label: "다음 달 예상 스캔 수",
    value: "14,800",
    unit: "회",
    confidence: 87,
    trend: "+18.9%",
    icon: BarChart3,
    description: "최근 3개월 상승 추세 기반 예측",
  },
  {
    label: "분기 ROI 목표 달성 확률",
    value: "92",
    unit: "%",
    confidence: 91,
    trend: "높음",
    icon: Target,
    description: "현재 진행 속도 기준 목표 초과 전망",
  },
  {
    label: "예상 신규 방문자",
    value: "9,400",
    unit: "명",
    confidence: 78,
    trend: "+14.6%",
    icon: TrendingUp,
    description: "신규 캠페인 론칭 효과 포함",
  },
]

export function ForecastWidget() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calendar className="size-4 text-primary" />
          <CardTitle className="text-base font-semibold">미래 예측</CardTitle>
        </div>
        <CardDescription>과거 데이터 기반 핵심 지표 예측</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {forecasts.map((fc) => (
            <div key={fc.label} className="flex items-start gap-3 rounded-xl border border-border p-4">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <fc.icon className="size-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-muted-foreground">{fc.label}</p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-2xl font-bold text-foreground font-mono">{fc.value}</span>
                  <span className="text-sm text-muted-foreground">{fc.unit}</span>
                  <span className="ml-auto text-xs font-semibold text-primary">{fc.trend}</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        fc.confidence >= 85 ? "bg-primary" : fc.confidence >= 70 ? "bg-amber-500" : "bg-muted-foreground"
                      )}
                      style={{ width: `${fc.confidence}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">{fc.confidence}% 신뢰도</span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">{fc.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
