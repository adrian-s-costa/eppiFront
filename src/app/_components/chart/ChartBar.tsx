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
import { useEffect } from "react"
const chartData = [
  { valores: "Valores", impressions: 186, click: 100, ctr: 200 },
]

const chartConfig = {
  impressions: {
    label: "Impressões",
    color: "hsl(var(--chart-1))",
  },
  click: {
    label: "Click",
    color: "hsl(var(--chart-1))",
  },
  ctr: {
    label: "CTR",
    color: "hsl(var(--chart-1))",
  },
  

} satisfies ChartConfig



export function ChartBarComponent({activeValues, mode, initialDate, finalDate}: any) {

  useEffect(()=>{
      
  }, [activeValues])

  console.log(activeValues)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gráfico de barras -  Grupo Fera</CardTitle>
        {
          mode === "fixo" ? 
          <CardDescription>
            {activeValues[0].activeTab == 0 ? "Dados do dia atual" :
              activeValues[0].activeTab == 1 ? "Dados da semana atual" : 
                activeValues[0].activeTab == 2 ? "Dados do mês atual" :
                  activeValues[0].activeTab == 3 ? "Dados do ano atual" : 
                  ""}
          </CardDescription>
          :
          <CardDescription>
            { initialDate === undefined || finalDate === undefined 
              ? ""
              : initialDate + " - " + finalDate}
          </CardDescription>
        }
        
      
        
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={activeValues}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="valores"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="impressions" fill="var(--color-impressions)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
            <Bar dataKey="click" fill="var(--color-impressions)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
            <Bar dataKey="ctr" fill="var(--color-impressions)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  )
}
