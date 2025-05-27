"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useEffect, useState } from "react"
import { count } from "console"
const chartData2 = [
  { month: "January", desktop: 186, fill: "var(--color-january)" },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
]

const chartConfig2 = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
    january: {
        label: "January",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

interface GraphHorizontalProps {
  chartData: { year: string; papers: number; }[];
  chartConfig: ChartConfig;
}

export function GraphHorizontal({ chartData, chartConfig } : GraphHorizontalProps) {

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <CardTitle>Total Unique Publications per Year (All Sources)</CardTitle>
        <CardDescription>2010 - 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="year"
              tickLine={false}
              tickMargin={12}
              axisLine={false}
              // tickFormatter={(value) => value.slice(0, 4)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent useMixColors={true} hideLabel />}
            />
            <Bar dataKey="papers" fill="var(--color-papers)" radius={2}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={15}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {/* <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div> */}
      </CardFooter>
    </Card>
  )
}
