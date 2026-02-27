import type { Metadata, Viewport } from "next"
import { Inter, Space_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { TutorialShell } from "@/components/tutorial/tutorial-shell"
import { Toaster } from "@/components/ui/sonner"
import { OnboardingTour } from "@/components/onboarding-tour"
import { AuthProvider } from "@/components/providers/AuthProvider"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
})

export const metadata: Metadata = {
  title: "ARCHETYPE Insights | QR Campaign Dashboard",
  description: "ARCHETYPE Insights - QR 캠페인 성과를 한눈에 확인하세요",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#2D6A4F",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body
        className={`${inter.variable} ${spaceMono.variable} font-sans antialiased`}
      >
        <AuthProvider>
          <TutorialShell>
            {children}
          </TutorialShell>
          <Toaster />
          <OnboardingTour />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
