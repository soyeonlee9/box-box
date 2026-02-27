"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react"
import { useRouter, usePathname } from "next/navigation"

/* ── Step definition ── */
export interface TourStep {
  /** CSS selector to spotlight, or null for a centered modal */
  target: string | null
  /** The page path this step lives on */
  page: string
  /** Tooltip / modal title */
  title: string
  /** Tooltip / modal description */
  description: string
  /** Position of the tooltip relative to the target */
  placement?: "top" | "bottom" | "left" | "right"
}

/* ── Default tour steps ── */
const defaultSteps: TourStep[] = [
  {
    target: null,
    page: "/",
    title: "Archetype Insights에 오신 것을 환영합니다!",
    description:
      "데이터로 고객을 사로잡는 가장 쉬운 방법, Archetype Insights의 핵심 기능을 빠르게 둘러보시겠어요?",
  },
  {
    target: '[data-tour="kpi-roi"]',
    page: "/",
    title: "ROI 분석",
    description:
      "이곳에서 캠페인의 최종 투자수익률을 한눈에 확인하세요. 어떤 캠페인이 진짜 '효자'인지 알 수 있죠.",
    placement: "bottom",
  },
  {
    target: '[data-tour="funnel-chart"]',
    page: "/analytics",
    title: "고객 행동 퍼널",
    description:
      "고객들이 QR 스캔 후 어떤 여정을 거치는지, 어느 단계에서 이탈하는지 분석하여 마케팅 깔때기를 최적화할 수 있습니다.",
    placement: "bottom",
  },
  {
    target: '[data-tour="badge-grid"]',
    page: "/rewards",
    title: "3D 배지 관리",
    description:
      "이곳에서 캠페인과 연동될 3D 배지를 만들고 관리합니다. 고객에게 수집의 재미를 선물하여 브랜드의 '찐팬'으로 만드세요!",
    placement: "top",
  },
  {
    target: null,
    page: "/rewards",
    title: "모든 준비가 끝났습니다!",
    description:
      "지금 바로 첫 캠페인을 만들고 고객과 더 깊게 연결되어 보세요.",
  },
]

/* ── Context ── */
interface TutorialContextValue {
  isRunning: boolean
  currentStep: number
  totalSteps: number
  step: TourStep | null
  start: () => void
  next: () => void
  prev: () => void
  stop: () => void
}

const TutorialContext = createContext<TutorialContextValue>({
  isRunning: false,
  currentStep: 0,
  totalSteps: 0,
  step: null,
  start: () => {},
  next: () => {},
  prev: () => {},
  stop: () => {},
})

export const useTutorial = () => useContext(TutorialContext)

/* ── Provider ── */
export function TutorialProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [pendingStep, setPendingStep] = useState<number | null>(null)

  const steps = defaultSteps
  const step = steps[currentStep] ?? null

  /* auto-start on first visit */
  useEffect(() => {
    if (typeof window === "undefined") return
    const seen = localStorage.getItem("archetype-tour-seen")
    if (!seen) {
      const timer = setTimeout(() => {
        setIsRunning(true)
        setCurrentStep(0)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [])

  /* handle page navigation for tour steps */
  useEffect(() => {
    if (pendingStep !== null && step && pathname === step.page) {
      // We've arrived at the right page, clear pending
      setPendingStep(null)
    }
  }, [pathname, pendingStep, step])

  // When pending step changes and we're on the right page, update the step
  useEffect(() => {
    if (pendingStep !== null && steps[pendingStep]?.page === pathname) {
      setCurrentStep(pendingStep)
      setPendingStep(null)
    }
  }, [pendingStep, pathname, steps])

  const start = useCallback(() => {
    setCurrentStep(0)
    setIsRunning(true)
    if (pathname !== "/") {
      router.push("/")
    }
  }, [pathname, router])

  const stop = useCallback(() => {
    setIsRunning(false)
    setCurrentStep(0)
    setPendingStep(null)
    localStorage.setItem("archetype-tour-seen", "true")
  }, [])

  const next = useCallback(() => {
    const nextIdx = currentStep + 1
    if (nextIdx >= steps.length) {
      stop()
      return
    }
    const nextStep = steps[nextIdx]
    if (nextStep.page !== pathname) {
      setPendingStep(nextIdx)
      setCurrentStep(nextIdx)
      router.push(nextStep.page)
    } else {
      setCurrentStep(nextIdx)
    }
  }, [currentStep, steps, pathname, router, stop])

  const prev = useCallback(() => {
    const prevIdx = currentStep - 1
    if (prevIdx < 0) return
    const prevStep = steps[prevIdx]
    if (prevStep.page !== pathname) {
      setPendingStep(prevIdx)
      setCurrentStep(prevIdx)
      router.push(prevStep.page)
    } else {
      setCurrentStep(prevIdx)
    }
  }, [currentStep, steps, pathname, router])

  return (
    <TutorialContext.Provider
      value={{
        isRunning,
        currentStep,
        totalSteps: steps.length,
        step,
        start,
        next,
        prev,
        stop,
      }}
    >
      {children}
    </TutorialContext.Provider>
  )
}
