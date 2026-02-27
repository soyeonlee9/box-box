"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, ChevronRight, ChevronLeft, LayoutDashboard, BarChart3, UsersRound, QrCode, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const TOUR_STORAGE_KEY = "archetype-tour-completed"

interface TourStep {
  id: string
  title: string
  description: string
  icon: React.ElementType
  targetPath: string
  targetSelector?: string
}

const tourSteps: TourStep[] = [
  {
    id: "dashboard",
    title: "Welcome! This is your Control Tower",
    description: "This is the main dashboard where you can see all your campaign performance at a glance. KPI cards show key metrics, and charts visualize trends over time.",
    icon: LayoutDashboard,
    targetPath: "/",
  },
  {
    id: "analytics",
    title: "Understand Your Customers",
    description: "Here you can peek into your customers' minds. See how they interact with your campaigns, what they feel about your brand, and track their journey from first contact to purchase.",
    icon: BarChart3,
    targetPath: "/analytics",
  },
  {
    id: "segments",
    title: "Group Customers for Better Marketing",
    description: "Divide your customers into groups based on their behavior. Champions are your VIPs, while At-Risk customers need special attention. Use these segments for targeted campaigns!",
    icon: UsersRound,
    targetPath: "/segments",
  },
  {
    id: "campaigns",
    title: "Create and Manage QR Campaigns",
    description: "This is where you create new QR code campaigns. Track scans, run A/B tests to find what works best, and monitor ROI for each campaign.",
    icon: QrCode,
    targetPath: "/campaigns",
  },
  {
    id: "complete",
    title: "You're All Set!",
    description: "Explore on your own now. If you ever need help, click the Help icon in the top-right corner. You can restart this tour anytime from the Help menu.",
    icon: Sparkles,
    targetPath: "/",
  },
]

// Korean translations
const LABELS = {
  welcome: "\uD658\uC601\uD569\uB2C8\uB2E4! \uC5EC\uAE30\uB294 \uBAA8\uB4E0 \uC131\uACFC\uB97C \uD55C\uB208\uC5D0 \uBCF4\uB294 \uAD00\uC81C\uD0D1\uC785\uB2C8\uB2E4.",
  dashboardDesc: "\uBA54\uC778 \uB300\uC2DC\uBCF4\uB4DC\uC5D0\uC11C \uCE94\uD398\uC778 \uC131\uACFC\uB97C \uD55C\uB208\uC5D0 \uD30C\uC545\uD558\uC138\uC694. KPI \uCE74\uB4DC\uB294 \uD575\uC2EC \uC9C0\uD45C\uB97C, \uCC28\uD2B8\uB294 \uC2DC\uAC04\uC5D0 \uB530\uB978 \uCD94\uC774\uB97C \uBCF4\uC5EC\uC90D\uB2C8\uB2E4.",
  analyticsTitle: "\uACE0\uAC1D\uC758 \uC18D\uB9C8\uC74C\uC744 \uC5FF\uBCF4\uC138\uC694",
  analyticsDesc: "\uACE0\uAC1D\uC774 \uCE94\uD398\uC778\uACFC \uC5B4\uB5BB\uAC8C \uC0C1\uD638\uC791\uC6A9\uD558\uB294\uC9C0, \uBE0C\uB79C\uB4DC\uC5D0 \uB300\uD574 \uC5B4\uB5BB\uAC8C \uB290\uB07C\uB294\uC9C0, \uCCAB \uC811\uCD09\uBD80\uD130 \uAD6C\uB9E4\uAE4C\uC9C0\uC758 \uC5EC\uC815\uC744 \uCD94\uC801\uD558\uC138\uC694.",
  segmentsTitle: "\uACE0\uAC1D\uC744 \uADF8\uB8F9\uC73C\uB85C \uB098\uB220 \uB9DE\uCDA4 \uB9C8\uCF00\uD305\uC744 \uD574\uBCF4\uC138\uC694",
  segmentsDesc: "\uD589\uB3D9 \uAE30\uBC18\uC73C\uB85C \uACE0\uAC1D\uC744 \uBD84\uB958\uD558\uC138\uC694. \uCC54\uD53C\uC5B8\uC740 VIP, \uC774\uD0C8 \uC704\uD5D8 \uACE0\uAC1D\uC740 \uD2B9\uBCC4 \uAD00\uB9AC\uAC00 \uD544\uC694\uD574\uC694!",
  campaignsTitle: "QR \uCE94\uD398\uC778\uC744 \uB9CC\uB4E4\uACE0 \uAD00\uB9AC\uD558\uC138\uC694",
  campaignsDesc: "\uC0C8 QR \uCE94\uD398\uC778\uC744 \uB9CC\uB4E4\uACE0, \uC2A4\uCE94 \uC218\uB97C \uCD94\uC801\uD558\uACE0, A/B \uD14C\uC2A4\uD2B8\uB85C \uCD5C\uC801\uC758 \uBC29\uBC95\uC744 \uCC3E\uC73C\uC138\uC694.",
  completeTitle: "\uC900\uBE44 \uC644\uB8CC!",
  completeDesc: "\uC774\uC81C \uC9C1\uC811 \uB458\uB7EC\uBCF4\uC138\uC694! \uB3C4\uC6C0\uC774 \uD544\uC694\uD558\uBA74 \uC6B0\uCE21 \uC0C1\uB2E8 \uB3C4\uC6C0\uB9D0\uC744 \uB20C\uB7EC\uC8FC\uC138\uC694. \uC5B8\uC81C\uB4E0 \uC774 \uD22C\uC5B4\uB97C \uB2E4\uC2DC \uBCFC \uC218 \uC788\uC5B4\uC694.",
  next: "\uB2E4\uC74C",
  prev: "\uC774\uC804",
  skip: "\uAC74\uB108\uB6F0\uAE30",
  finish: "\uC2DC\uC791\uD558\uAE30",
  stepOf: "\uB2E8\uACC4",
}

