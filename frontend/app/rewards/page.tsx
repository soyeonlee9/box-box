"use client"

import { useState, useEffect } from "react"
import { DesktopSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle } from "lucide-react"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { apiFetch } from "@/lib/api"
import { Plus, MoreHorizontal, Pencil, Trash2, Award, Gift, Image as ImageIcon } from "lucide-react"

interface BadgeItem {
  id: string; name: string; description: string; image_url: string; trigger_condition: any; created_at: string;
}

interface RewardItem {
  id: string; title: string; description: string; code: string; is_used: boolean; used_at: string; expires_at: string; created_at: string;
  user_id: string; badge_id: string;
}

export default function RewardsBadgesPage() {
  const [badges, setBadges] = useState<BadgeItem[]>([])
  const [rewards, setRewards] = useState<RewardItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [badgesData, rewardsData] = await Promise.all([
          apiFetch("/badges"),
          apiFetch("/rewards")
        ])
        setBadges(badgesData || [])
        setRewards(rewardsData || [])
      } catch (err) {
        console.error("Error fetching badges/rewards:", err)
        toast.error("데이터를 불러오는 데 실패했습니다.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  /* ─── Badge Logic ─── */
  const [createBadgeOpen, setCreateBadgeOpen] = useState(false)
  const [bName, setBName] = useState("")
  const [bDesc, setBDesc] = useState("")
  const [bImage, setBImage] = useState("")
  const [bCondition, setBCondition] = useState("")

  const [editBadgeOpen, setEditBadgeOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<BadgeItem | null>(null)

  const [deleteBadgeOpen, setDeleteBadgeOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<BadgeItem | null>(null)

  async function handleCreateBadge() {
    if (!bName.trim()) return
    let parsedCondition = {}
    if (bCondition.trim()) {
      try {
        parsedCondition = JSON.parse(bCondition)
      } catch (e) {
        toast.error("획득 조건은 올바른 JSON 형식이어야 합니다.")
        return
      }
    }

    try {
      const payload = {
        name: bName.trim(),
        description: bDesc.trim(),
        image_url: bImage.trim() || undefined,
        trigger_condition: parsedCondition
      }
      const data = await apiFetch("/badges", {
        method: "POST",
        body: JSON.stringify(payload)
      })
      setBadges((prev) => [data, ...prev])
      setCreateBadgeOpen(false)
      setBName(""); setBDesc(""); setBImage(""); setBCondition("")
      toast.success("새로운 배지가 생성되었습니다.")
    } catch (err) {
      toast.error("배지 생성 실패")
    }
  }

  function openEditBadge(b: BadgeItem) {
    setEditTarget(b); setBName(b.name); setBDesc(b.description || ""); setBImage(b.image_url || "");
    setBCondition(b.trigger_condition ? JSON.stringify(b.trigger_condition) : "");
    setEditBadgeOpen(true)
  }

  async function handleEditBadge() {
    if (!editTarget || !bName.trim()) return
    let parsedCondition = {}
    if (bCondition.trim()) {
      try { parsedCondition = JSON.parse(bCondition) } catch (e) { toast.error("JSON 형식 에러"); return }
    }
    try {
      const payload = { name: bName.trim(), description: bDesc.trim(), image_url: bImage.trim(), trigger_condition: parsedCondition }
      const data = await apiFetch(`/badges/${editTarget.id}`, { method: "PUT", body: JSON.stringify(payload) })
      setBadges((prev) => prev.map(b => b.id === editTarget.id ? data : b))
      setEditBadgeOpen(false); setEditTarget(null)
      toast.success("배지 정보가 수정되었습니다.")
    } catch (err) { toast.error("배지 수정 실패") }
  }

  function openDeleteBadge(b: BadgeItem) { setDeleteTarget(b); setDeleteBadgeOpen(true) }

  async function confirmDeleteBadge() {
    if (!deleteTarget) return
    try {
      await apiFetch(`/badges/${deleteTarget.id}`, { method: "DELETE" })
      setBadges((prev) => prev.filter(b => b.id !== deleteTarget.id))
      setDeleteBadgeOpen(false); setDeleteTarget(null)
      toast.success("배지가 삭제되었습니다.")
    } catch (err) { toast.error("삭제 실패") }
  }

  const safeRewards = Array.isArray(rewards) ? rewards : []
  const safeBadges = Array.isArray(badges) ? badges : []

  const totalRewardsIssued = safeRewards.length
  const totalRewardsUsed = safeRewards.filter(r => r?.is_used).length

  return (
    <div className="min-h-screen bg-background">
      <DesktopSidebar />
      <div className="lg:pl-64">
        <DashboardHeader />
        <main className="p-4 lg:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl text-balance">배지 & 리워드 관리</h1>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">캠페인 참여 독려를 위한 3D 배지 및 실물 쿠폰(리워드)을 관리하세요.</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4 mb-6">
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Award className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">생성된 배지 종류</p>
                  <p className="text-xl font-bold text-foreground">{safeBadges.length}개</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-chart-3/10">
                  <Gift className="size-5 text-chart-3" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">리워드 발급 건수</p>
                  <p className="text-xl font-bold text-foreground">{totalRewardsIssued.toLocaleString()}건</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-chart-4/10">
                  <CheckCircle className="size-5 text-chart-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">리워드 사용률</p>
                  <p className="text-xl font-bold text-foreground">
                    {totalRewardsIssued > 0 ? Math.round((totalRewardsUsed / totalRewardsIssued) * 100) : 0}%
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="badges" className="w-full">
            <TabsList className="w-full max-w-sm grid grid-cols-2">
              <TabsTrigger value="badges" className="gap-2"><Award className="size-4" />배지(Badge) 설계</TabsTrigger>
              <TabsTrigger value="rewards" className="gap-2"><Gift className="size-4" />리워드 발급 내역</TabsTrigger>
            </TabsList>

            {/* Badges Tab */}
            <TabsContent value="badges" className="mt-6">
              <Card>
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                  <div>
                    <CardTitle className="text-lg">배지 목록</CardTitle>
                    <CardDescription className="mt-1">조건 달성 시 유저에게 지급되는 디지털 배지입니다.</CardDescription>
                  </div>
                  <Button onClick={() => { setBName(""); setBDesc(""); setBImage(""); setBCondition(""); setCreateBadgeOpen(true) }} className="gap-2">
                    <Plus className="size-4" />배지 만들기
                  </Button>
                </div>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="pl-6 w-16">이미지</TableHead>
                        <TableHead>배지 이름 및 설명</TableHead>
                        <TableHead>획득 조건</TableHead>
                        <TableHead className="text-right">생성일</TableHead>
                        <TableHead className="text-center pr-6 w-24">관리</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {safeBadges.map((b) => (
                        <TableRow key={b.id}>
                          <TableCell className="pl-6">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-secondary/50 border border-border overflow-hidden">
                              {b.image_url ? <img src={b.image_url} alt={b.name} className="size-full object-cover" /> : <ImageIcon className="size-5 text-muted-foreground" />}
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="font-semibold text-foreground">{b.name}</p>
                            <p className="text-xs text-muted-foreground max-w-sm">{b.description}</p>
                          </TableCell>
                          <TableCell>
                            {b.trigger_condition && Object.keys(b.trigger_condition).length > 0 ? (
                              <Badge variant="outline" className="font-mono text-[10px] bg-secondary/30">
                                {JSON.stringify(b.trigger_condition)}
                              </Badge>
                            ) : <span className="text-xs text-muted-foreground">-</span>}
                          </TableCell>
                          <TableCell className="text-right text-xs text-muted-foreground">{new Date(b.created_at).toLocaleDateString()}</TableCell>
                          <TableCell className="text-center pr-6">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="size-8"><MoreHorizontal className="size-4" /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => openEditBadge(b)}><Pencil className="size-4" />수정</DropdownMenuItem>
                                <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive" onClick={() => openDeleteBadge(b)}><Trash2 className="size-4" />삭제</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                      {!loading && safeBadges.length === 0 && (
                        <TableRow><TableCell colSpan={5} className="py-12 text-center text-muted-foreground">등록된 배지가 없습니다.</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Rewards Tab */}
            <TabsContent value="rewards" className="mt-6">
              <Card>
                <div className="px-6 py-4 border-b border-border">
                  <CardTitle className="text-lg">리워드(쿠폰) 누적 발급 내역</CardTitle>
                  <CardDescription className="mt-1">배지 획득 등에 의해 특정 유저에게 지급된 실제 리워드 사용 내역 리스트입니다.</CardDescription>
                </div>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="pl-6">리워드 명</TableHead>
                        <TableHead>쿠폰 코드</TableHead>
                        <TableHead>사용여부</TableHead>
                        <TableHead>만료일</TableHead>
                        <TableHead className="text-right pr-6">발급일</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {safeRewards.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell className="pl-6">
                            <p className="font-semibold text-foreground text-sm">{r.title}</p>
                            <p className="text-xs text-muted-foreground">{r.description || "-"}</p>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="font-mono uppercase tracking-widest text-xs bg-muted text-foreground border-border">{r.code}</Badge>
                          </TableCell>
                          <TableCell>
                            {r.is_used ? (
                              <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"><CheckCircle className="size-3.5" />사용됨</span>
                            ) : (
                              <span className="flex items-center gap-1.5 text-xs font-semibold text-primary"><XCircle className="size-3.5" />미사용</span>
                            )}
                          </TableCell>
                          <TableCell className="text-xs">{r.expires_at ? new Date(r.expires_at).toLocaleDateString() : "-"}</TableCell>
                          <TableCell className="text-right pr-6 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                      {!loading && safeRewards.length === 0 && (
                        <TableRow><TableCell colSpan={5} className="py-12 text-center text-muted-foreground">발급된 리워드가 없습니다.</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Badge Modals */}
      <Dialog open={createBadgeOpen || editBadgeOpen} onOpenChange={(open) => { if (!open) { setCreateBadgeOpen(false); setEditBadgeOpen(false) } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editBadgeOpen ? "배지 수정" : "새 배지 만들기"}</DialogTitle>
            <DialogDescription>유저가 스캔 시 획득할 수 있는 3D 배지 에셋을 연결하세요.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-2"><Label>배지 이름 *</Label><Input value={bName} onChange={(e) => setBName(e.target.value)} placeholder="예: 첫 방문자 달성" /></div>
            <div className="flex flex-col gap-2"><Label>설명</Label><Textarea value={bDesc} onChange={(e) => setBDesc(e.target.value)} rows={2} placeholder="배지에 대한 설명을 적어주세요." /></div>
            <div className="flex flex-col gap-2"><Label>이미지 URL (선택)</Label><Input value={bImage} onChange={(e) => setBImage(e.target.value)} placeholder="https://..." /></div>
            <div className="flex flex-col gap-2">
              <Label>획득 조건 (JSON) (선택)</Label>
              <Input value={bCondition} onChange={(e) => setBCondition(e.target.value)} placeholder='예: {"scan_count": 3}' className="font-mono text-xs" />
              <p className="text-[10px] text-muted-foreground">시스템 라우터가 발급 조건을 판별하는 JSON 포맷입니다.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setCreateBadgeOpen(false); setEditBadgeOpen(false) }}>취소</Button>
            <Button onClick={editBadgeOpen ? handleEditBadge : handleCreateBadge} disabled={!bName.trim()} className="bg-primary text-primary-foreground">저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteBadgeOpen} onOpenChange={setDeleteBadgeOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>배지 삭제</DialogTitle>
            <DialogDescription>정말 이 배지를 삭제하시겠습니까? 관련 데이터가 지워질 수 있습니다.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteBadgeOpen(false)}>취소</Button>
            <Button variant="destructive" onClick={confirmDeleteBadge}>삭제하기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
