"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Award, Gift, Lock, X, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

/* ── Badge data ── */
interface UserBadge {
  id: number
  name: string
  description: string
  image: string
  acquired: boolean
  acquiredDate?: string
  campaign: string
}

const userBadges: UserBadge[] = [
  {
    id: 1,
    name: "24SS 스프링 에디션",
    description: "2024 봄 시즌 한정 배지. 스프링 룩북 엽서의 QR을 스캔하면 획득할 수 있습니다.",
    image: "/images/badge-spring.jpg",
    acquired: true,
    acquiredDate: "2026-02-20",
    campaign: "26SS 스프링 룩북 엽서",
  },
  {
    id: 2,
    name: "썸머 바이브",
    description: "여름 한정판 비치 배지. 여름 컬렉션을 2회 이상 스캔하면 획득됩니다.",
    image: "/images/badge-summer.jpg",
    acquired: true,
    acquiredDate: "2026-01-15",
    campaign: "VIP 10% 시크릿 쿠폰",
  },
  {
    id: 3,
    name: "첫 스캔 기념",
    description: "첫 번째 QR 스캔을 기념하는 환영 배지입니다.",
    image: "/images/badge-first.jpg",
    acquired: true,
    acquiredDate: "2025-12-01",
    campaign: "전체 캠페인",
  },
  {
    id: 4,
    name: "어텀 리프",
    description: "가을 시즌 컬렉션 배지. FW 컬렉션 QR을 스캔하면 획득할 수 있습니다.",
    image: "/images/badge-autumn.jpg",
    acquired: false,
    campaign: "가을 프리뷰 캠페인",
  },
  {
    id: 5,
    name: "윈터 매직",
    description: "겨울 눈사람 특별 배지. 겨울 세일 기간에 스캔하면 획득됩니다.",
    image: "/images/badge-winter.jpg",
    acquired: false,
    campaign: "겨울 클리어런스 세일",
  },
  {
    id: 6,
    name: "VIP 로열티",
    description: "브랜드 VIP 고객 전용 배지. 누적 스캔 10회 이상이면 획득됩니다.",
    image: "/images/badge-vip.jpg",
    acquired: false,
    campaign: "전체 캠페인",
  },
]

/* ── Reward data ── */
interface UserReward {
  id: number
  name: string
  description: string
  badgesRequired: number
  code?: string
  expiry?: string
  available: boolean
}

const userRewards: UserReward[] = [
  {
    id: 1,
    name: "10% 할인 쿠폰",
    description: "배지 3개 수집 시 자동 발급되는 할인 쿠폰입니다.",
    badgesRequired: 3,
    code: "SPRING10",
    expiry: "2026-03-20",
    available: true,
  },
  {
    id: 2,
    name: "무료 배송 쿠폰",
    description: "배지 5개 수집 달성 리워드입니다.",
    badgesRequired: 5,
    available: false,
  },
  {
    id: 3,
    name: "20% 특별 할인",
    description: "배지 8개를 모으면 특별 할인을 받을 수 있습니다.",
    badgesRequired: 8,
    available: false,
  },
]

const acquiredCount = userBadges.filter((b) => b.acquired).length

