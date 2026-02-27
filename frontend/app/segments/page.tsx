"use client"

import { useState, useEffect } from "react"
import { apiFetch } from "@/lib/api"
import {
  Crown,
  Heart,
  Sprout,
  UserPlus,
  AlertTriangle,
  UserX,
  Plus,
  Trash2,
  ChevronDown,
  Users,
  TrendingUp,
  QrCode,
  Gift,
  ArrowUpRight,
  Eye,
} from "lucide-react"
import { DesktopSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { InfoTooltip, GLOSSARY } from "@/components/ui/info-tooltip"

/* ── Icon Mapping ── */
const iconMap: Record<string, any> = {
  Crown, Heart, Sprout, UserPlus, AlertTriangle, UserX,
}

/* ── Custom Segments ── */
interface CustomSegment {
  id: number
  name: string
  condition: string
  badge: string
  users: number
}

/* ── Badges for custom segment creation ── */
const availableBadges = [
  "VIP Royalty", "벚꽃 배지", "얼리버드", "첫 구매", "리뷰어", "시크릿 멤버", "이벤트 참여",
]

export default function SegmentsPage() {
  const [rfmSegments, setRfmSegments] = useState<any[]>([])
  const [customSegments, setCustomSegments] = useState<CustomSegment[]>([])
  const [totalUsers, setTotalUsers] = useState<number>(0)
  const [avgClv, setAvgClv] = useState<string>("₩0")
  const [loading, setLoading] = useState(true)

  const [createOpen, setCreateOpen] = useState(false)
  const [newSegName, setNewSegName] = useState("")
  const [newSegBadge, setNewSegBadge] = useState("")
  const [detailSeg, setDetailSeg] = useState<any | null>(null)

  useEffect(() => {
    async function fetchSegments() {
      try {
        const data = await apiFetch("/analytics/segments")
        if (data) {
          setRfmSegments(data.rfmSegments || [])
          setCustomSegments(data.customSegments || [])
          setTotalUsers(data.totalUsers || 0)
          setAvgClv(data.avgClv || "₩0")
        }
      } catch (err) {
        console.error("Error fetching segments:", err)
        toast.error("데이터를 불러오는 데 실패했습니다.")
      } finally {
        setLoading(false)
      }
    }
    fetchSegments()
  }, [])

  function handleCreateCustom() {
    if (!newSegName.trim() || !newSegBadge) return
    const seg: CustomSegment = {
      id: Date.now(),
      name: newSegName.trim(),
      condition: "배지 보유",
      badge: newSegBadge,
      users: Math.floor(Math.random() * 400) + 50,
    }
    setCustomSegments((prev) => [...prev, seg])
    toast.success(`"${seg.name}" 커스텀 세그먼트가 생성되었습니다.`)
    setNewSegName("")
    setNewSegBadge("")
    setCreateOpen(false)
  }

  function deleteCustom(id: number) {
    setCustomSegments((prev) => prev.filter((s) => s.id !== id))
    toast.success("세그먼트가 삭제되었습니다.")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <p className="text-muted-foreground animate-pulse">고객 데이터를 분석하고 있습니다...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DesktopSidebar />
      <div className="lg:pl-64">
        <DashboardHeader />
        <main className="p-4 lg:p-6">
          {/* Title */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl text-balance">
                {"\uACE0\uAC1D \uADF8\uB8F9"}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                {"\uACE0\uAC1D\uC744 \uD2B9\uC131\uBCC4\uB85C \uBD84\uB958\uD558\uC5EC \uD0C0\uAC9F \uB9C8\uCF00\uD305\uC744 \uC2E4\uD589\uD558\uC138\uC694."}
              </p>
            </div>
            <Button onClick={() => setCreateOpen(true)} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="size-4" />커스텀 세그먼트
            </Button>
          </div>

          {/* Overview KPI */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
            <Card>
              <CardContent className="p-5">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">전체 고객</p>
                <p className="mt-2 text-3xl font-bold text-foreground font-mono">{totalUsers.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">RFM 세그먼트</p>
                <p className="mt-2 text-3xl font-bold text-primary font-mono">6</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">커스텀 세그먼트</p>
                <p className="mt-2 text-3xl font-bold text-foreground font-mono">{customSegments.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">평균 CLV</p>
                <p className="mt-2 text-3xl font-bold text-primary font-mono">₩367K</p>
              </CardContent>
            </Card>
          </div>

          {/* RFM Segments Grid */}
          <div className="mt-8 flex items-center gap-2">
            <h2 className="text-lg font-bold text-foreground">RFM 자동 세그먼트</h2>
            <InfoTooltip content={GLOSSARY.rfm} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">고객의 최근 방문(R), 방문 빈도(F), 구매 금액(M)을 기준으로 자동 분류된 고객 그룹입니다.</p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {rfmSegments.map((seg) => {
              const IconComponent = iconMap[seg.iconType] || Crown;
              return (
                <Card
                  key={seg.id}
                  className={cn("relative transition-all hover:shadow-md", seg.border)}
                >
                  <CardContent className="p-5">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                      <div className={cn("flex size-10 items-center justify-center rounded-lg", seg.bg)}>
                        <IconComponent className={cn("size-5", seg.color)} />
                      </div>
                      <div>
                        <p className="text-base font-bold text-foreground">{seg.nameKr} ({seg.users.toLocaleString()}{"\uBA85"})</p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {seg.tags.map((tag: string) => (
                        <span key={tag} className={cn("text-xs font-medium px-2 py-0.5 rounded-full", seg.bg, seg.color)}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Description */}
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{seg.description}</p>

                    {/* Action Button */}
                    <Button
                      className="mt-4 w-full gap-2"
                      variant={seg.actionType === "winback" ? "destructive" : seg.actionType === "vip" ? "default" : "outline"}
                      onClick={(e) => {
                        e.stopPropagation()
                        toast.success(`"${seg.nameKr}" ${"\uADF8\uB8F9\uC5D0\uAC8C \uBA54\uC2DC\uC9C0\uB97C \uC900\uBE44 \uC911\uC785\uB2C8\uB2E4."}`)
                      }}
                    >
                      {seg.actionLabel}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Custom Segments */}
          <h2 className="mt-8 text-lg font-bold text-foreground">커스텀 세그먼트</h2>
          <p className="mt-1 text-sm text-muted-foreground">{"\uBC30\uC9C0 \uC18C\uC720 + \uC0AC\uC6A9\uC790 \uC815\uC758 \uC870\uAC74\uC73C\uB85C \uC0DD\uC131\uD55C \uC138\uADF8\uBA3C\uD2B8\uC785\uB2C8\uB2E4."}</p>
          <Card className="mt-4">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="pl-5">세그먼트명</TableHead>
                      <TableHead>조건</TableHead>
                      <TableHead>배지</TableHead>
                      <TableHead className="text-right">고객 수</TableHead>
                      <TableHead className="text-center pr-5 w-20">관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customSegments.map((seg) => (
                      <TableRow key={seg.id}>
                        <TableCell className="pl-5 font-medium text-foreground">{seg.name}</TableCell>
                        <TableCell className="text-muted-foreground">{seg.condition}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">{seg.badge}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold font-mono">{seg.users.toLocaleString()}</TableCell>
                        <TableCell className="text-center pr-5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-muted-foreground hover:text-destructive"
                            onClick={() => deleteCustom(seg.id)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {customSegments.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">커스텀 세그먼트가 없습니다.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>


        </main>
      </div>

      {/* Create Custom Segment Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>커스텀 세그먼트 생성</DialogTitle>
            <DialogDescription>배지 소유 조건으로 고객 그룹을 생성합니다.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-2">
              <Label>세그먼트 이름</Label>
              <Input placeholder="예: VIP 배지 보유자" value={newSegName} onChange={(e) => setNewSegName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>배지 조건</Label>
              <Select value={newSegBadge} onValueChange={setNewSegBadge}>
                <SelectTrigger><SelectValue placeholder="배지를 선택하세요" /></SelectTrigger>
                <SelectContent>
                  {availableBadges.map((b) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>취소</Button>
            <Button onClick={handleCreateCustom} disabled={!newSegName.trim() || !newSegBadge}>생성</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Segment Detail Dialog */}
      <Dialog open={!!detailSeg} onOpenChange={(o) => !o && setDetailSeg(null)}>
        <DialogContent className="sm:max-w-lg">
          {detailSeg && (() => {
            const DetailIcon = iconMap[detailSeg.iconType] || Crown;
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <div className={cn("flex size-8 items-center justify-center rounded-lg", detailSeg.bg)}>
                      <DetailIcon className={cn("size-4", detailSeg.color)} />
                    </div>
                    {detailSeg.nameKr} ({detailSeg.name})
                  </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-2">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl border border-border p-3 text-center">
                      <Users className="mx-auto size-4 text-muted-foreground mb-1" />
                      <p className="text-lg font-bold font-mono text-foreground">{detailSeg.users.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground">고객 수</p>
                    </div>
                    <div className="rounded-xl border border-border p-3 text-center">
                      <TrendingUp className="mx-auto size-4 text-primary mb-1" />
                      <p className="text-lg font-bold font-mono text-primary">{detailSeg.clv}</p>
                      <p className="text-[10px] text-muted-foreground">CLV</p>
                    </div>
                    <div className="rounded-xl border border-border p-3 text-center">
                      <ArrowUpRight className="mx-auto size-4 text-muted-foreground mb-1" />
                      <p className="text-lg font-bold font-mono text-foreground">{detailSeg.pctTotal}%</p>
                      <p className="text-[10px] text-muted-foreground">전체 비율</p>
                    </div>
                  </div>
                  <div className="rounded-xl border border-border p-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">RFM 범위</p>
                    <p className="text-sm font-mono font-medium text-foreground">{detailSeg.rfmRange}</p>
                  </div>
                  <div className="rounded-xl border border-border p-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">주요 캠페인</p>
                    <div className="flex flex-wrap gap-1.5">
                      {detailSeg.topCampaigns.map((c: string) => (
                        <Badge key={c} variant="outline" className="text-xs gap-1"><QrCode className="size-3" />{c}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl border border-border p-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">선호 리워드</p>
                    <div className="flex flex-wrap gap-1.5">
                      {detailSeg.preferredRewards.map((r: string) => (
                        <Badge key={r} variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20 gap-1"><Gift className="size-3" />{r}</Badge>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed rounded-xl bg-secondary/50 p-3">
                    {detailSeg.description}
                  </p>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDetailSeg(null)}>닫기</Button>
                </DialogFooter>
              </>
            )
          })}
        </DialogContent>
      </Dialog>
    </div>
  )
}
