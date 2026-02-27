"use client"

import { HelpCircle } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface InfoTooltipProps {
  content: string
  className?: string
  iconClassName?: string
  side?: "top" | "right" | "bottom" | "left"
}

export function InfoTooltip({
  content,
  className,
  iconClassName,
  side = "top",
}: InfoTooltipProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={cn(
              "inline-flex items-center justify-center rounded-full text-muted-foreground/60 hover:text-muted-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              className
            )}
            aria-label="More information"
          >
            <HelpCircle className={cn("size-4", iconClassName)} />
          </button>
        </TooltipTrigger>
        <TooltipContent
          side={side}
          className="max-w-xs text-sm leading-relaxed"
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

/* Glossary of marketing terms with plain-language explanations */
export const GLOSSARY = {
  roi: "ROI(투자 대비 수익률): 100원을 써서 얼마를 벌었는지 알려줘요. 100%가 넘으면 이익이에요!",
  clv: "CLV(고객 생애 가치): 고객 한 명이 우리 브랜드와 거래하는 동안 총 얼마를 쓸 것으로 예상되는지 알려줘요.",
  nps: "NPS(고객 추천 지수): 고객이 우리 브랜드를 다른 사람에게 얼마나 추천하고 싶은지 0~100점으로 보여줘요. 50점 이상이면 좋은 편이에요.",
  conversionRate: "최종 목표 전환율: 우리가 설정한 최종 목표(예: 구매 완료, 회원 가입)에 도달한 비율이에요.",
  buttonClickRate: "랜딩페이지 버튼 클릭률: QR 스캔 후 나타나는 페이지의 버튼(예: 구매하기, 자세히 보기)이 클릭된 비율이에요.",
  uniqueVisitors: "순 방문자: 같은 사람이 여러 번 방문해도 1명으로 세는 실제 방문자 수예요.",
  funnel: "고객 행동 단계 분석: 고객이 처음 우리를 만나서 최종 목표(구매 등)까지 도달하는 과정을 단계별로 보여줘요.",
  retention: "리텐션(재방문율): 고객이 한 번 방문한 뒤 다시 돌아오는 비율이에요. 높을수록 좋아요!",
  uss: "USS(언박싱 만족도): QR 스캔 후 '언박싱 경험은 어떠셨나요?' 설문에 대한 평균 만족도 점수예요.",
  rfm: "RFM 분석: 고객의 최근 방문(Recency), 방문 빈도(Frequency), 구매 금액(Monetary)을 기준으로 고객을 자동 분류하는 분석 기법이에요.",
  segment: "세그먼트: 비슷한 특성을 가진 고객들을 하나의 그룹으로 묶은 것이에요. 그룹별로 맞춤 마케팅을 할 수 있어요.",
  cpa: "CPA(고객 획득 비용): 새로운 고객 한 명을 데려오는 데 드는 평균 비용이에요. 낮을수록 효율적이에요.",
  attribution: "어트리뷰션(기여도 분석): 어떤 캠페인이 최종 목표(구매 등)에 가장 큰 영향을 주었는지 평가하는 방법이에요.",
  optIn: "옵트인(수신 동의): 고객이 마케팅 정보(메일, 알림 등)를 받겠다고 직접 동의하는 비율이에요.",
} as const
