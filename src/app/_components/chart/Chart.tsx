"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

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

export const description = "A stacked area chart with expand stacking"

const chartData = [
  { month: "January", impression: 186, clicks: 80, ctr: 45 },
  { month: "February", impression: 305, clicks: 200, ctr: 100 },
  { month: "March", impression: 237, clicks: 120, ctr: 150 },
  { month: "April", impression: 73, clicks: 190, ctr: 50 },
  { month: "May", impression: 209, clicks: 130, ctr: 100 },
  { month: "June", impression: 214, clicks: 140, ctr: 160 },
]

const chartConfig = {
  impression: {
    label: "Impressões",
    color: "hsl(var(--chart-1))",
  },
  clicks: {
    label: "Cliques",
    color: "hsl(var(--chart-2))",
  },
  ctr: {
    label: "CTR",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function ChartComponent() {
  return (
    <Card className="mt-5">
      <CardHeader>
        <CardTitle>Grupo Fera - Gráfico de barras</CardTitle>
        <CardDescription>
          Showing total visitors for the last 6months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
            }}
            stackOffset="expand"
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="ctr"
              type="natural"
              fill="var(--color-ctr)"
              fillOpacity={0.1}
              stroke="var(--color-ctr)"
              stackId="a"
            />
            <Area
              dataKey="clicks"
              type="natural"
              fill="var(--color-clicks)"
              fillOpacity={0.4}
              stroke="var(--color-clicks)"
              stackId="a"
            />
            <Area
              dataKey="impression"
              type="natural"
              fill="var(--color-impression)"
              fillOpacity={0.4}
              stroke="var(--color-impression)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
