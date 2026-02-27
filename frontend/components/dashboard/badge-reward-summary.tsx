"use client"

import { Award, Gift, Trophy, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const badgeStats = [
  { label: "총 배지 발급", value: "3,842", icon: Award, color: "bg-primary/10 text-primary" },
  { label: "활성 배지 종류", value: "12", icon: Trophy, color: "bg-accent/10 text-accent" },
  { label: "리워드 발급", value: "1,256", icon: Gift, color: "bg-chart-3/10 text-chart-3" },
  { label: "리워드 사용률", value: "68%", icon: Sparkles, color: "bg-chart-4/10 text-chart-4" },
]

export function BadgeRewardSummary() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">배지 / 리워드 현황</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {badgeStats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 rounded-xl border border-border p-3"
            >
              <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${stat.color}`}>
                <stat.icon className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
                <p className="text-lg font-bold text-foreground font-mono">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
