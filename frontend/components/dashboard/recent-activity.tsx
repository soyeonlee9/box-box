"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Video, ExternalLink } from "lucide-react"
import { toast } from "sonner"

export function RecentActivity() {
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <>
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="text-base font-semibold">리마인더</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-foreground leading-snug text-balance">
              마케팅팀 주간 미팅
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              시간 : 오후 2:00 - 4:00
            </p>
          </div>
          <Button
            className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => setConfirmOpen(true)}
          >
            <Video className="size-4" />
            미팅 시작하기
          </Button>
        </CardContent>
      </Card>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>미팅에 참여하시겠습니까?</DialogTitle>
            <DialogDescription>
              마케팅팀 주간 미팅 (오후 2:00 - 4:00) 에 참여합니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              취소
            </Button>
            <Button
              className="gap-2"
              onClick={() => {
                setConfirmOpen(false)
                toast.success("미팅에 연결 중입니다...", {
                  description: "잠시 후 화상회의로 이동합니다.",
                  icon: <ExternalLink className="size-4" />,
                })
              }}
            >
              <Video className="size-4" />
              참여하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
