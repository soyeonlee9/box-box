"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Award, ChevronRight, Gift, Play, X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

/* ── Badge popup component ── */
function BadgePopup({ onClose }: { onClose: () => void }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm p-4">
      <div
        className={`relative w-full max-w-xs rounded-2xl bg-card p-6 text-center shadow-2xl transition-all duration-500 ${
          show ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
          aria-label="닫기"
        >
          <X className="size-5" />
        </button>

        {/* Sparkle animation area */}
        <div className="relative mx-auto mb-4 size-32">
          <div className="absolute inset-0 animate-pulse rounded-full bg-primary/10" />
          <Image
            src="/images/badge-spring.jpg"
            alt="24SS 스프링 에디션 배지"
            fill
            className="rounded-2xl object-cover"
          />
          <div className="absolute -top-1 -right-1">
            <Sparkles className="size-6 text-primary animate-bounce" />
          </div>
        </div>

        <h2 className="text-lg font-bold text-foreground">배지 획득!</h2>
        <p className="mt-1 text-sm text-primary font-semibold">
          {"'24SS 스프링 에디션'"}
        </p>
        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
          축하합니다! 26SS 스프링 룩북을 스캔하여 한정판 배지를 획득했어요.
        </p>

        <div className="mt-5 flex flex-col gap-2">
          <Link href="/m/mypage">
            <Button className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Award className="size-4" />
              내 컬렉션 보기
            </Button>
          </Link>
          <Button variant="outline" onClick={onClose} className="w-full">
            계속 둘러보기
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function MobileLandingPage() {
  const [badgePopup, setBadgePopup] = useState(true)

  return (
    <div className="min-h-screen bg-background">
      {/* Badge popup */}
      {badgePopup && <BadgePopup onClose={() => setBadgePopup(false)} />}

      {/* Mobile header */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-card/95 backdrop-blur-sm px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
            <Award className="size-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-bold text-foreground tracking-tight">ARCHETYPE</span>
        </div>
        <Link href="/m/mypage">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground">
            <Award className="size-3.5" />
            My 배지
          </Button>
        </Link>
      </header>

      {/* Hero product image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src="/images/product-spring.jpg"
          alt="26SS 스프링 컬렉션"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <span className="inline-block rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold text-primary-foreground">
            26SS SPRING COLLECTION
          </span>
        </div>
      </div>

      {/* Campaign content */}
      <main className="px-4 py-6">
        <h1 className="text-xl font-bold text-foreground leading-tight text-balance">
          26SS 스프링 룩북 에디션
        </h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          이번 시즌 가장 주목받는 스프링 컬렉션을 만나보세요. 가볍고 세련된 실루엣으로 봄을 맞이할 준비가 되셨나요?
        </p>

        {/* Video section */}
        <div className="mt-5 relative aspect-video w-full overflow-hidden rounded-xl bg-secondary">
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              className="flex size-14 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-lg transition-transform hover:scale-105"
              aria-label="영상 재생"
            >
              <Play className="size-6 ml-0.5" />
            </button>
          </div>
          <Image
            src="/images/product-spring.jpg"
            alt="룩북 영상 미리보기"
            fill
            className="object-cover opacity-60"
          />
        </div>

        {/* Feature highlights */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          {[
            { label: "소재", value: "오가닉 코튼" },
            { label: "컬러", value: "크림 / 세이지" },
            { label: "사이즈", value: "S ~ XL" },
            { label: "시즌", value: "2026 S/S" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-border bg-card p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{item.label}</p>
              <p className="mt-0.5 text-sm font-semibold text-foreground">{item.value}</p>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="mt-6 flex flex-col gap-3">
          <Button className="w-full h-12 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold">
            제품 구매하기
            <ChevronRight className="size-4" />
          </Button>
          <Link href="/m/mypage" className="w-full">
            <Button variant="outline" className="w-full h-12 gap-2 text-sm">
              <Gift className="size-4" />
              내 배지 / 혜택 확인
            </Button>
          </Link>
        </div>

        {/* Badge preview */}
        <div className="mt-8 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Award className="size-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">이번 캠페인 배지</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-xl">
              <Image
                src="/images/badge-spring.jpg"
                alt="스프링 에디션 배지"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">24SS 스프링 에디션</p>
              <p className="text-xs text-muted-foreground mt-0.5">2024 봄 시즌 한정 배지</p>
              <p className="text-xs text-primary font-medium mt-1">획득 완료</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-4 py-6 text-center">
        <p className="text-xs text-muted-foreground">ARCHETYPE Insights</p>
      </footer>
    </div>
  )
}
