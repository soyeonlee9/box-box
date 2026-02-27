"use client"

import { PieChart, Pie, Cell, Label } from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
const GREEN_DARK = "#2D6A4F"
const GREEN_LIGHT = "#95D5B2"

const deviceRaw = [
  { name: "iOS", value: 58 },
  { name: "Android", value: 42 },
]

export function DeviceChart() {
  const COLORS = [GREEN_DARK, GREEN_LIGHT]
  const total = deviceRaw.reduce((sum, d) => sum + d.value, 0)

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          주요 접속 기기
        </CardTitle>
        <CardDescription>iOS vs Android 비율</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col items-center">
        <ChartContainer
          config={{
            iOS: { label: "iOS", color: COLORS[0] },
            Android: { label: "Android", color: COLORS[1] },
          }}
          className="h-[200px] w-full"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie
              data={deviceRaw}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {deviceRaw.map((entry, index) => (
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
                          y={viewBox.cy}
                          className="text-2xl font-bold"
                          fill={GREEN_DARK}
                        >
                          {total}%
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>

        <div className="mt-2 flex items-center gap-6">
          {deviceRaw.map((d, i) => (
            <div key={d.name} className="flex items-center gap-2">
              <div
                className="size-3 rounded-full"
                style={{ backgroundColor: COLORS[i] }}
              />
              <span className="text-sm text-muted-foreground">{d.name}</span>
              <span className="text-sm font-semibold text-foreground">
                {d.value}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
