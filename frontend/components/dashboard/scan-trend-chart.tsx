"use client"

import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
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
const GREEN = "#2D6A4F"
const GRID = "#e5e5e0"
const TICK = "#6b7280"

const scanData = [
  { date: "1일", scans: 320 },
  { date: "2일", scans: 420 },
  { date: "3일", scans: 380 },
  { date: "4일", scans: 510 },
  { date: "5일", scans: 490 },
  { date: "6일", scans: 380 },
  { date: "7일", scans: 350 },
  { date: "8일", scans: 410 },
  { date: "9일", scans: 520 },
  { date: "10일", scans: 610 },
  { date: "11일", scans: 580 },
  { date: "12일", scans: 490 },
  { date: "13일", scans: 450 },
  { date: "14일", scans: 520 },
  { date: "15일", scans: 630 },
  { date: "16일", scans: 710 },
  { date: "17일", scans: 680 },
  { date: "18일", scans: 590 },
  { date: "19일", scans: 540 },
  { date: "20일", scans: 480 },
  { date: "21일", scans: 560 },
  { date: "22일", scans: 650 },
  { date: "23일", scans: 720 },
  { date: "24일", scans: 690 },
  { date: "25일", scans: 610 },
  { date: "26일", scans: 580 },
  { date: "27일", scans: 530 },
  { date: "28일", scans: 620 },
  { date: "29일", scans: 700 },
  { date: "30일", scans: 750 },
]

export function ScanTrendChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          일별 스캔 추이
        </CardTitle>
        <CardDescription>최근 30일 기준 스캔량 흐름</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            scans: {
              label: "스캔 수",
              color: GREEN,
            },
          }}
          className="h-[280px] w-full"
        >
          <AreaChart
            data={scanData}
            margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="scanGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={GREEN}
                  stopOpacity={0.2}
                />
                <stop
                  offset="100%"
                  stopColor={GREEN}
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={GRID}
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: TICK }}
              interval={4}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: TICK }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="scans"
              stroke={GREEN}
              strokeWidth={2.5}
              fill="url(#scanGradient)"
              name="스캔 수"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
