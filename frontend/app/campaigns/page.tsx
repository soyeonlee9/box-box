"use client"

import { useState, useEffect } from "react"
import { QRCodeCanvas } from "qrcode.react"
import { Plus, Download, MoreHorizontal, Pencil, Trash2, QrCode, FlaskConical, TrendingUp, ArrowUpRight, GitCompareArrows, MapPin } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { DesktopSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
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

interface Campaign {
  id: number; name: string; url: string; urlB?: string; active: boolean
  scans: number; conversions: number; conversionRate: number; roi: number
  abTest: boolean; createdAt: string
  cpa: number; topRegions: string[]
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const data = await apiFetch("/campaigns")
        setCampaigns(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error("Error fetching campaigns:", err)
        toast.error("캠페인 데이터를 불러오는 데 실패했습니다.")
      } finally {
        setLoading(false)
      }
    }
    fetchCampaigns()
  }, [])

  // Create
  const [createOpen, setCreateOpen] = useState(false)
  const [newName, setNewName] = useState("")
  const [newUrl, setNewUrl] = useState("")
  const [newUrlB, setNewUrlB] = useState("")
  const [abEnabled, setAbEnabled] = useState(false)

  // Edit
  const [editOpen, setEditOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Campaign | null>(null)
  const [editName, setEditName] = useState("")
  const [editUrl, setEditUrl] = useState("")
  const [editUrlB, setEditUrlB] = useState("")
  const [editAbEnabled, setEditAbEnabled] = useState(false)

  // Delete confirm
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Campaign | null>(null)

  // QR preview
  const [qrOpen, setQrOpen] = useState(false)
  const [qrTarget, setQrTarget] = useState<Campaign | null>(null)
  const [qrUrl, setQrUrl] = useState("")

  // Compare
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [compareOpen, setCompareOpen] = useState(false)

  function toggleSelect(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }
  function toggleAll() {
    if (selectedIds.size === campaigns.length) setSelectedIds(new Set())
    else setSelectedIds(new Set(campaigns.map((c) => c.id)))
  }
  const selectedCampaigns = campaigns.filter((c) => selectedIds.has(c.id))

  function handleToggle(id: number) {
    setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)))
    const c = campaigns.find((x) => x.id === id)
    toast.success(c ? `"${c.name}" ${c.active ? "비활성화" : "활성화"} 되었습니다.` : "상태가 변경되었습니다.")
  }

  async function handleCreate() {
    if (!newName.trim() || !newUrl.trim()) return
    try {
      const payload = {
        name: newName.trim(),
        url: newUrl.trim(),
        url_b: abEnabled && newUrlB.trim() ? newUrlB.trim() : undefined,
        is_active: true,
        is_ab_test: abEnabled && !!newUrlB.trim(),
      }
      const data = await apiFetch("/campaigns", {
        method: "POST",
        body: JSON.stringify(payload)
      })
      // 백엔드 반환된 data (스네이크 케이스)를 프론트엔드 카멜 케이스로 변환 (UI 갱신용)
      const next: Campaign = {
        id: data.id, name: data.name, url: data.url, urlB: data.url_b,
        active: data.is_active, scans: 0, conversions: 0, conversionRate: 0, roi: 0,
        abTest: !!data.is_ab_test, createdAt: data.created_at.slice(0, 10),
        cpa: 0, topRegions: [],
      }
      setCampaigns((prev) => [next, ...prev])
      setNewName(""); setNewUrl(""); setNewUrlB(""); setAbEnabled(false); setCreateOpen(false)
      toast.success(`"${next.name}" 캠페인이 생성되었습니다.`)
    } catch (err) {
      toast.error("캠페인 생성 실패")
    }
  }

  function openEdit(c: Campaign) {
    setEditTarget(c);
    setEditName(c.name);
    setEditUrl(c.url);
    setEditUrlB(c.urlB || "");
    setEditAbEnabled(c.abTest);
    setEditOpen(true)
  }

  async function handleEdit() {
    if (!editTarget || !editName.trim()) return
    try {
      const payload = {
        name: editName.trim(),
        url: editUrl.trim(),
        url_b: editAbEnabled && editUrlB.trim() ? editUrlB.trim() : null,
        is_ab_test: editAbEnabled && !!editUrlB.trim(),
      }
      const data = await apiFetch(`/campaigns/${editTarget.id}`, {
        method: "PUT",
        body: JSON.stringify(payload)
      })
      setCampaigns((prev) =>
        prev.map((c) => c.id === editTarget.id ? {
          ...c,
          name: data.name,
          url: data.url,
          urlB: data.url_b,
          abTest: !!data.is_ab_test
        } : c)
      )
      toast.success(`"${editName}" 캠페인이 수정되었습니다.`)
      setEditOpen(false); setEditTarget(null)
    } catch (err) {
      toast.error("캠페인 수정 실패")
    }
  }

  function openDelete(c: Campaign) {
    setDeleteTarget(c); setDeleteOpen(true)
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    try {
      await apiFetch(`/campaigns/${deleteTarget.id}`, { method: "DELETE" })
      setCampaigns((prev) => prev.filter((c) => c.id !== deleteTarget.id))
      toast.success(`"${deleteTarget.name}" 캠페인이 삭제되었습니다.`)
      setDeleteOpen(false); setDeleteTarget(null)
    } catch (err) {
      toast.error("캠페인 삭제에 실패했습니다.")
    }
  }

  function openQr(c: Campaign) {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"
    setQrTarget(c)
    setQrUrl(`${baseUrl}/qr/${c.id}`)
    setQrOpen(true)
  }

  function handleQrDownload() {
    if (!qrTarget) return
    const canvas = document.getElementById("qr-canvas") as HTMLCanvasElement
    if (!canvas) {
      toast.error("QR 코드를 생성할 수 없습니다.")
      return
    }
    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
    const downloadLink = document.createElement("a")
    downloadLink.href = pngUrl
    downloadLink.download = `${qrTarget.name}_qr.png`
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
    toast.success("QR 코드 이미지를 다운로드했습니다.", { description: `${qrTarget.name}` })
    setQrOpen(false)
  }

  const activeCampaigns = campaigns.filter((c) => c.active).length
  const totalScans = campaigns.reduce((s, c) => s + c.scans, 0)
  const avgRoi = campaigns.length > 0 ? Math.round(campaigns.reduce((s, c) => s + c.roi, 0) / campaigns.length) : 0

  return (
    <div className="min-h-screen bg-background">
      <DesktopSidebar />
      <div className="lg:pl-64">
        <DashboardHeader />
        <main className="p-4 lg:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl text-balance">QR 캠페인 관리</h1>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">A/B 테스트와 전환율을 포함한 캠페인 성과를 관리하세요.</p>
            </div>
            <div className="flex items-center gap-2">
              {selectedIds.size >= 2 && (
                <Button variant="outline" onClick={() => setCompareOpen(true)} className="gap-2">
                  <GitCompareArrows className="size-4" />비교 ({selectedIds.size})
                </Button>
              )}
              <Button onClick={() => setCreateOpen(true)} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="size-4" />새 캠페인 생성
              </Button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
            <Card><CardContent className="p-5"><p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">전체 캠페인</p><p className="mt-2 text-3xl font-bold text-foreground font-mono">{campaigns.length}</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">활성 캠페인</p><p className="mt-2 text-3xl font-bold text-primary font-mono">{activeCampaigns}</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">총 스캔 수</p><p className="mt-2 text-3xl font-bold text-foreground font-mono">{totalScans.toLocaleString()}</p></CardContent></Card>
            <Card><CardContent className="p-5"><div className="flex items-center gap-1.5"><p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">평균 ROI</p><TrendingUp className="size-3.5 text-primary" /></div><p className="mt-2 text-3xl font-bold text-primary font-mono">{avgRoi}%</p></CardContent></Card>
          </div>

          <Card className="mt-6">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="pl-5 w-10">
                        <Checkbox
                          checked={selectedIds.size === campaigns.length && campaigns.length > 0}
                          onCheckedChange={toggleAll}
                        />
                      </TableHead>
                      <TableHead>캠페인명</TableHead>
                      <TableHead className="text-center">상태</TableHead>
                      <TableHead className="text-center">A/B</TableHead>
                      <TableHead className="text-right">스캔 수</TableHead>
                      <TableHead className="text-right">전환율</TableHead>
                      <TableHead className="text-right">ROI</TableHead>
                      <TableHead className="text-center pr-5">관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaigns.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="pl-5 w-10">
                          <Checkbox
                            checked={selectedIds.has(c.id)}
                            onCheckedChange={() => toggleSelect(c.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10"><QrCode className="size-4 text-primary" /></div>
                            <div className="min-w-0">
                              <p className="truncate font-medium text-foreground">{c.name}</p>
                              <p className="max-w-[180px] truncate text-xs text-muted-foreground">{c.url}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Switch checked={c.active} onCheckedChange={() => handleToggle(c.id)} />
                            <Badge variant={c.active ? "default" : "secondary"} className={c.active ? "bg-primary/15 text-primary border-0 hover:bg-primary/15" : "text-muted-foreground border-0"}>
                              {c.active ? "활성" : "종료"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {c.abTest ? <Badge className="gap-1 bg-accent/15 text-accent border-0 hover:bg-accent/15"><FlaskConical className="size-3" />A/B</Badge> : <span className="text-xs text-muted-foreground">-</span>}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-foreground tabular-nums font-mono">{c.scans.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <span className="font-semibold text-foreground tabular-nums font-mono">{c.conversionRate}%</span>
                            {c.conversionRate > 15 && <ArrowUpRight className="size-3.5 text-primary" />}
                          </div>
                        </TableCell>
                        <TableCell className="text-right"><span className="font-semibold text-primary tabular-nums font-mono">{c.roi}%</span></TableCell>
                        <TableCell className="text-center pr-5">
                          <div className="flex items-center justify-center gap-1">
                            <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-primary" title="QR 다운로드" onClick={() => openQr(c)}>
                              <Download className="size-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground"><MoreHorizontal className="size-4" /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-36">
                                <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => openEdit(c)}><Pencil className="size-4" />수정</DropdownMenuItem>
                                <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive" onClick={() => openDelete(c)}><Trash2 className="size-4" />삭제</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {campaigns.length === 0 && (
                      <TableRow><TableCell colSpan={8} className="py-12 text-center text-muted-foreground">등록된 캠페인이 없습니다.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>새로운 QR 캠페인 만들기</DialogTitle>
            <DialogDescription>캠페인 정보를 입력하면 QR 코드가 자동으로 생성됩니다.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-2"><Label>캠페인 이름</Label><Input placeholder="예: 26년 여름 클리어런스" value={newName} onChange={(e) => setNewName(e.target.value)} /></div>
            <div className="flex flex-col gap-2"><Label>랜딩 URL {abEnabled ? "(A 버전)" : ""}</Label><Input placeholder="https://..." value={newUrl} onChange={(e) => setNewUrl(e.target.value)} /></div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="flex items-center gap-2">
                <FlaskConical className="size-4 text-primary" />
                <div><p className="text-sm font-medium">A/B 테스트</p><p className="text-xs text-muted-foreground">두 개의 랜딩페이지 성과를 비교</p></div>
              </div>
              <Switch checked={abEnabled} onCheckedChange={setAbEnabled} />
            </div>
            {abEnabled && <div className="flex flex-col gap-2"><Label>랜딩 URL (B 버전)</Label><Input placeholder="https://... (B 페이지)" value={newUrlB} onChange={(e) => setNewUrlB(e.target.value)} /></div>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>취소</Button>
            <Button onClick={handleCreate} disabled={!newName.trim() || !newUrl.trim()}>생성하기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>캠페인 수정</DialogTitle></DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-2"><Label>캠페인 이름</Label><Input value={editName} onChange={(e) => setEditName(e.target.value)} /></div>
            <div className="flex flex-col gap-2"><Label>연결 URL {editAbEnabled ? "(A 버전)" : ""}</Label><Input value={editUrl} onChange={(e) => setEditUrl(e.target.value)} /></div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="flex items-center gap-2">
                <FlaskConical className="size-4 text-primary" />
                <div><p className="text-sm font-medium">A/B 테스트</p><p className="text-xs text-muted-foreground">두 개의 랜딩페이지 성과를 비교</p></div>
              </div>
              <Switch checked={editAbEnabled} onCheckedChange={setEditAbEnabled} />
            </div>
            {editAbEnabled && <div className="flex flex-col gap-2"><Label>연결 URL (B 버전)</Label><Input placeholder="https://... (B 페이지)" value={editUrlB} onChange={(e) => setEditUrlB(e.target.value)} /></div>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>취소</Button>
            <Button onClick={handleEdit} disabled={!editName.trim()}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>캠페인 삭제</DialogTitle>
            <DialogDescription>
              {deleteTarget ? `"${deleteTarget.name}" 캠페인을 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.` : ""}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>취소</Button>
            <Button variant="destructive" onClick={confirmDelete}>삭제하기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Campaign Comparison Modal */}
      <Dialog open={compareOpen} onOpenChange={setCompareOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GitCompareArrows className="size-5 text-primary" />
              캠페인 비교 ({selectedCampaigns.length}개)
            </DialogTitle>
            <DialogDescription>선택한 캠페인의 핵심 지표를 비교합니다.</DialogDescription>
          </DialogHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground min-w-[120px]">지표</th>
                  {selectedCampaigns.map((c) => (
                    <th key={c.id} className="text-center py-3 px-3 text-xs font-semibold text-foreground min-w-[140px]">{c.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "총 스캔 수", key: "scans" as const, fmt: (v: number) => v.toLocaleString() + "회" },
                  { label: "전환율", key: "conversionRate" as const, fmt: (v: number) => v + "%" },
                  { label: "ROI", key: "roi" as const, fmt: (v: number) => v + "%" },
                  { label: "CPA", key: "cpa" as const, fmt: (v: number) => "₩" + v.toLocaleString() },
                  { label: "전환 수", key: "conversions" as const, fmt: (v: number) => v.toLocaleString() + "건" },
                ].map((metric) => {
                  const values = selectedCampaigns.map((c) => c[metric.key])
                  const best = metric.key === "cpa" ? Math.min(...values) : Math.max(...values)
                  return (
                    <tr key={metric.label} className="border-b border-border/50">
                      <td className="py-3 px-3 text-xs font-medium text-muted-foreground">{metric.label}</td>
                      {selectedCampaigns.map((c) => {
                        const val = c[metric.key]
                        const isBest = val === best
                        return (
                          <td key={c.id} className="py-3 px-3 text-center">
                            <span className={`font-bold font-mono ${isBest ? "text-primary" : "text-foreground"}`}>
                              {metric.fmt(val)}
                            </span>
                            {isBest && <Badge className="ml-1.5 bg-primary/10 text-primary border-0 text-[9px] px-1.5">Best</Badge>}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
                {/* Top 5 Regions row */}
                <tr>
                  <td className="py-3 px-3 text-xs font-medium text-muted-foreground align-top">Top 5 지역</td>
                  {selectedCampaigns.map((c) => (
                    <td key={c.id} className="py-3 px-3">
                      <div className="flex flex-col gap-1">
                        {c.topRegions.map((region, i) => (
                          <div key={region} className="flex items-center gap-1.5 text-xs">
                            <span className="flex size-4 items-center justify-center rounded-full bg-primary/10 text-[9px] font-bold text-primary">{i + 1}</span>
                            <span className="text-foreground">{region}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompareOpen(false)}>닫기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* QR Preview/Download Dialog */}
      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>QR 코드 미리보기</DialogTitle></DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="flex size-48 items-center justify-center rounded-2xl border-2 border-dashed border-border bg-secondary p-4">
              {qrUrl ? (
                <QRCodeCanvas
                  id="qr-canvas"
                  value={qrUrl}
                  size={150}
                  level="H"
                  includeMargin={false}
                />
              ) : (
                <QrCode className="size-24 text-muted-foreground" />
              )}
            </div>
            <p className="text-sm font-medium text-foreground text-center">{qrTarget?.name}</p>
            <div className="flex flex-col items-center w-full px-4 gap-1">
              <span className="text-xs font-semibold text-primary">스캔 시 이동될 시스템 URL</span>
              <p className="text-xs text-muted-foreground text-center break-all">{qrUrl}</p>
            </div>
            <div className="flex flex-col items-center w-full px-4 gap-1 mt-2">
              <span className="text-xs font-semibold text-muted-foreground">최종 도착지 URL</span>
              <p className="text-xs text-muted-foreground text-center break-all">{qrTarget?.url}</p>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-col gap-2">
            <Button className="w-full gap-2" onClick={handleQrDownload}><Download className="size-4" />PNG 다운로드</Button>
            <Button variant="outline" className="w-full" onClick={() => setQrOpen(false)}>닫기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
