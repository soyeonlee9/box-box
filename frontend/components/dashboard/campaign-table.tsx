"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"

const campaigns = [
  { name: "24SS 스프링 에디션 엽서", date: "2026-01-15", scans: 3420, conversions: 1108, status: "진행중" as const },
  { name: "VIP 시크릿 10% 쿠폰", date: "2026-01-20", scans: 2850, conversions: 912, status: "진행중" as const },
  { name: "신규 고객 웰컴 패키지", date: "2025-12-01", scans: 2180, conversions: 654, status: "종료" as const },
  { name: "홀리데이 리미티드 에디션", date: "2025-11-20", scans: 1950, conversions: 585, status: "종료" as const },
  { name: "FW 컬렉션 룩북", date: "2026-02-01", scans: 2050, conversions: 780, status: "진행중" as const },
]

type Campaign = (typeof campaigns)[number]

export function CampaignTable() {
  const [selected, setSelected] = useState<Campaign | null>(null)
  const router = useRouter()

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            진행 중인 QR 캠페인 성과
          </CardTitle>
          <CardDescription>
            캠페인별 스캔 수와 전환율을 비교합니다 (클릭하여 상세 보기)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-muted-foreground">캠페인명</TableHead>
                <TableHead className="text-muted-foreground">발행일</TableHead>
                <TableHead className="text-right text-muted-foreground">누적 스캔</TableHead>
                <TableHead className="text-right text-muted-foreground">전환 수</TableHead>
                <TableHead className="text-center text-muted-foreground">상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((c) => (
                <TableRow
                  key={c.name}
                  className="cursor-pointer transition-colors hover:bg-primary/5"
                  onClick={() => setSelected(c)}
                >
                  <TableCell className="font-medium text-foreground">{c.name}</TableCell>
                  <TableCell className="text-muted-foreground">{c.date}</TableCell>
                  <TableCell className="text-right font-mono text-primary">
                    {c.scans.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-mono text-primary">
                    {c.conversions.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className={`text-xs font-semibold border-0 ${
                        c.status === "진행중"
                          ? "bg-primary/10 text-primary"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {c.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Campaign detail dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selected?.name}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="flex flex-col gap-4 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border p-3">
                  <p className="text-xs text-muted-foreground">누적 스캔</p>
                  <p className="text-xl font-bold font-mono text-primary">
                    {selected.scans.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-xl border border-border p-3">
                  <p className="text-xs text-muted-foreground">전환 수</p>
                  <p className="text-xl font-bold font-mono text-primary">
                    {selected.conversions.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-xl border border-border p-3">
                  <p className="text-xs text-muted-foreground">전환율</p>
                  <p className="text-xl font-bold font-mono text-foreground">
                    {((selected.conversions / selected.scans) * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="rounded-xl border border-border p-3">
                  <p className="text-xs text-muted-foreground">상태</p>
                  <Badge
                    className={`mt-1 text-xs font-semibold border-0 ${
                      selected.status === "진행중"
                        ? "bg-primary/10 text-primary"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {selected.status}
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                발행일: {selected.date}
              </p>
              <Button
                className="w-full gap-2"
                onClick={() => {
                  setSelected(null)
                  router.push("/campaigns")
                }}
              >
                <ExternalLink className="size-4" />
                캠페인 관리 페이지로 이동
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
