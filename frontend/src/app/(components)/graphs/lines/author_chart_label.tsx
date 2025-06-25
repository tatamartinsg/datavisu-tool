"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts"
import { z } from "zod";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";
import '@citation-js/plugin-bibtex';

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

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

interface GraphProps {
  chartData: { authors: string; count: number; }[];
  chartConfig: ChartConfig;

}

export const formSchema = z.object({
  lineColor: z.string(),
  dotColor: z.string(),
});

type FormData = z.infer<typeof formSchema>;

export function AuthorGraphBarLineChartLabel({ chartData, chartConfig}: GraphProps) {
  const form = useForm<FormData>({
      resolver: zodResolver(formSchema),
      defaultValues: { 
        lineColor: "#3b38ff",
        dotColor: "#3b38ff",
      },
    });

    const onSubmit = (data: FormData) => {
      toast.success(`Color set to ${data.lineColor}`);
      // Here you can handle the form submission, e.g., save the color to a database or state
      console.log("Form submitted with color:", data.lineColor);
    }
  
  return (
    <Card className="w-[1200px] mt-0 m-auto flex">
      <section className="flex w-full">
        <div className="w-[200px] p-4">
          <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <section className="flex flex-col justify-center gap-4">
                  <div>
                    <p>Cor da linha:</p>
                    <Input
                        type="color"
                        placeholder="0"
                        onChange={(e) => {
                          form.setValue("lineColor", e.target.value);
                          console.log("Color changed to:", e.target.value);
                        }}
                        value={form.watch("lineColor")}
                        min={0}
                    />
                  </div>
                  <div>
                    <p>Cor dos pontos:</p>
                    <Input
                        type="color"
                        placeholder="0"
                        onChange={(e) => {
                          form.setValue("dotColor", e.target.value);
                          console.log("Color changed to:", e.target.value);
                        }}
                        value={form.watch("dotColor")}
                        min={0}
                    />
                  </div>
                </section>
              </form>
          </Form>
        </div>
      <div className="w-full  ">
        <Separator className="my-2" />
        <CardHeader>
          <CardTitle>Quantidade de publicações por autor(es)</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                top: 35,
                left: 15,
                right: 12,
              }}
              
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="authors"
                tickLine={false}
                axisLine={false}
                tickMargin={0}
                
              //   tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Line
                dataKey="count"
                type="natural"
                stroke={form.watch("lineColor") || "var(--color-papers)"}
                strokeWidth={2}
                dot={{
                  fill: `${form.watch("dotColor") || "var(--color-papers)"} `,
                }}
                activeDot={{
                  r: 6,
                }}
              >
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                  />
                </Line>
              </LineChart>
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
        </div>
      </section>
    </Card>
  )
}
