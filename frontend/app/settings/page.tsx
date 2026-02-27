"use client"

import { useState } from "react"
import Image from "next/image"
import {
  User,
  Building2,
  BellRing,
  Users,
  Code2,
  Camera,
  Copy,
  Plus,
  Trash2,
  Pencil,
  Eye,
  EyeOff,
  Check,
  Globe,
  Key,
  Webhook,
  Shield,
  RefreshCw,
  CreditCard,
  Download,
  Zap,
  Crown,
  BarChart3,
  ArrowRightLeft,
  ArrowRight,
  Factory,
} from "lucide-react"
import { DesktopSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { InfoTooltip, GLOSSARY } from "@/components/ui/info-tooltip"
import { useAuthStore } from "@/store/useAuthStore"

/* ─── data ─── */
const tabs = [
  { id: "profile", label: "프로필", icon: User },
  { id: "brand", label: "브랜드", icon: Building2 },
  { id: "notifications", label: "알림", icon: BellRing },
  { id: "team", label: "팀 관리", icon: Users },
  { id: "billing", label: "빌링", icon: CreditCard },
] as const

type TabId = (typeof tabs)[number]["id"]

const teamMembers = [
  { name: "김민수", email: "minsu@brand.com", role: "Admin", lastAccess: "2026-02-25", avatar: "" },
  { name: "이수진", email: "sujin@brand.com", role: "Editor", lastAccess: "2026-02-24", avatar: "" },
  { name: "박지훈", email: "jihoon@brand.com", role: "Viewer", lastAccess: "2026-02-20", avatar: "" },
  { name: "최윤아", email: "yuna@brand.com", role: "Editor", lastAccess: "2026-02-23", avatar: "" },
]

const apiKeys = [
  { id: "ak_1", name: "Production Key", key: "ak_live_s8Kd...xT2m", created: "2026-01-10", active: true },
  { id: "ak_2", name: "Staging Key", key: "ak_test_p3Lw...rN9k", created: "2026-02-01", active: true },
]

const webhooks = [
  { id: "wh_1", url: "https://api.brand.com/webhooks/scan", events: ["qr.scanned", "badge.earned"], status: "active", lastSuccess: "2분 전" },
  { id: "wh_2", url: "https://hooks.slack.com/archetype", events: ["reward.issued"], status: "failed", lastSuccess: "1시간 전" },
]

/* ─── page ─── */
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("profile")
  const { user } = useAuthStore()

  return (
    <div className="min-h-screen bg-background">
      <DesktopSidebar />
      <div className="lg:pl-64">
        <DashboardHeader />
        <main className="p-4 lg:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl text-balance">설정</h1>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              계정, 브랜드, 알림 등 전반적인 설정을 관리합니다.
            </p>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Vertical tab nav */}
            <nav className="w-full shrink-0 lg:w-56">
              <Card className="p-1.5">
                <ul className="flex gap-1 lg:flex-col overflow-x-auto lg:overflow-visible">
                  {tabs.map((tab) => (
                    <li key={tab.id}>
                      <button
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                          "flex w-full items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                          activeTab === tab.id
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                        )}
                      >
                        <tab.icon className="size-4 shrink-0" />
                        {tab.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </Card>
            </nav>

            {/* Tab content */}
            <div className="flex-1 min-w-0">
              {activeTab === "profile" && <ProfileTab user={user} />}
              {activeTab === "brand" && <BrandTab />}
              {activeTab === "notifications" && <NotificationsTab />}
              {activeTab === "team" && <TeamTab />}
              {activeTab === "billing" && <BillingTab />}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════
   1. Profile Tab
   ═══════════════════════════════════ */
function ProfileTab({ user }: { user: any }) {
  const [showPw, setShowPw] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      {/* Avatar + Name */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">기본 정보</CardTitle>
          <CardDescription>프로필 사진과 이름을 수정합니다.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <Avatar className="size-20 border-2 border-border">
                <AvatarImage
                  src={user?.avatar_url || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E1%84%91%E1%85%B3%E1%84%85%E1%85%A9%E1%84%91%E1%85%B5%E1%86%AF%E1%84%89%E1%85%A1%E1%84%8C%E1%85%B5%E1%86%AB-jY7AiQ4Ww9J3etaLCK6zvrAnzRpZE7.png"}
                  alt="프로필"
                />
                <AvatarFallback className="bg-primary text-xl text-primary-foreground">
                  {user?.name?.slice(0, 2).toUpperCase() || "BM"}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 flex size-7 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground hover:bg-primary/90">
                <Camera className="size-3.5" />
              </button>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">프로필 사진</p>
              <p className="text-xs text-muted-foreground">JPG, PNG 최대 2MB</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">이름</Label>
              <Input id="name" defaultValue={user?.name || "Brand Manager"} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">이메일 주소</Label>
              <Input id="email" defaultValue={user?.email || "manager@brand.com"} readOnly className="bg-muted text-muted-foreground cursor-not-allowed" />
            </div>
          </div>

          <div className="flex justify-end">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => toast.success("프로필이 저장되었습니다.")}>변경사항 저장</Button>
          </div>
        </CardContent>
      </Card>

      {/* Password */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">비밀번호 변경</CardTitle>
          <CardDescription>보안을 위해 주기적으로 변경하세요.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="pw-current">현재 비밀번호</Label>
              <div className="relative">
                <Input id="pw-current" type={showPw ? "text" : "password"} placeholder="********" />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="pw-new">새 비밀번호</Label>
              <Input id="pw-new" type="password" placeholder="********" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="pw-confirm">새 비밀번호 확인</Label>
              <Input id="pw-confirm" type="password" placeholder="********" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => toast.success("비밀번호가 변경되었습니다.")}>비밀번호 변경</Button>
          </div>
        </CardContent>
      </Card>

      {/* Language & Timezone */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">언어 및 시간대</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label>언어 (Language)</Label>
            <Select defaultValue="ko">
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ko">한국어</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>시간대 (Timezone)</Label>
            <Select defaultValue="asia-seoul">
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="asia-seoul">Asia/Seoul (UTC+9)</SelectItem>
                <SelectItem value="america-ny">America/New_York (UTC-5)</SelectItem>
                <SelectItem value="europe-london">Europe/London (UTC+0)</SelectItem>
                <SelectItem value="asia-tokyo">Asia/Tokyo (UTC+9)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ═══════════════════════════════════
   2. Brand Tab
   ═══════════════════════════════════ */
function BrandTab() {
  const [useCustomLogo, setUseCustomLogo] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">브랜드 정보</CardTitle>
          <CardDescription>브랜드 로고, 이름, 웹사이트를 관리합니다.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="flex size-20 items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted">
                <Building2 className="size-8 text-muted-foreground" />
              </div>
              <button className="absolute bottom-0 right-0 flex size-7 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground hover:bg-primary/90">
                <Camera className="size-3.5" />
              </button>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">브랜드 로고</p>
              <p className="text-xs text-muted-foreground">SVG, PNG 권장 (최대 1MB)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="brand-name">브랜드 이름</Label>
              <Input id="brand-name" defaultValue="ARCHETYPE" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="brand-website">웹사이트</Label>
              <Input id="brand-website" defaultValue="https://archetype.com" placeholder="https://" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => toast.success("브랜드 정보가 저장되었습니다.")}>저장</Button>
          </div>
        </CardContent>
      </Card>

      {/* White Label */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">화이트 라벨 설정</CardTitle>
            <Badge variant="outline" className="text-xs font-medium">고급</Badge>
          </div>
          <CardDescription>
            자체 도메인과 로고로 대시보드를 커스터마이징합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="custom-domain">커스텀 도메인</Label>
            <div className="flex items-center gap-2">
              <Globe className="size-4 text-muted-foreground shrink-0" />
              <Input id="custom-domain" placeholder="analytics.mybrand.com" className="flex-1" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {'DNS 설정에서 CNAME 레코드를 '}
              <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">cname.archetype-insights.com</code>
              {'으로 연결하세요.'}
            </p>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-foreground">대시보드에 브랜드 로고 적용</span>
              <span className="text-xs text-muted-foreground">좌측 상단 로고를 업로드한 브랜드 로고로 대체합니다.</span>
            </div>
            <Switch checked={useCustomLogo} onCheckedChange={setUseCustomLogo} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ═══════════════════════════════════
   3. Notifications Tab
   ═══════════════════════════════════ */
function NotificationsTab() {
  const [emailOn, setEmailOn] = useState(true)
  const [inAppOn, setInAppOn] = useState(true)

  const events = [
    { label: "주간 성과 요약 리포트", desc: "매주 월요일 아침, 지난주 성과 요약 이메일", emailDefault: true, inAppDefault: false },
    { label: "\uCE94\uD398\uC778 \uBAA9\uD45C \uB2EC\uC131 \uC2DC", desc: "\uC2A4\uCE94 \uC218 \uB610\uB294 \uC804\uD658 \uC218 \uBAA9\uD45C \uB2EC\uC131 \uC2DC \uC54C\uB9BC", emailDefault: true, inAppDefault: true },
    { label: "\uC0C8 \uBC30\uC9C0 \uD68D\uB4DD \uACE0\uAC1D \uBC1C\uC0DD", desc: "\uACE0\uAC1D\uC774 \uC0C8\uB85C\uC6B4 \uC885\uB958\uC758 \uBC30\uC9C0\uB97C \uCC98\uC74C \uD68D\uB4DD\uD588\uC744 \uB54C", emailDefault: false, inAppDefault: true },
    { label: "중요 공지 및 업데이트", desc: "서비스 관련 중요 공지사항", emailDefault: true, inAppDefault: true },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Channels */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">알림 채널</CardTitle>
          <CardDescription>알림을 받을 채널을 선택합니다.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-foreground">이메일 알림</span>
              <span className="text-xs text-muted-foreground">manager@brand.com으로 알림을 받습니다.</span>
            </div>
            <Switch checked={emailOn} onCheckedChange={setEmailOn} />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-foreground">인앱 알림</span>
              <span className="text-xs text-muted-foreground">대시보드 내 알림 센터로 알림을 받습니다.</span>
            </div>
            <Switch checked={inAppOn} onCheckedChange={setInAppOn} />
          </div>
        </CardContent>
      </Card>

      {/* Event subscriptions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">이벤트별 알림</CardTitle>
          <CardDescription>각 이벤트에 대해 받을 알림 유형을 설정합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">이벤트</TableHead>
                  <TableHead className="text-center w-24">이메일</TableHead>
                  <TableHead className="text-center w-24">인앱</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((ev) => (
                  <TableRow key={ev.label}>
                    <TableCell>
                      <span className="block text-sm font-medium text-foreground">{ev.label}</span>
                      <span className="block text-xs text-muted-foreground">{ev.desc}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch defaultChecked={ev.emailDefault} disabled={!emailOn} />
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch defaultChecked={ev.inAppDefault} disabled={!inAppOn} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ═══════════════════════════════════
   4. Team Tab
   ═══════════════════════════════════ */
function TeamTab() {
  const [inviteOpen, setInviteOpen] = useState(false)

  const roleColor: Record<string, string> = {
    Admin: "bg-primary/10 text-primary border-primary/20",
    Editor: "bg-accent/10 text-accent border-accent/20",
    Viewer: "bg-muted text-muted-foreground border-border",
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">팀 멤버</CardTitle>
            <CardDescription>대시보드에 접근할 수 있는 멤버를 관리합니다.</CardDescription>
          </div>
          <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="size-4" />
                멤버 초대
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>새 멤버 초대</DialogTitle>
                <DialogDescription>초대할 팀원의 이메일과 역할을 선택하세요.</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="invite-email">이메일 주소</Label>
                  <Input id="invite-email" placeholder="teammate@brand.com" type="email" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>역할</Label>
                  <Select defaultValue="viewer">
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">
                        <div className="flex flex-col">
                          <span className="font-medium">Admin</span>
                          <span className="text-xs text-muted-foreground">모든 설정 변경 및 멤버 관리</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="editor">
                        <div className="flex flex-col">
                          <span className="font-medium">Editor</span>
                          <span className="text-xs text-muted-foreground">캠페인, 리워드 생성/수정</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="viewer">
                        <div className="flex flex-col">
                          <span className="font-medium">Viewer</span>
                          <span className="text-xs text-muted-foreground">데이터 조회만 가능</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setInviteOpen(false)}>취소</Button>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => { setInviteOpen(false); toast.success("초대 이메일을 발송했습니다.") }}>초대 보내기</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[180px]">멤버</TableHead>
                  <TableHead>역할</TableHead>
                  <TableHead className="hidden sm:table-cell">마지막 접속</TableHead>
                  <TableHead className="text-right w-24">관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((m) => (
                  <TableRow key={m.email}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarFallback className="bg-secondary text-xs font-semibold text-secondary-foreground">
                            {m.name.slice(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="block text-sm font-medium text-foreground">{m.name}</span>
                          <span className="block text-xs text-muted-foreground">{m.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-xs", roleColor[m.role])}>{m.role}</Badge>
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">{m.lastAccess}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground" onClick={() => toast(`${m.name}님의 역할을 수정합니다.`)}>
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-destructive" onClick={() => toast.success(`${m.name}님이 팀에서 제거되었습니다.`)}>
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">역할 권한 안내</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { role: "Admin", icon: Shield, perms: ["\uBAA8\uB4E0 \uC124\uC815 \uBCC0\uACBD", "\uBA64\uBC84 \uCD08\uB300/\uC0AD\uC81C", "\uCE94\uD398\uC778/\uB9AC\uC6CC\uB4DC \uAD00\uB9AC", "\uB370\uC774\uD130 \uC870\uD68C"] },
              { role: "Editor", icon: Pencil, perms: ["캠페인/리워드 생성 및 수정", "데이터 조회", "설정 변경 불가"] },
              { role: "Viewer", icon: Eye, perms: ["대시보드 데이터 조회", "수정/변경 불가"] },
            ].map((r) => (
              <div key={r.role} className="rounded-lg border border-border p-4">
                <div className="mb-3 flex items-center gap-2">
                  <r.icon className="size-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">{r.role}</span>
                </div>
                <ul className="flex flex-col gap-1.5">
                  {r.perms.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check className="size-3 mt-0.5 shrink-0 text-primary" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ═══════════════════════════════════
   5. Developers Tab
   ═══════════════════════════════════ */
function DevelopersTab() {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  function copyKey(id: string, text: string) {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast.success("API 키가 클립보드에 복사되었습니다.")
    setTimeout(() => setCopiedId(null), 2000)
  }

  const webhookEvents = [
    { value: "qr.scanned", label: "QR 스캔 발생" },
    { value: "badge.earned", label: "배지 획득" },
    { value: "reward.issued", label: "리워드 발급" },
    { value: "campaign.goal_reached", label: "캠페인 목표 달성" },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* API Keys */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Key className="size-4" />
              API 키
            </CardTitle>
            <CardDescription>외부 서비스 연동을 위한 API 키를 관리합니다.</CardDescription>
          </div>
          <Button size="sm" className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => toast.success("새 API 키가 생성되었습니다.", { description: "ak_live_new...xY2z" })}>
            <Plus className="size-4" />
            새 API 키
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[120px]">이름</TableHead>
                  <TableHead className="min-w-[180px]">키</TableHead>
                  <TableHead className="hidden sm:table-cell">생성일</TableHead>
                  <TableHead className="text-center w-20">상태</TableHead>
                  <TableHead className="text-right w-24">관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((ak) => (
                  <TableRow key={ak.id}>
                    <TableCell className="text-sm font-medium text-foreground">{ak.name}</TableCell>
                    <TableCell>
                      <code className="rounded bg-muted px-2 py-1 text-xs font-mono text-muted-foreground">{ak.key}</code>
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">{ak.created}</TableCell>
                    <TableCell className="text-center">
                      <Switch defaultChecked={ak.active} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground hover:text-foreground"
                          onClick={() => copyKey(ak.id, ak.key)}
                        >
                          {copiedId === ak.id ? <Check className="size-3.5 text-primary" /> : <Copy className="size-3.5" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-destructive" onClick={() => toast.success(`API 키 "${ak.name}"가 비활성화되었습니다.`)}>
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Webhooks */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Webhook className="size-4" />
              웹훅
            </CardTitle>
            <CardDescription>외부 서비스로 이벤트 데이터를 실시간 전송합니다.</CardDescription>
          </div>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => toast.success("새 웹훅 엔드포인트를 추가합니다.")}>
            <Plus className="size-4" />
            {"\uC5D4\uB4DC\uD3EC\uC778\uD2B8 \uCD94\uAC00"}
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {webhooks.map((wh) => (
            <div key={wh.id} className="rounded-lg border border-border p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className={cn(
                    "size-2.5 shrink-0 rounded-full",
                    wh.status === "active" ? "bg-primary" : "bg-destructive"
                  )} />
                  <code className="truncate text-sm font-mono text-foreground">{wh.url}</code>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground">{wh.lastSuccess}</span>
                  {wh.status === "failed" && (
                    <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground hover:text-foreground" onClick={() => toast("웹훅 재시도 중...", { description: wh.url })}>
                      <RefreshCw className="size-3" />
                      재시도
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="size-7 text-muted-foreground hover:text-destructive" onClick={() => toast.success("웹훅 엔드포인트가 삭제되었습니다.")}>
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {wh.events.map((ev) => (
                  <Badge key={ev} variant="secondary" className="text-xs font-mono">{ev}</Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Webhook event subscriptions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">이벤트 구독 관리</CardTitle>
          <CardDescription>웹훅으로 전송할 이벤트를 선택합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {webhookEvents.map((ev) => (
              <div key={ev.value} className="flex items-center justify-between rounded-lg border border-border p-3.5">
                <div className="flex flex-col gap-0.5">
                  <code className="text-xs font-mono font-medium text-foreground">{ev.value}</code>
                  <span className="text-xs text-muted-foreground">{ev.label}</span>
                </div>
                <Switch defaultChecked />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ═══════════════════════════════════
   6. Billing Tab
   ═══════════════════════════════════ */
const plans = [
  {
    name: "Starter",
    price: "무료",
    features: ["1,000 QR 스캔/월", "1 팀 멤버", "기본 분석", "이메일 지원"],
    current: false,
  },
  {
    name: "Pro",
    price: "₩49,000/월",
    features: ["10,000 QR 스캔/월", "5 팀 멤버", "고급 분석 & 퍼널", "API 접근", "화이트라벨", "우선 지원"],
    current: true,
  },
  {
    name: "Enterprise",
    price: "문의",
    features: ["무제한 QR 스캔", "무제한 팀 멤버", "전용 인프라", "SLA 보장", "전담 매니저"],
    current: false,
  },
]

const invoices = [
  { id: "INV-2026-02", date: "2026-02-01", amount: "₩49,000", status: "결제 완료" },
  { id: "INV-2026-01", date: "2026-01-01", amount: "₩49,000", status: "결제 완료" },
  { id: "INV-2025-12", date: "2025-12-01", amount: "₩49,000", status: "결제 완료" },
  { id: "INV-2025-11", date: "2025-11-01", amount: "₩49,000", status: "결제 완료" },
  { id: "INV-2025-10", date: "2025-10-01", amount: "₩49,000", status: "결제 완료" },
]

function BillingTab() {
  const [changePlanOpen, setChangePlanOpen] = useState(false)

  const usageItems = [
    { label: "QR 스캔", used: 7820, limit: 10000, unit: "회" },
    { label: "팀 멤버", used: 4, limit: 5, unit: "명" },
    { label: "캠페인", used: 12, limit: 20, unit: "개" },
    { label: "API 호출", used: 3200, limit: 50000, unit: "회" },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">현재 구독 플랜</CardTitle>
            <Badge className="bg-primary/10 text-primary border-0 gap-1">
              <Crown className="size-3" />Pro
            </Badge>
          </div>
          <CardDescription>현재 Pro 플랜을 사용 중입니다.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-3xl font-bold text-foreground font-mono">₩49,000<span className="text-base font-normal text-muted-foreground">/월</span></p>
              <p className="text-xs text-muted-foreground mt-1">다음 결제일: 2026-03-01</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setChangePlanOpen(true)}>플랜 변경</Button>
              <Button variant="outline" className="text-destructive hover:text-destructive" onClick={() => toast("구독 해지 절차를 진행합니다.")}>
                구독 해지
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {["10,000 QR 스캔/월", "5 팀 멤버", "고급 분석 & 퍼널", "API 접근", "화이트라벨", "우선 지원"].map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="size-3.5 text-primary shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Usage */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="size-4 text-primary" />
            <CardTitle className="text-base">이용량</CardTitle>
          </div>
          <CardDescription>이번 달 사용량 현황입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {usageItems.map((item) => {
              const pct = Math.round((item.used / item.limit) * 100)
              const isHigh = pct >= 80
              return (
                <div key={item.label} className="rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                    <span className={cn("text-xs font-mono font-medium", isHigh ? "text-destructive" : "text-muted-foreground")}>
                      {item.used.toLocaleString()} / {item.limit.toLocaleString()}{item.unit}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all", isHigh ? "bg-destructive" : "bg-primary")}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] text-muted-foreground text-right">{pct}% 사용</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="size-4 text-primary" />
            <CardTitle className="text-base">결제 수단</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-border p-4">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-lg bg-secondary">
                <CreditCard className="size-6 text-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Visa **** 4242</p>
                <p className="text-xs text-muted-foreground">만료: 12/2028</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => toast("결제 수단 변경 페이지로 이동합니다.")}>
              결제 수단 변경
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">결제 내역</CardTitle>
          <CardDescription>이전 결제 기록을 확인할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[120px]">인보이스</TableHead>
                  <TableHead>날짜</TableHead>
                  <TableHead>금액</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead className="text-right w-24">영수증</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="text-sm font-medium font-mono text-foreground">{inv.id}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{inv.date}</TableCell>
                    <TableCell className="text-sm font-medium text-foreground">{inv.amount}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
                        {inv.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                        onClick={() => toast.success(`${inv.id} 영수증을 다운로드합니다.`)}
                      >
                        <Download className="size-3.5" />
                        PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Change Plan Dialog  */}
      <Dialog open={changePlanOpen} onOpenChange={setChangePlanOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>플랜 변경</DialogTitle>
            <DialogDescription>사용 목적에 맞는 플랜을 선택하세요.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  "flex flex-col rounded-xl border p-5 transition-colors",
                  plan.current
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border hover:border-primary/40"
                )}
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-base font-bold text-foreground">{plan.name}</h3>
                  {plan.current && (
                    <Badge className="bg-primary text-primary-foreground border-0 text-[10px]">현재</Badge>
                  )}
                </div>
                <p className="text-2xl font-bold text-foreground font-mono mb-4">{plan.price}</p>
                <ul className="flex flex-col gap-2 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check className="size-3 mt-0.5 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.current ? "outline" : "default"}
                  className={cn("mt-4 w-full", !plan.current && "bg-primary text-primary-foreground hover:bg-primary/90")}
                  disabled={plan.current}
                  onClick={() => {
                    toast.success(`${plan.name} 플랜으로 변경을 요청했습니다.`)
                    setChangePlanOpen(false)
                  }}
                >
                  {plan.current ? "현재 플랜" : plan.price === "문의" ? "영업팀 문의" : "변경하기"}
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

/* ═══════════════════════════════════
   7. Analytics Settings Tab
   (Attribution Model + Competitive Benchmark)
   ═══════════════════════════════════ */
const attributionModels = [
  {
    id: "last-touch",
    name: "Last-Touch",
    nameKr: "라스트 터치",
    description: "전환 직전 마지막 접점에 성과 100%를 부여합니다.",
    example: "예: 고객이 인스타 광고 → 블로그 리뷰 → 구글 검색으로 구매했다면, 마지막 '구글 검색'에 100% 부여",
  },
  {
    id: "first-touch",
    name: "First-Touch",
    nameKr: "퍼스트 터치",
    description: "고객이 처음 접한 채널에 성과 100%를 부여합니다.",
    example: "예: 위와 같은 경우, 처음 알게 된 '인스타그램 광고'에 100% 부여",
  },
  {
    id: "linear",
    name: "Linear",
    nameKr: "리니어",
    description: "모든 접점에 균등하게 성과를 분배합니다.",
    example: "예: 위와 같은 경우, 인스타/블로그/구글 각각 33.3%씩 공평하게 분배",
  },
]

const industries = [
  { id: "fashion", name: "패션 / 의류" },
  { id: "beauty", name: "뷰티 / 화장품" },
  { id: "fnb", name: "F&B / 식음료" },
  { id: "electronics", name: "전자기기" },
  { id: "lifestyle", name: "라이프스타일" },
  { id: "retail", name: "소매 / 유통" },
]

function AnalyticsSettingsTab() {
  const [selectedModel, setSelectedModel] = useState("last-touch")
  const [benchmarkEnabled, setBenchmarkEnabled] = useState(false)
  const [selectedIndustry, setSelectedIndustry] = useState("")

  return (
    <div className="flex flex-col gap-6">
      {/* Attribution Model */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="size-4 text-primary" />
            <CardTitle className="text-base">마케팅 어트리뷰션 모델</CardTitle>
            <InfoTooltip content={GLOSSARY.attribution} />
          </div>
          <CardDescription>
            캠페인 성과 측정에 사용할 어트리뷰션 모델을 선택합니다. 선택한 모델에 따라 대시보드의 ROI, 전환율 수치가 재산정됩니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {attributionModels.map((model) => (
              <label
                key={model.id}
                className={cn(
                  "flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-colors",
                  selectedModel === model.id
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border hover:border-primary/40"
                )}
              >
                <input
                  type="radio"
                  name="attribution"
                  value={model.id}
                  checked={selectedModel === model.id}
                  onChange={() => setSelectedModel(model.id)}
                  className="mt-1 accent-primary"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">{model.name}</span>
                    <Badge variant="outline" className="text-[10px]">{model.nameKr}</Badge>
                    {selectedModel === model.id && (
                      <Badge className="bg-primary text-primary-foreground border-0 text-[10px] ml-auto">적용 중</Badge>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{model.description}</p>
                  {model.example && (
                    <p className="mt-1.5 text-[11px] text-primary/80 bg-primary/5 rounded px-2 py-1">{model.example}</p>
                  )}
                </div>
              </label>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => {
                const m = attributionModels.find((a) => a.id === selectedModel)
                toast.success(`어트리뷰션 모델이 "${m?.name}"(으)로 변경되었습니다.`, {
                  description: "대시보드 데이터가 재산정됩니다.",
                })
              }}
            >
              모델 적용
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Competitive Benchmark */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Factory className="size-4 text-primary" />
            <CardTitle className="text-base">경쟁 벤치마크</CardTitle>
            <Badge variant="outline" className="text-xs">Opt-in</Badge>
            <InfoTooltip content={GLOSSARY.optIn} />
          </div>
          <CardDescription>
            같은 업종의 익명화된 평균과 내 핵심 지표를 비교합니다. 옵트인하면 메인 대시보드에 벤치마크 위젯이 표시됩니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-foreground">벤치마크 활성화</span>
              <span className="text-xs text-muted-foreground">업종 평균과 내 지표를 비교합니다.</span>
            </div>
            <Switch checked={benchmarkEnabled} onCheckedChange={setBenchmarkEnabled} />
          </div>

          {benchmarkEnabled && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <Label>업종 선택</Label>
                <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                  <SelectTrigger><SelectValue placeholder="업종을 선택하세요" /></SelectTrigger>
                  <SelectContent>
                    {industries.map((ind) => (
                      <SelectItem key={ind.id} value={ind.id}>{ind.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedIndustry && (
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">업종 벤치마크 미리보기</p>
                  <div className="flex flex-col gap-2.5">
                    {[
                      { metric: "전환율", yours: "15.9%", avg: "12.3%", diff: "+29.3%" },
                      { metric: "스캔율", yours: "3,842", avg: "2,100", diff: "+83%" },
                      { metric: "ROI", yours: "420%", avg: "280%", diff: "+50%" },
                    ].map((item) => (
                      <div key={item.metric} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{item.metric}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-medium text-foreground">{item.yours}</span>
                          <ArrowRight className="size-3 text-muted-foreground" />
                          <span className="font-mono text-muted-foreground">{item.avg}</span>
                          <Badge className="bg-primary/10 text-primary border-0 text-[10px] font-mono">{item.diff}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={!selectedIndustry}
                  onClick={() => {
                    const ind = industries.find((i) => i.id === selectedIndustry)
                    toast.success(`"${ind?.name}" 업종 벤치마크가 활성화되었습니다.`, {
                      description: "대시보드에 벤치마크 위젯이 추가됩니다.",
                    })
                  }}
                >
                  벤치마크 저장
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
