"use client"

import { PieChart, Pie, Cell, Label } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
const GREEN_DARK = "#2D6A4F"
const GREEN_MID = "#40916C"
const GREEN_LIGHT = "#95D5B2"

const progressRaw = [
  { name: "전환 완료", value: 41 },
  { name: "진행 중", value: 35 },
  { name: "대기", value: 24 },
]

export function ConversionProgress() {
  const COLORS = [GREEN_DARK, GREEN_MID, GREEN_LIGHT]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          캠페인 전환율
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <ChartContainer
          config={{
            completed: { label: "전환 완료", color: COLORS[0] },
            inProgress: { label: "진행 중", color: COLORS[1] },
            pending: { label: "대기", color: COLORS[2] },
          }}
          className="h-[200px] w-full"
        >
          <PieChart>
            <Pie
              data={progressRaw}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={85}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
            >
              {progressRaw.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 6}
                          className="text-3xl font-bold"
                          fill={GREEN_DARK}
                        >
                          41%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 16}
                          className="text-xs"
                          fill={GREEN_MID}
                        >
                          전환 완료
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
          {progressRaw.map((d, i) => (
            <div key={d.name} className="flex items-center gap-2">
              <div
                className="size-2.5 rounded-full"
                style={{ backgroundColor: COLORS[i] }}
              />
              <span className="text-xs text-muted-foreground">{d.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
