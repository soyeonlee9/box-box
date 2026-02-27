"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  FileText,
  QrCode,
  BarChart3,
  Settings,
  LogOut,
  Award,
  Menu,
  ChevronDown,
  TrendingUp,
  Users,
  Building2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { useAuthStore } from "@/store/useAuthStore"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

const LABELS = {
  summaryReport: "요약 리포트",
  campaignManagement: "캠페인 관리",
  customerAnalysis: "고객 분석",
  performanceAnalysis: "성과 분석",
  customerGroups: "고객 그룹",
  rewards: "리워드/배지",
  settings: "설정",
  menu: "메뉴",
  logout: "로그아웃",
  logoutConfirmTitle: "로그아웃",
  logoutConfirmDesc: "정말 로그아웃 하시겠습니까?",
  cancel: "취소",
  logoutDone: "로그아웃 되었습니다.",
} as const

function SidebarContent({
  onNavigate,
  onLogout,
}: {
  onNavigate?: () => void
  onLogout: () => void
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [customerOpen, setCustomerOpen] = useState(
    pathname.startsWith("/analytics") || pathname.startsWith("/segments")
  )
  const { user, selectedBrandId, selectedBrandName, setSelectedBrandId } = useAuthStore()

  const isCustomerActive = pathname.startsWith("/analytics") || pathname.startsWith("/segments")

  const handleReturnToPortal = () => {
    setSelectedBrandId(null)
    useAuthStore.getState().setSelectedBrandName(null)
    router.push('/superadmin/brands')
  }

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-6 border-b border-border/50 bg-background/50">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary">
          <QrCode className="size-5 text-primary-foreground" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-bold tracking-tight text-foreground leading-none truncate w-full">
            {selectedBrandId && selectedBrandName ? selectedBrandName : "ARCHETYPE"}
          </span>
          <span className="text-[10px] font-medium tracking-widest text-muted-foreground uppercase mt-1">
            Insights
          </span>
        </div>
      </div>

      <nav className="flex-1 px-3 mt-4">
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {LABELS.menu}
        </p>
        <ul className="flex flex-col gap-1">
          {/* 1. Summary Report */}
          <li>
            <Link
              href="/"
              onClick={onNavigate}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname === "/"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <FileText className="size-5" />
              <span>{LABELS.summaryReport}</span>
            </Link>
          </li>

          {/* 2. Campaign Management */}
          <li>
            <Link
              href="/campaigns"
              onClick={onNavigate}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname.startsWith("/campaigns")
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <QrCode className="size-5" />
              <span>{LABELS.campaignManagement}</span>
            </Link>
          </li>

          {/* 3. Customer Analysis (collapsible) */}
          <li>
            <button
              onClick={() => setCustomerOpen(!customerOpen)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isCustomerActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <BarChart3 className="size-5" />
              <span>{LABELS.customerAnalysis}</span>
              <ChevronDown
                className={cn(
                  "ml-auto size-4 transition-transform",
                  customerOpen && "rotate-180"
                )}
              />
            </button>
            {customerOpen && (
              <ul className="mt-1 ml-4 flex flex-col gap-1 border-l border-border pl-3">
                <li>
                  <Link
                    href="/analytics"
                    onClick={onNavigate}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      pathname.startsWith("/analytics")
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <TrendingUp className="size-4" />
                    <span>{LABELS.performanceAnalysis}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/segments"
                    onClick={onNavigate}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      pathname.startsWith("/segments")
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <Users className="size-4" />
                    <span>{LABELS.customerGroups}</span>
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* 4. Rewards */}
          <li>
            <Link
              href="/rewards"
              onClick={onNavigate}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname.startsWith("/rewards")
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Award className="size-5" />
              <span>{LABELS.rewards}</span>
            </Link>
          </li>

          {/* 5. Settings */}
          <li>
            <Link
              href="/settings"
              onClick={onNavigate}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname.startsWith("/settings")
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Settings className="size-5" />
              <span>{LABELS.settings}</span>
            </Link>
          </li>

          {/* 6. Super Admin Portal (Only for super_admin) */}
          {user?.role === 'super_admin' && (
            <li>
              <Link
                href="/superadmin/brands"
                onClick={onNavigate}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  pathname.startsWith("/superadmin")
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground hover:text-primary font-bold"
                )}
              >
                <div className="flex size-5 items-center justify-center rounded bg-primary/20 text-primary">
                  <Building2 className="size-3.5" />
                </div>
                <span>고객사 총괄 관리</span>
              </Link>
            </li>
          )}

          {/* Super Admin Impersonation Box */}
          {user?.role === 'super_admin' && selectedBrandId && (
            <li className="mt-4">
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
                <p className="mb-3 text-[11px] font-semibold text-primary flex items-center gap-1.5 relative z-10 w-full truncate">
                  <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Building2 className="size-2.5" />
                  </span>
                  <span className="truncate flex-1 max-w-fit">{selectedBrandName || "브랜드"} 관전 중</span>
                </p>
                <button
                  onClick={handleReturnToPortal}
                  className="relative z-10 flex w-full items-center justify-center gap-2 rounded-md bg-white border border-primary/20 py-1.5 text-xs font-medium text-primary hover:bg-primary/5 transition-colors shadow-sm"
                >
                  포털로 복귀
                </button>
              </div>
            </li>
          )}
        </ul>

        <div className="my-4 h-px bg-border" />

        <ul className="flex flex-col gap-1">
          <li>
            <button
              onClick={onLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="size-5" />
              <span>{LABELS.logout}</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export function DesktopSidebar() {
  const [logoutOpen, setLogoutOpen] = useState(false)

  return (
    <>
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:border-r lg:border-border lg:bg-card">
        <SidebarContent onLogout={() => setLogoutOpen(true)} />
      </aside>
      <LogoutDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
    </>
  )
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="size-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarContent
            onNavigate={() => setOpen(false)}
            onLogout={() => {
              setOpen(false)
              setLogoutOpen(true)
            }}
          />
        </SheetContent>
      </Sheet>
      <LogoutDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
    </>
  )
}

function LogoutDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const router = useRouter()
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{LABELS.logoutConfirmTitle}</DialogTitle>
          <DialogDescription>{LABELS.logoutConfirmDesc}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {LABELS.cancel}
          </Button>
          <Button
            variant="destructive"
            onClick={async () => {
              onOpenChange(false)
              try {
                await supabase.auth.signOut()
                useAuthStore.getState().logout()
                router.replace("/login")
                toast.success(LABELS.logoutDone)
              } catch (err) {
                console.error("Logout failed:", err)
              }
            }}
          >
            {LABELS.logout}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
