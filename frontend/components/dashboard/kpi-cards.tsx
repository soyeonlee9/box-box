"use client"

import { ArrowUpRight, QrCode, Users, MousePointerClick, TrendingUp, Wallet } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { InfoTooltip, GLOSSARY } from "@/components/ui/info-tooltip"

export interface KpiItem {
  label: string
  value: string
  unit: string
  change: string
  changeLabel: string
  icon: React.ElementType
  highlight: boolean
  tourId?: string
  tooltip?: string
  interpretation?: string
  detail: {
    title: string
    rows: { label: string; value: string }[]
    description: string
  }
}

export const kpiData: KpiItem[] = [
  {
    label: "총 스캔 수",
    value: "12,450",
    unit: "회",
    change: "+18.2%",
    changeLabel: "전월 대비",
    icon: QrCode,
    highlight: true,
    tooltip: "QR코드가 스캔된 총 횟수예요. 많을수록 캠페인에 관심을 보인 고객이 많다는 뜻이에요.",
    interpretation: "이번 달 12,450번 스캔됨",
    detail: {
      title: "총 스캔 수 상세",
      rows: [
        { label: "오늘", value: "412회" },
        { label: "이번 주", value: "2,840회" },
        { label: "이번 달", value: "12,450회" },
        { label: "일평균", value: "415회" },
        { label: "피크 일", value: "6/15 (750회)" },
      ],
      description: "전월(10,530회) 대비 18.2% 상승하였으며, 최근 일주일간 지속 상승 추세를 보이고 있습니다.",
    },
  },
  {
    label: "순 방문자 수",
    value: "8,200",
    unit: "명",
    change: "+12.5%",
    changeLabel: "전월 대비",
    icon: Users,
    highlight: false,
    tooltip: GLOSSARY.uniqueVisitors,
    interpretation: "실제 8,200명이 방문함",
    detail: {
      title: "순 방문자 수 상세",
      rows: [
        { label: "오늘", value: "280명" },
        { label: "이번 주", value: "1,920명" },
        { label: "이번 달", value: "8,200명" },
        { label: "재방문율", value: "34.2%" },
        { label: "신규 방문", value: "5,396명" },
      ],
      description: "재방문율이 34.2%로 높은 편이며, 신규 방문자 유입이 꾸준히 증가하고 있습니다.",
    },
  },
  {
    label: "랜딩페이지 버튼 클릭률",
    value: "32.4",
    unit: "%",
    change: "+5.1%",
    changeLabel: "전월 대비",
    icon: MousePointerClick,
    highlight: false,
    tooltip: GLOSSARY.buttonClickRate,
    interpretation: "방문자 100명 중 32명이 클릭",
    detail: {
      title: "랜딩페이지 버튼 클릭률 상세",
      rows: [
        { label: "CTA 클릭 수", value: "4,034회" },
        { label: "랜딩 노출 수", value: "12,450회" },
        { label: "전월 클릭률", value: "27.3%" },
        { label: "최고 클릭률 캠페인", value: "25SS 스프링 (41%)" },
        { label: "최저 클릭률 캠페인", value: "브랜드 소개 (18%)" },
      ],
      description: "전환 버튼 위치 최적화 이후 클릭률이 5.1%p 향상되었습니다.",
    },
  },
  {
    label: "투자 대비 수익률(ROI)",
    value: "340",
    unit: "%",
    change: "+24.8%",
    changeLabel: "전월 대비",
    icon: TrendingUp,
    highlight: false,
    tourId: "kpi-roi",
    tooltip: GLOSSARY.roi,
    interpretation: "100원 투자해서 340원 수익",
    detail: {
      title: "투자 대비 수익률(ROI) 상세",
      rows: [
        { label: "총 매출 기여", value: "₩34,000,000" },
        { label: "캠페인 비용", value: "₩10,000,000" },
        { label: "순이익", value: "₩24,000,000" },
        { label: "전월 ROI", value: "272%" },
        { label: "최고 ROI 캠페인", value: "25SS 스프링 (520%)" },
      ],
      description: "QR 캠페인 비용 대비 매출 기여가 340%로, 전월 272% 대비 크게 개선되었습니다.",
    },
  },
  {
    label: "고객 생애 가치(CLV)",
    value: "₩367K",
    unit: "",
    change: "+15.3%",
    changeLabel: "전월 대비",
    icon: Wallet,
    highlight: false,
    tooltip: GLOSSARY.clv,
    interpretation: "고객 1명당 예상 매출 367,000원",
    detail: {
      title: "고객 생애 가치(CLV) 상세",
      rows: [
        { label: "Champions CLV", value: "₩820,000" },
        { label: "Loyal CLV", value: "₩540,000" },
        { label: "신규 고객 CLV", value: "₩150,000" },
        { label: "이탈 위험 CLV", value: "₩280,000" },
        { label: "전체 평균", value: "₩367,000" },
      ],
      description:
        "전월(₩318K) 대비 15.3% 상승했습니다. Champions 세그먼트의 CLV가 전체 평균을 견인하고 있습니다.",
    },
  },
]

interface KpiCardsProps {
  onSelect?: (kpi: KpiItem) => void
}

export function KpiCards({ onSelect }: KpiCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {kpiData.map((kpi) => (
        <Card
          key={kpi.label}
          data-tour={kpi.tourId}
          className={cn(
            "relative overflow-hidden transition-all hover:shadow-md cursor-pointer active:scale-[0.98]",
            kpi.highlight
              ? "border-primary border-2 shadow-sm"
              : "border-border"
          )}
          onClick={() => onSelect?.(kpi)}
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <p className="text-sm font-medium text-muted-foreground truncate">
                  {kpi.label}
                </p>
                {kpi.tooltip && (
                  <InfoTooltip content={kpi.tooltip} iconClassName="size-3.5" />
                )}
              </div>
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-lg",
                  kpi.highlight ? "bg-primary/10" : "bg-secondary"
                )}
              >
                <kpi.icon
                  className={cn(
                    "size-4",
                    kpi.highlight ? "text-primary" : "text-foreground"
                  )}
                />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-3xl font-bold tracking-tight font-mono text-primary">
                {kpi.value}
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                {kpi.unit}
              </span>
            </div>
            {/* Plain-language interpretation */}
            {kpi.interpretation && (
              <p className="mt-1 text-xs text-muted-foreground/80">
                ({kpi.interpretation})
              </p>
            )}
            <div className="mt-3 flex items-center gap-1.5">
              <div className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                <ArrowUpRight className="size-3" />
                {kpi.change}
              </div>
              <span className="text-xs text-muted-foreground">
                {kpi.changeLabel}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
