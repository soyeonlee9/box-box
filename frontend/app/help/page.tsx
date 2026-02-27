"use client"

import { PlayCircle, BookOpen, QrCode, BarChart3, Award, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DesktopSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { useTutorial } from "@/components/tutorial/tutorial-provider"

const chapters = [
  {
    id: 1,
    icon: LayoutDashboard,
    title: "Chapter 1: 대시보드 - 우리 브랜드 성과, 5분 만에 파악하기",
    intro:
      "가장 먼저 보게 될 메인 대시보드는 우리 브랜드의 핵심 성과를 한눈에 볼 수 있는 지휘 본부입니다.",
    table: [
      {
        metric: "총 스캔 수",
        what: "QR 코드가 총 몇 번 스캔되었는지 보여줍니다.",
        how: "캠페인에 대한 전반적인 시장의 관심도를 측정하는 기본 지표입니다.",
      },
      {
        metric: "순 방문자 수",
        what: "몇 명의 고객이 스캔에 참여했는지 보여줍니다.",
        how: "총 스캔 수와 비교하여 한 사람이 몇 번이나 반복적으로 참여하는지 파악할 수 있습니다.",
      },
      {
        metric: "버튼 클릭률",
        what: "QR 스캔 후 연결된 페이지에서 고객이 얼마나 적극적으로 행동했는지 보여줍니다.",
        how: "이 비율이 낮다면, 랜딩페이지의 콘텐츠나 디자인 개선을 고려해볼 수 있습니다.",
      },
      {
        metric: "캠페인 ROI",
        what: "캠페인에 투자한 비용 대비 얼마나 많은 수익을 거뒀는지 보여주는 가장 중요한 지표입니다.",
        how: "ROI가 높은 캠페인의 특징을 분석하여 다음 마케팅 전략에 적용할 수 있습니다.",
      },
    ],
    widgets: [
      {
        name: "일별 스캔 추이",
        desc: "특정 날짜에 스캔이 급증했다면, 그날 진행한 마케팅 활동(e.g., 인플루언서 포스팅)의 효과를 즉각적으로 확인할 수 있습니다.",
      },
      {
        name: "배지 / 리워드 현황",
        desc: "고객들이 얼마나 즐겁게 배지를 모으고, 리워드를 사용하며 브랜드와 상호작용하는지 실시간으로 파악할 수 있습니다. 리워드 사용률이 낮다면, 혜택의 매력도를 높이는 방안을 고민해볼 수 있습니다.",
      },
    ],
  },
  {
    id: 2,
    icon: QrCode,
    title: "Chapter 2: QR 캠페인 관리 - 과학적인 마케팅 설계하기",
    intro:
      "이곳에서는 캠페인을 만들고, 성과를 비교하며, 더 나은 마케팅을 위한 A/B 테스트를 진행할 수 있습니다.",
    features: [
      {
        name: "새 캠페인 생성",
        desc: "'+ 새 캠페인 생성' 버튼을 눌러 새로운 QR 코드 캠페인을 시작하세요. 캠페인 이름, 연결할 URL, 그리고 이번 캠페인을 통해 지급할 3D 배지를 선택할 수 있습니다.",
      },
      {
        name: "A/B 테스트",
        desc: "똑같은 엽서라도, 어떤 문구나 디자인의 QR 코드가 더 높은 스캔율을 보일까요? A/B 테스트 기능을 활용해 두 가지 시안을 등록하고, 어떤 것이 더 효과적인지 데이터로 직접 확인하세요.",
      },
      {
        name: "성과 지표 (전환율, ROI)",
        desc: "각 캠페인이 얼마나 많은 고객을 최종 목표(e.g., 회원가입, 구매)로 이끌었는지, 그리고 얼마의 수익을 가져다주었는지 직관적으로 비교 분석할 수 있습니다.",
      },
    ],
  },
  {
    id: 3,
    icon: BarChart3,
    title: "Chapter 3: 고객 여정 분석 - 스캔 너머의 진짜 고객 마음 읽기",
    intro:
      "이 페이지는 우리 고객들이 누구이며, 무엇을 느끼고, 어떻게 행동하는지 심층적으로 분석하는 공간입니다.",
    features: [
      {
        name: "스캔 후 행동 퍼널",
        desc: "고객들이 QR 스캔 후 우리가 원하는 최종 목표까지 도달하는 과정에서 어느 단계에서 가장 많이 이탈하는지 보여줍니다. 예를 들어, '랜딩페이지 조회' 단계에서 이탈률이 높다면, 페이지 로딩 속도나 디자인에 문제가 있을 수 있다고 추측할 수 있습니다.",
      },
      {
        name: "고객 추천 지수(NPS) & 감성 분석",
        desc: "고객들이 우리 브랜드를 얼마나 좋아하고 추천하고 싶은지, 그리고 우리 제품/서비스에 대해 어떤 감정을 느끼고 있는지(긍정/부정) 수치로 보여줍니다.",
      },
      {
        name: "핵심 키워드",
        desc: "고객들이 남긴 피드백에서 가장 많이 언급된 단어들을 보여줍니다. '디자인 예쁨', '배송 빠름'과 같은 긍정 키워드는 우리의 강점이며, '가격 비쌈', '포장 아쉬움'과 같은 부정 키워드는 우리가 개선해야 할 지점입니다.",
      },
    ],
  },
  {
    id: 4,
    icon: Award,
    title: "Chapter 4: 리워드 / 배지 관리 - 고객을 브랜드의 찐팬으로!",
    intro:
      "고객의 구매를 일회성으로 끝나지 않게 하고, 계속해서 우리 브랜드를 찾게 만드는 '게이미피케이션'의 핵심 공간입니다.",
    features: [
      {
        name: "3D 배지 관리",
        desc: "'+ 배지 추가' 버튼을 눌러 새로운 3D 배지를 등록합니다. 시즌 컨셉(e.g., 벚꽃, 눈사람)이나 브랜드 상징(e.g., 로고, 대표 제품)을 활용한 예쁜 3D 배지 이미지를 업로드하고, 획득 조건을 설정하세요. (e.g., '24SS 시즌 제품 QR 스캔 시 획득')",
      },
      {
        name: "리워드 관리",
        desc: "'+ 리워드 추가' 버튼을 눌러 고객에게 제공할 혜택을 만듭니다. '배지 5개 수집 시 10% 할인 쿠폰'과 같이, 배지 수집이 실질적인 혜택으로 이어지도록 설계하여 고객의 수집 욕구를 자극하세요.",
      },
    ],
  },
]

export default function HelpPage() {
  const { start } = useTutorial()

  return (
    <div className="min-h-screen bg-background">
      <DesktopSidebar />
      <div className="lg:pl-64">
        <DashboardHeader />

        <main className="p-4 lg:p-6">
          {/* Title row */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl text-balance">
                도움말
              </h1>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                Archetype Insights 대시보드의 모든 기능을 활용하는 방법을 알아보세요.
              </p>
            </div>
            <Button
              onClick={() => start()}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <PlayCircle className="size-4" />
              튜토리얼 다시 보기
            </Button>
          </div>

          {/* Hero card */}
          <Card className="mt-6 border-primary/20 bg-primary/5">
            <CardContent className="flex items-start gap-4 p-6">
              <div className="hidden sm:flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <BookOpen className="size-6 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  데이터로 고객을 사로잡는 방법
                </h2>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  Archetype Insights는 단순한 QR 코드 스캔 수를 넘어, 고객의 마음을 얻고 비즈니스 성장을 이끄는 강력한 데이터 분석 및 게이미피케이션 플랫폼입니다. 본 가이드를 통해 대시보드의 모든 기능을 100% 활용하는 방법을 알아보세요.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Chapters */}
          <div className="mt-6 flex flex-col gap-6">
            {chapters.map((chapter) => (
              <Card key={chapter.id} id={`chapter-${chapter.id}`}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <chapter.icon className="size-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg font-bold leading-snug">
                      {chapter.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {chapter.intro}
                  </p>

                  {/* KPI table (Chapter 1) */}
                  {chapter.table && (
                    <div className="mt-5 overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="py-2.5 pr-4 text-left font-semibold text-foreground">
                              지표 (KPI)
                            </th>
                            <th className="py-2.5 pr-4 text-left font-semibold text-foreground">
                              무엇을 알려주나요?
                            </th>
                            <th className="py-2.5 text-left font-semibold text-foreground">
                              어떻게 활용할까요?
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {chapter.table.map((row) => (
                            <tr
                              key={row.metric}
                              className="border-b border-border last:border-0"
                            >
                              <td className="py-3 pr-4 font-semibold text-primary whitespace-nowrap">
                                {row.metric}
                              </td>
                              <td className="py-3 pr-4 text-muted-foreground leading-relaxed">
                                {row.what}
                              </td>
                              <td className="py-3 text-muted-foreground leading-relaxed">
                                {row.how}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Widget tips (Chapter 1) */}
                  {chapter.widgets && (
                    <div className="mt-5 flex flex-col gap-3">
                      <p className="text-sm font-semibold text-foreground">
                        핵심 위젯 활용법:
                      </p>
                      {chapter.widgets.map((w) => (
                        <div
                          key={w.name}
                          className="rounded-lg bg-secondary/70 p-4"
                        >
                          <p className="text-sm font-semibold text-foreground">
                            {w.name}
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                            {w.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Feature list (Chapters 2-4) */}
                  {chapter.features && (
                    <div className="mt-5 flex flex-col gap-3">
                      <p className="text-sm font-semibold text-foreground">
                        주요 기능:
                      </p>
                      {chapter.features.map((f, i) => (
                        <div
                          key={f.name}
                          className="flex gap-3 rounded-lg bg-secondary/70 p-4"
                        >
                          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                            {i + 1}
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground">
                              {f.name}
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                              {f.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Closing message */}
          <Card className="mt-6 border-primary/20 bg-primary/5">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Archetype Insights는 브랜드 관리자님께서 데이터를 기반으로 더 현명한 의사결정을 내리고, 고객과 더 깊은 관계를 맺을 수 있도록 돕는 파트너입니다.
              </p>
              <p className="mt-2 text-sm font-semibold text-primary">
                지금 바로 새로운 캠페인을 만들어 고객들에게 특별한 언박싱 경험을 선물해보세요!
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
