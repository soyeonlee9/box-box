"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus } from "lucide-react"
import { toast } from "sonner"

const members = [
  { name: "김서연", initials: "서", task: "QR 랜딩페이지 리디자인", status: "완료" as const },
  { name: "이준호", initials: "준", task: "사용자 인증 시스템 연동", status: "진행중" as const },
  { name: "박하윤", initials: "하", task: "검색 및 필터 기능 개발", status: "대기" as const },
  { name: "최민재", initials: "민", task: "반응형 레이아웃 작업", status: "진행중" as const },
]

function statusClasses(status: "완료" | "진행중" | "대기") {
  switch (status) {
    case "완료": return "bg-primary/10 text-primary"
    case "진행중": return "bg-accent/10 text-accent-foreground"
    case "대기": return "bg-destructive/10 text-destructive"
  }
}

function avatarClasses(index: number) {
  const variants = [
    "bg-primary text-primary-foreground",
    "bg-muted-foreground text-muted",
    "bg-primary/70 text-primary-foreground",
    "bg-muted-foreground/70 text-muted",
  ]
  return variants[index % variants.length]
}

export function TeamCollaboration() {
  const [addOpen, setAddOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("")

  function handleAdd() {
    if (!email.trim()) {
      toast.error("이메일을 입력해주세요.")
      return
    }
    toast.success(`${email}로 초대를 발송했습니다.`)
    setEmail("")
    setRole("")
    setAddOpen(false)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">팀 협업</CardTitle>
          <CardAction>
            <Button
              variant="outline"
              size="sm"
              className="gap-1 text-xs"
              onClick={() => setAddOpen(true)}
            >
              <Plus className="size-3.5" />
              멤버 추가
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-3.5">
          {members.map((m, idx) => (
            <button
              key={m.name}
              className="flex w-full items-center gap-3 rounded-lg px-1 py-1 text-left transition-colors hover:bg-secondary"
              onClick={() =>
                toast(`${m.name}`, {
                  description: `작업: ${m.task} | 상태: ${m.status}`,
                })
              }
            >
              <Avatar className="size-8 border border-border">
                <AvatarFallback className={`text-xs font-semibold ${avatarClasses(idx)}`}>
                  {m.initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{m.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  작업 중: <span className="font-medium text-foreground">{m.task}</span>
                </p>
              </div>
              <Badge className={`shrink-0 border-0 text-[10px] ${statusClasses(m.status)}`}>
                {m.status}
              </Badge>
            </button>
          ))}
        </CardContent>
      </Card>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>팀 멤버 초대</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="memail">이메일</Label>
              <Input
                id="memail"
                placeholder="member@brand.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>역할</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="역할 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="editor">편집자</SelectItem>
                  <SelectItem value="viewer">뷰어</SelectItem>
                  <SelectItem value="admin">관리자</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              취소
            </Button>
            <Button onClick={handleAdd}>초대하기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
