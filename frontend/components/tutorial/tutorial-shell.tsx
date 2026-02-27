"use client"

import type { ReactNode } from "react"
import { TutorialProvider } from "./tutorial-provider"
import { TutorialOverlay } from "./tutorial-overlay"

export function TutorialShell({ children }: { children: ReactNode }) {
  return (
    <TutorialProvider>
      {children}
      <TutorialOverlay />
    </TutorialProvider>
  )
}
