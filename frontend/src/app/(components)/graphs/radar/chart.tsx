"use client"

import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts"
import { z } from "zod";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button"
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
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface GraphProps {
  chartData: { year: string; papers: number; }[];
  chartConfig: ChartConfig;
  lastYear?: number;
  firstYear?: number;
}

export const formSchema = z.object({
  radarColor: z.string(),
});

type FormData = z.infer<typeof formSchema>;

export function GraphRadarChart({chartData, chartConfig, firstYear, lastYear }: GraphProps) {
    const form = useForm<FormData>({
      resolver: zodResolver(formSchema),
      defaultValues: { 
        radarColor: "#3b38ff",
      },
    });

    const onSubmit = (data: FormData) => {
      console.log("Form submitted with color:", data.radarColor);
    }
  return (
    <Card className="w-[1000px]  mt-0 m-auto">
      <section className="w-full justify-center flex flex-col gap-4">
        <div className="w-1/6 mt-0 m-auto">
          <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <section className="flex flex-col justify-center gap-4">
                    <div>
                      <p className="text-center">Cor do radar:</p>
                      <Input
                          type="color"
                          placeholder="0"
                          onChange={(e) => {
                            form.setValue("radarColor", e.target.value);
                            console.log("Color changed to:", e.target.value);
                          }}
                          value={form.watch("radarColor")}
                          min={0}
                      />
                    </div>
                  </section>
                </form>
            </Form>
        </div>
      <div className="w-full">
        <CardHeader className="items-center pb-4">
          <CardTitle>Total de publicações únicas por ano</CardTitle>
          <CardDescription>
            {firstYear} - {lastYear}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[400px]"
          >
            <RadarChart data={chartData}>
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <PolarAngleAxis dataKey="year" />
              <PolarGrid />
              <Radar
                dataKey="papers"
                fill={form.watch("radarColor") || "#3b38ff"}
                fillOpacity={0.6}
              />
            </RadarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          {/* <div className="flex items-center gap-2 font-medium leading-none">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="flex items-center gap-2 leading-none text-muted-foreground">
            January - June 2024
          </div> */}
        </CardFooter>
      </div>
      </section>
    </Card>
  )
}
