"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useTutorial } from "./tutorial-provider"
import { Button } from "@/components/ui/button"
import { X, ChevronLeft, ChevronRight, Sparkles, Rocket } from "lucide-react"

/* ── Rect type ── */
interface SpotRect {
  top: number
  left: number
  width: number
  height: number
}

export function TutorialOverlay() {
  const { isRunning, step, currentStep, totalSteps, next, prev, stop } =
    useTutorial()
  const router = useRouter()
  const [rect, setRect] = useState<SpotRect | null>(null)
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({})
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  const computePosition = useCallback(() => {
    if (!step || !step.target) {
      setRect(null)
      return
    }

    const el = document.querySelector(step.target)
    if (!el) {
      setRect(null)
      return
    }

    const domRect = el.getBoundingClientRect()
    const padding = 8
    setRect({
      top: domRect.top - padding + window.scrollY,
      left: domRect.left - padding,
      width: domRect.width + padding * 2,
      height: domRect.height + padding * 2,
    })
  }, [step])

  /* Recalculate positions when step changes */
  useEffect(() => {
    if (!isRunning || !step) {
      setIsVisible(false)
      return
    }

    // Delay to let page render
    const timer = setTimeout(() => {
      computePosition()
      setIsVisible(true)
    }, 400)

    return () => clearTimeout(timer)
  }, [isRunning, step, currentStep, computePosition])

  /* Recompute on resize / scroll */
  useEffect(() => {
    if (!isRunning) return
    const handler = () => computePosition()
    window.addEventListener("resize", handler)
    window.addEventListener("scroll", handler, true)
    return () => {
      window.removeEventListener("resize", handler)
      window.removeEventListener("scroll", handler, true)
    }
  }, [isRunning, computePosition])

  /* Compute tooltip position relative to spotlight */
  useEffect(() => {
    if (!isRunning || !step) return

    // Modal steps (no target)
    if (!step.target || !rect) {
      setTooltipStyle({
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      })
      return
    }

    // Wait a tick for tooltip to render
    requestAnimationFrame(() => {
      const tooltip = tooltipRef.current
      if (!tooltip) return

      const tw = tooltip.offsetWidth
      const th = tooltip.offsetHeight
      const placement = step.placement || "bottom"
      const gap = 16
      const scrollY = window.scrollY

      let top = 0
      let left = 0

      switch (placement) {
        case "bottom":
          top = rect.top - scrollY + rect.height + gap
          left = rect.left + rect.width / 2 - tw / 2
          break
        case "top":
          top = rect.top - scrollY - th - gap
          left = rect.left + rect.width / 2 - tw / 2
          break
        case "left":
          top = rect.top - scrollY + rect.height / 2 - th / 2
          left = rect.left - tw - gap
          break
        case "right":
          top = rect.top - scrollY + rect.height / 2 - th / 2
          left = rect.left + rect.width + gap
          break
      }

      // Keep within viewport
      left = Math.max(16, Math.min(left, window.innerWidth - tw - 16))
      top = Math.max(16, Math.min(top, window.innerHeight - th - 16))

      setTooltipStyle({
        position: "fixed",
        top: `${top}px`,
        left: `${left}px`,
      })
    })
  }, [isRunning, step, rect, currentStep])

  /* Scroll to target */
  useEffect(() => {
    if (!isRunning || !step?.target) return
    const timer = setTimeout(() => {
      const el = document.querySelector(step.target!)
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" })
        setTimeout(computePosition, 300)
      }
    }, 200)
    return () => clearTimeout(timer)
  }, [isRunning, step, currentStep, computePosition])

  if (!isRunning || !step) return null

  const isModal = !step.target
  const isFirst = currentStep === 0
  const isLast = currentStep === totalSteps - 1

  return (
    <div className="fixed inset-0 z-[9999]" aria-label="튜토리얼 오버레이">
      {/* Backdrop */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{ opacity: isVisible ? 1 : 0 }}
      >
        {/* Dark overlay with cutout */}
        {rect && !isModal ? (
          <svg
            className="absolute inset-0 size-full"
            style={{ pointerEvents: "none" }}
          >
            <defs>
              <mask id="spotlight-mask">
                <rect width="100%" height="100%" fill="white" />
                <rect
                  x={rect.left}
                  y={rect.top - window.scrollY}
                  width={rect.width}
                  height={rect.height}
                  rx={12}
                  fill="black"
                />
              </mask>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="rgba(0,0,0,0.6)"
              mask="url(#spotlight-mask)"
              style={{ pointerEvents: "auto" }}
              onClick={stop}
            />
          </svg>
        ) : (
          <div
            className="absolute inset-0 bg-black/60"
            onClick={stop}
          />
        )}

        {/* Spotlight ring glow */}
        {rect && !isModal && (
          <div
            className="absolute rounded-xl ring-2 ring-primary/60 ring-offset-2 ring-offset-transparent transition-all duration-300"
            style={{
              top: rect.top - window.scrollY,
              left: rect.left,
              width: rect.width,
              height: rect.height,
              boxShadow: "0 0 0 4px rgba(45, 106, 79, 0.15)",
              pointerEvents: "none",
            }}
          />
        )}
      </div>

      {/* Tooltip / Modal */}
      <div
        ref={tooltipRef}
        className="z-[10000] w-[340px] sm:w-[400px] transition-all duration-300"
        style={{
          ...tooltipStyle,
          opacity: isVisible ? 1 : 0,
          transform: `${tooltipStyle.transform || ""} ${isVisible ? "translateY(0)" : "translateY(8px)"}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rounded-2xl border border-border bg-card p-5 shadow-2xl">
          {/* Close */}
          <button
            onClick={stop}
            className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="닫기"
          >
            <X className="size-4" />
          </button>

          {/* Icon */}
          {isFirst && (
            <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10">
              <Sparkles className="size-6 text-primary" />
            </div>
          )}
          {isLast && (
            <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10">
              <Rocket className="size-6 text-primary" />
            </div>
          )}

          {/* Content */}
          <h3 className="pr-6 text-base font-bold text-foreground leading-snug">
            {step.title}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {step.description}
          </p>

          {/* Progress + Buttons */}
          <div className="mt-5 flex items-center justify-between">
            {/* Progress dots */}
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    i === currentStep
                      ? "w-6 bg-primary"
                      : i < currentStep
                        ? "w-1.5 bg-primary/50"
                        : "w-1.5 bg-border"
                  }`}
                />
              ))}
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2">
              {isFirst ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={stop}
                    className="text-muted-foreground"
                  >
                    나중에 하기
                  </Button>
                  <Button
                    size="sm"
                    onClick={next}
                    className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    시작하기
                    <ChevronRight className="size-4" />
                  </Button>
                </>
              ) : isLast ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={prev}
                    className="gap-1 text-muted-foreground"
                  >
                    <ChevronLeft className="size-4" />
                    이전
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      stop()
                      router.push("/campaigns")
                    }}
                    className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Rocket className="size-4" />
                    캠페인 만들러 가기
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={prev}
                    className="gap-1 text-muted-foreground"
                  >
                    <ChevronLeft className="size-4" />
                    이전
                  </Button>
                  <Button
                    size="sm"
                    onClick={next}
                    className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    다음
                    <ChevronRight className="size-4" />
                    <span className="text-xs text-primary-foreground/60">
                      {currentStep + 1}/{totalSteps}
                    </span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