const koreanSteps: TourStep[] = [
  {
    id: "dashboard",
    title: LABELS.welcome,
    description: LABELS.dashboardDesc,
    icon: LayoutDashboard,
    targetPath: "/",
  },
  {
    id: "analytics",
    title: LABELS.analyticsTitle,
    description: LABELS.analyticsDesc,
    icon: BarChart3,
    targetPath: "/analytics",
  },
  {
    id: "segments",
    title: LABELS.segmentsTitle,
    description: LABELS.segmentsDesc,
    icon: UsersRound,
    targetPath: "/segments",
  },
  {
    id: "campaigns",
    title: LABELS.campaignsTitle,
    description: LABELS.campaignsDesc,
    icon: QrCode,
    targetPath: "/campaigns",
  },
  {
    id: "complete",
    title: LABELS.completeTitle,
    description: LABELS.completeDesc,
    icon: Sparkles,
    targetPath: "/",
  },
]

export function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if tour has been completed
    const completed = localStorage.getItem(TOUR_STORAGE_KEY)
    if (!completed && pathname === "/") {
      // Small delay to let the page load
      const timer = setTimeout(() => setIsOpen(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [pathname])

  const step = koreanSteps[currentStep]

  const handleNext = useCallback(() => {
    if (currentStep < koreanSteps.length - 1) {
      const nextStep = koreanSteps[currentStep + 1]
      if (nextStep.targetPath !== pathname) {
        router.push(nextStep.targetPath)
      }
      setCurrentStep((prev) => prev + 1)
    } else {
      // Tour complete
      localStorage.setItem(TOUR_STORAGE_KEY, "true")
      setIsOpen(false)
      router.push("/")
    }
  }, [currentStep, pathname, router])

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      const prevStep = koreanSteps[currentStep - 1]
      if (prevStep.targetPath !== pathname) {
        router.push(prevStep.targetPath)
      }
      setCurrentStep((prev) => prev - 1)
    }
  }, [currentStep, pathname, router])

  const handleSkip = useCallback(() => {
    localStorage.setItem(TOUR_STORAGE_KEY, "true")
    setIsOpen(false)
  }, [])

  if (!isOpen) return null

  const Icon = step.icon
  const progress = ((currentStep + 1) / koreanSteps.length) * 100

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm" />

      {/* Tour Card */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-primary/20 animate-in fade-in-0 zoom-in-95 duration-300">
          {/* Progress bar */}
          <div className="h-1 w-full bg-secondary overflow-hidden rounded-t-lg">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <CardContent className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="size-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {LABELS.stepOf} {currentStep + 1} / {koreanSteps.length}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-muted-foreground"
                onClick={handleSkip}
              >
                <X className="size-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-foreground mb-2">{step.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="text-muted-foreground text-sm"
              >
                {LABELS.skip}
              </Button>

              <div className="flex items-center gap-2">
                {currentStep > 0 && (
                  <Button variant="outline" onClick={handlePrev} className="gap-1">
                    <ChevronLeft className="size-4" />
                    {LABELS.prev}
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  className="gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {currentStep === koreanSteps.length - 1 ? LABELS.finish : LABELS.next}
                  {currentStep < koreanSteps.length - 1 && <ChevronRight className="size-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

// Hook to restart the tour
export function useRestartTour() {
  const router = useRouter()
  
  return useCallback(() => {
    localStorage.removeItem(TOUR_STORAGE_KEY)
    router.push("/")
    // Force reload to trigger the tour
    window.location.href = "/"
  }, [router])
}
