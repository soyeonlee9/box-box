"use client"

import { useState, useRef, useEffect } from "react"
import {
  Search,
  Bell,
  Mail,
  HelpCircle,
  PlayCircle,
  BookOpen,
  X,
  Settings,
  LogOut,
  User,
  Check,
  Trash2,
  ArrowLeft,
  AlertTriangle,
  TrendingDown,
  MapPin,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { MobileSidebar } from "./sidebar"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { apiFetch } from "@/lib/api"
import { useAuthStore } from "@/store/useAuthStore"
import { supabase } from "@/lib/supabase"


export function DashboardHeader() {
  const router = useRouter()
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState("")

  const { user, inAppNotifications, setInAppNotifications, clearInAppNotifications } = useAuthStore()
  const [headerData, setHeaderData] = useState<any>(null)

  useEffect(() => {
    async function fetchHeaderData() {
      try {
        const data = await apiFetch("/user/header")
        setHeaderData(data)
        if (inAppNotifications.length === 0) {
          setInAppNotifications(data?.notifications || [])
        }
      } catch (err) {
        console.error("Error fetching header data:", err)
      }
    }
    fetchHeaderData()
  }, [])

  const searchResults = headerData?.searchResults || []

  const unreadNotiCount = inAppNotifications.length

  const filtered = query.trim()
    ? searchResults.filter(
      (r: any) =>
        r.label.toLowerCase().includes(query.toLowerCase()) ||
        r.type.toLowerCase().includes(query.toLowerCase())
    )
    : searchResults

  function clearNotifications() {
    clearInAppNotifications()
    toast.success("모든 알림을 삭제했습니다.")
  }

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-card px-4 py-3 lg:px-6">
        <MobileSidebar />

        {/* Search trigger */}
        <button
          onClick={() => setSearchOpen(true)}
          className="relative hidden flex-1 max-w-md sm:flex"
        >
          <div className="flex h-9 w-full items-center rounded-lg border border-input bg-background pl-9 pr-4 text-sm text-muted-foreground">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2" />
            <span>캠페인 검색...</span>
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden items-center gap-0.5 rounded border border-border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground md:flex">
              <span className="text-xs">{"⌘"}</span>F
            </kbd>
          </div>
        </button>

        <div className="flex-1 sm:hidden" />

        {/* Actions */}
        <div className="flex items-center gap-1">

          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-muted-foreground hover:text-foreground"
              >
                <Bell className="size-5" />
                {unreadNotiCount > 0 && (
                  <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                    {unreadNotiCount}
                  </span>
                )}
                <span className="sr-only">알림</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between px-3 py-2">
                <DropdownMenuLabel className="p-0 text-sm font-semibold">알림</DropdownMenuLabel>
                {unreadNotiCount > 0 && (
                  <button onClick={clearNotifications} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive">
                    <Trash2 className="size-3" />모두 삭제
                  </button>
                )}
              </div>
              <DropdownMenuSeparator />
              {inAppNotifications.length === 0 ? (
                <div className="px-3 py-6 text-center text-sm text-muted-foreground">알림이 없습니다.</div>
              ) : (
                inAppNotifications.map((noti) => (
                  <DropdownMenuItem key={noti.id} className="flex items-start gap-3 px-3 py-2.5 cursor-pointer" onClick={() => toast(noti.text)}>
                    <span className={`mt-1 size-2 shrink-0 rounded-full ${noti.type === "anomaly" ? "bg-destructive animate-pulse" : noti.type === "success" ? "bg-primary" : noti.type === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-snug">{noti.text}</p>
                      <p className="text-[10px] text-muted-foreground/70 mt-0.5">{noti.time}</p>
                    </div>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Help dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <HelpCircle className="size-5" /><span className="sr-only">도움말</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem onClick={() => router.push("/help")} className="gap-2.5 cursor-pointer">
                <BookOpen className="size-4 text-muted-foreground" /><span>도움말 페이지</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="ml-2 flex items-center gap-2.5 rounded-lg px-1 py-1 hover:bg-secondary transition-colors">
                <Avatar className="size-9 border-2 border-primary/30">
                  <AvatarImage
                    src={user?.avatar_url || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E1%84%91%E1%85%B3%E1%84%85%E1%85%A9%E1%84%91%E1%85%B5%E1%86%AF%E1%84%89%E1%85%A1%E1%84%8C%E1%85%B5%E1%86%AB-jY7AiQ4Ww9J3etaLCK6zvrAnzRpZE7.png"}
                    alt="프로필"
                  />
                  <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                    {user?.name ? user.name.substring(0, 2).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-foreground leading-none">{user?.name || "사용자"}</p>
                  <p className="text-xs text-muted-foreground truncate w-24">{user?.email || "이메일 없음"}</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-3 py-2.5">
                <p className="text-sm font-semibold">{user?.name || "사용자"}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email || "이메일 없음"}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/settings")} className="gap-2.5 cursor-pointer">
                <User className="size-4" /><span>프로필 및 계정 설정</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async () => {
                  try {
                    await supabase.auth.signOut()
                    useAuthStore.getState().logout()
                    router.replace("/login")
                    toast("로그아웃 되었습니다.")
                  } catch (err) {
                    console.error("Logout failed:", err)
                  }
                }}
                className="gap-2.5 cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="size-4" /><span>로그아웃</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>



      {/* Search Dialog */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>검색</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <Search className="size-5 shrink-0 text-muted-foreground" />
            <input
              type="text"
              autoFocus
              placeholder="캠페인, 페이지, 배지 검색..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
            {query && (
              <button onClick={() => setQuery("")}>
                <X className="size-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
          <div className="max-h-72 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">검색 결과가 없습니다.</div>
            ) : (
              <ul className="py-2">
                {filtered.map((r: any) => (
                  <li key={r.label}>
                    <button
                      className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-secondary transition-colors"
                      onClick={() => { setSearchOpen(false); setQuery(""); router.push(r.href) }}
                    >
                      <span className="font-medium">{r.label}</span>
                      <Badge variant="secondary" className="text-[10px]">{r.type}</Badge>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