export default function MyPage() {
  const [selectedBadge, setSelectedBadge] = useState<UserBadge | null>(null)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center gap-3 bg-card/95 backdrop-blur-sm px-4 py-3 border-b border-border">
        <Link href="/m" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-5" />
          <span className="sr-only">뒤로</span>
        </Link>
        <h1 className="text-sm font-bold text-foreground">마이 페이지</h1>
      </header>

      <main className="px-4 py-6">
        {/* User summary */}
        <div className="rounded-xl bg-primary p-5 text-primary-foreground">
          <p className="text-xs font-medium text-primary-foreground/70">나의 컬렉션 현황</p>
          <div className="mt-2 flex items-end gap-1">
            <span className="text-4xl font-bold font-mono">{acquiredCount}</span>
            <span className="text-sm font-medium text-primary-foreground/70 mb-1">/ {userBadges.length} 배지</span>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-primary-foreground/20">
            <div
              className="h-full rounded-full bg-primary-foreground transition-all"
              style={{ width: `${(acquiredCount / userBadges.length) * 100}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-primary-foreground/60">
            {acquiredCount >= 5
              ? "무료 배송 쿠폰 달성!"
              : `무료 배송 쿠폰까지 ${5 - acquiredCount}개 더 모아보세요`}
          </p>
        </div>

        {/* ── Badge Collection ── */}
        <section className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <Award className="size-5 text-primary" />
            <h2 className="text-base font-bold text-foreground">나의 배지 컬렉션</h2>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {userBadges.map((badge) => (
              <button
                key={badge.id}
                onClick={() => setSelectedBadge(badge)}
                className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-3 transition-shadow hover:shadow-md"
              >
                <div className="relative size-20 overflow-hidden rounded-xl">
                  <Image
                    src={badge.image}
                    alt={badge.name}
                    fill
                    className={`object-cover transition-all ${badge.acquired ? "" : "grayscale opacity-40"}`}
                  />
                  {!badge.acquired && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Lock className="size-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <p className={`text-[11px] font-semibold leading-tight ${badge.acquired ? "text-foreground" : "text-muted-foreground"}`}>
                    {badge.name}
                  </p>
                  {badge.acquired && badge.acquiredDate && (
                    <p className="text-[10px] text-primary mt-0.5">획득</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ── Available Rewards ── */}
        <section className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <Gift className="size-5 text-primary" />
            <h2 className="text-base font-bold text-foreground">사용 가능한 혜택</h2>
          </div>

          <div className="flex flex-col gap-3">
            {userRewards.map((reward) => (
              <div
                key={reward.id}
                className={`rounded-xl border p-4 ${
                  reward.available
                    ? "border-primary/30 bg-primary/5"
                    : "border-border bg-card opacity-60"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
                        reward.available ? "bg-primary/15" : "bg-secondary"
                      }`}
                    >
                      <Gift
                        className={`size-5 ${reward.available ? "text-primary" : "text-muted-foreground"}`}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{reward.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">배지 {reward.badgesRequired}개 수집</p>
                    </div>
                  </div>
                  {reward.available ? (
                    <span className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                      사용 가능
                    </span>
                  ) : (
                    <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                      {acquiredCount >= reward.badgesRequired ? "달성" : `${reward.badgesRequired - acquiredCount}개 남음`}
                    </span>
                  )}
                </div>

                {reward.available && reward.code && (
                  <div className="mt-3 flex items-center justify-between rounded-lg bg-card border border-border px-3 py-2">
                    <div>
                      <p className="text-[10px] text-muted-foreground">쿠폰 코드</p>
                      <p className="text-sm font-bold text-primary font-mono">{reward.code}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground">유효기간</p>
                      <p className="text-xs text-foreground">{reward.expiry}</p>
                    </div>
                  </div>
                )}

                {!reward.available && (
                  <div className="mt-3">
                    <div className="h-1.5 w-full rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary/40 transition-all"
                        style={{
                          width: `${Math.min((acquiredCount / reward.badgesRequired) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <p className="mt-1 text-[10px] text-muted-foreground text-right">
                      {acquiredCount} / {reward.badgesRequired}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Badge detail dialog */}
      <Dialog open={!!selectedBadge} onOpenChange={() => setSelectedBadge(null)}>
        {selectedBadge && (
          <DialogContent className="sm:max-w-xs">
            <DialogHeader>
              <DialogTitle className="text-center">{selectedBadge.name}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center">
              <div className="relative size-36 overflow-hidden rounded-2xl">
                <Image
                  src={selectedBadge.image}
                  alt={selectedBadge.name}
                  fill
                  className={`object-cover ${selectedBadge.acquired ? "" : "grayscale opacity-40"}`}
                />
              </div>
              <p className="mt-4 text-sm text-muted-foreground text-center leading-relaxed">
                {selectedBadge.description}
              </p>
              <div className="mt-4 w-full rounded-lg bg-secondary p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">캠페인</span>
                  <span className="font-medium text-foreground">{selectedBadge.campaign}</span>
                </div>
                {selectedBadge.acquired && selectedBadge.acquiredDate && (
                  <div className="flex items-center justify-between text-xs mt-2">
                    <span className="text-muted-foreground">획득일</span>
                    <span className="font-medium text-primary">{selectedBadge.acquiredDate}</span>
                  </div>
                )}
                {!selectedBadge.acquired && (
                  <div className="flex items-center justify-between text-xs mt-2">
                    <span className="text-muted-foreground">상태</span>
                    <span className="font-medium text-muted-foreground">미획득</span>
                  </div>
                )}
              </div>
              <Button variant="outline" className="mt-4 w-full" onClick={() => setSelectedBadge(null)}>
                닫기
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-4 py-6 text-center">
        <p className="text-xs text-muted-foreground">ARCHETYPE Insights</p>
      </footer>
    </div>
  )
}
