"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, QrCode, Palette, Megaphone, Gift, Tag } from "lucide-react"

const projects = [
  {
    icon: QrCode,
    name: "QR 랜딩페이지 개선",
    dueDate: "2026년 3월 5일",
    variant: "primary" as const,
  },
  {
    icon: Palette,
    name: "신규 엽서 디자인",
    dueDate: "2026년 3월 10일",
    variant: "muted" as const,
  },
  {
    icon: Megaphone,
    name: "SNS 캠페인 연동",
    dueDate: "2026년 3월 15일",
    variant: "muted" as const,
  },
  {
    icon: Gift,
    name: "쿠폰 발급 시스템",
    dueDate: "2026년 3월 20일",
    variant: "primary" as const,
  },
  {
    icon: Tag,
    name: "A/B 테스트 설정",
    dueDate: "2026년 3월 25일",
    variant: "muted" as const,
  },
]

export function ProjectList() {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-base font-semibold">프로젝트</CardTitle>
        <CardAction>
          <Button variant="outline" size="sm" className="gap-1 text-xs">
            <Plus className="size-3.5" />새 프로젝트
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {projects.map((p) => (
          <div key={p.name} className="flex items-center gap-3">
            <div
              className={
                p.variant === "primary"
                  ? "flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10"
                  : "flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary"
              }
            >
              <p.icon
                className={
                  p.variant === "primary"
                    ? "size-4 text-primary"
                    : "size-4 text-muted-foreground"
                }
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {p.name}
              </p>
              <p className="text-xs text-muted-foreground">
                마감: {p.dueDate}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
