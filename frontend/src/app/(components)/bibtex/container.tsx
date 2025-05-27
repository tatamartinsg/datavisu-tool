"use client";
import { useEffect, useState } from "react";
import AddInputBibtexForm from "./form";
import WordCloudInfo from "../wordCloud";
import WordCloudForm from "../wordCloud/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import GraphsInfo from "../graphs";
import { GraphHorizontal } from "../graphs/bars/horizontal";
import { GraphBarLineChartLabel } from "../graphs/lines/chart_label";
import { Card } from "@/components/ui/card";
import { GraphRadarChart } from "../graphs/radar/chart";
import { ChartConfig } from "@/components/ui/chart";
import { GraphPieChartDonut } from "../graphs/pie/chart_donut";

export default function Container() {
    const [wordCloudData, setWordCloudData] = useState<{ text: string; value: number }[]>([]);
    const [yearData, setYearData] = useState<{ year: string; count: number }[]>([]);

    const [chartConfig, setChartConfig] = useState<ChartConfig>({})
    const [chartData, setChartData] = useState<
    { year: string; papers: number; }[]>([])

    const getChartConfig = () => {
    let charconfig: { [key: string]: { label: string; color: string } } = {
        papers: {
            label: "Papers",
            color: "hsl(var(--chart-10))",
        }
    }

    yearData.forEach((item, index) => {
        charconfig[item.year.toString()] = {
        label: item.year,
        color: `hsl(var(--chart-${index + 1}))`,
        }
    })
    console.log("Chart Config: ", charconfig)
    setChartConfig(charconfig)
    }

    const getChartData = () => {
    const data = yearData.map((item) => ({
        year: item.year,
        papers: item.count,
        fill: `var(--color-${item.year.toLowerCase()})`, // Assuming you have CSS variables for each year color
    }))

    setChartData(data)
    console.log("Chart Data: ", data)
    }

    useEffect(() => {
        if (yearData.length > 0) {
            getChartConfig()
            getChartData()
        }
    }, [yearData])
    
    return(
        <section className="w-full">
            <AddInputBibtexForm setYearData={setYearData} setWordCloudData={setWordCloudData} />
            <Tabs defaultValue="wordCloud" className="w-full">
                <TabsList className="space-x-2">
                    <TabsTrigger className="hover:bg-slate-50 cursor-pointer" value="wordCloud">Nuvem de palavras</TabsTrigger>
                    <TabsTrigger className="hover:bg-slate-50 cursor-pointer" value="graphs">Gráficos</TabsTrigger>
                </TabsList>
                <TabsContent value="wordCloud">
                    <WordCloudInfo />
                    <WordCloudForm wordCloudData={wordCloudData} />
                </TabsContent>
                <TabsContent value="graphs">
                    <Card>
                        <GraphsInfo />
                        {yearData.length > 0 && (
                            <section>
                                <div className="flex flex-row items-center justify-center gap-8">
                                    <GraphHorizontal chartConfig={chartConfig} chartData={chartData} />
                                    <GraphBarLineChartLabel chartConfig={chartConfig} chartData={chartData} />
                                </div>
                                <div className="flex flex-row items-center justify-center mt-8 gap-8">
                                    <GraphRadarChart chartConfig={chartConfig} chartData={chartData} />
                                    <GraphPieChartDonut chartConfig={chartConfig} chartData={chartData} />
                                </div>
                            </section>
                        )}
                    </Card>
                </TabsContent>
            </Tabs>
        </section>
    )
}

