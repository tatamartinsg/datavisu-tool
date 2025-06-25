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
import Image
 from "next/image";
import { ChartColumnIncreasing, ChartPie, ChartSpline, Radar } from "lucide-react";
import { Button } from "@/components/ui/button";
import ClassificationInfo from "../classification";
import { AuthorGraphHorizontal } from "../graphs/bars/author/horizontal";
import { AuthorGraphBarLineChartLabel } from "../graphs/lines/author_chart_label";

export default function Container() {
    const [wordCloudData, setWordCloudData] = useState<{ text: string; value: number }[]>([]);
    const [yearData, setYearData] = useState<{ year: string; count: number }[]>([]);
    const [authorData, setAuthorData] = useState<{ authors: string; count: number }[]>([]);
    const [categories, setCategories] = useState<{ categories: Record<string, string[]> }>({ categories: {} });
    const [firstYear, setFirstYear] = useState<number>(0);
    const [lastYear, setLastYear] = useState<number>(0);
    const [graph, setGraph] = useState<string>("");

    const [chartConfig, setChartConfig] = useState<ChartConfig>({})
    const [chartData, setChartData] = useState<
    { year: string; papers: number; }[]>([])

    const [authorChartConfig, setAuthorChartConfig] = useState<ChartConfig>({})
    const [authorChartData, setAuthorChartData] = useState<
    { authors: string; count: number; }[]>([])

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

    const getAuthorChartConfig = () => {
        let charconfig: { [key: string]: { label: string; color: string } } = {
            count: {
                label: "Quantidade",
                color: "hsl(var(--chart-10))",
            }
        }

        authorData.forEach((item, index) => {
            charconfig[item.authors.toString()] = {
            label: item.authors,
            color: `hsl(var(--chart-10))`,
            }
        })
        console.log("Chart Config: ", charconfig)
        setAuthorChartConfig(charconfig)
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

    const getAuthorChartData = () => {
        const data = authorData.map((item) => ({
            authors: item.authors,
            count: item.count,
            fill: `var(--color-10)`, // Assuming you have CSS variables for each year color
        }))

        setAuthorChartData(data)
        console.log("Author Chart Data: ", data)
    }

    useEffect(() => {
        if (yearData.length > 0) {
            getChartConfig()
            getChartData()
            getAuthorChartData()
            getAuthorChartConfig()
        }
    }, [yearData])
    
    return(
        <section className="w-full">
            <AddInputBibtexForm setCategories={setCategories} setAuthorData={setAuthorData} setYearData={setYearData} setWordCloudData={setWordCloudData} setLastYear={setLastYear} setFirstYear={setFirstYear} />
            <Tabs defaultValue="wordCloud" className="w-full">
                <TabsList className="space-x-2">
                    <TabsTrigger className="hover:bg-slate-50 cursor-pointer" value="wordCloud">Nuvem de palavras</TabsTrigger>
                    <TabsTrigger className="hover:bg-slate-50 cursor-pointer" value="graphs">Gráficos</TabsTrigger>
                    <TabsTrigger className="hover:bg-slate-50 cursor-pointer" value="classification">Classificador</TabsTrigger>
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
                                <div className="flex justify-center gap-4 mb-8">
                                    <Button 
                                        className="flex items-center justify-center"
                                        onClick={() => setGraph("bar")}
                                    >
                                        <ChartColumnIncreasing />
                                        <h1>Bar</h1>
                                    </Button>
                                    <Button 
                                        className="flex items-center justify-center"
                                        onClick={() => setGraph("radar")}
                                    >
                                        <Radar />
                                        <h1>Radar</h1>
                                    </Button>
                                    <Button 
                                        className="flex items-center justify-center"
                                        onClick={() => setGraph("line")}
                                    >
                                        <ChartSpline />
                                        <h1>Line</h1>
                                    </Button>
                                    <Button 
                                        className="flex items-center justify-center"
                                        onClick={() => setGraph("pie")}
                                    >
                                        <ChartPie />
                                        <h1>Pie</h1>
                                    </Button>
                                </div>

                                {graph === "bar" && (
                                    <div>
                                        {/* <AuthorGraphHorizontal chartConfig={authorChartConfig} chartData={authorChartData} /> */}
                                        <GraphHorizontal firstYear={firstYear} lastYear={lastYear} chartConfig={chartConfig} chartData={chartData} />
                                    </div>
                                )}
                                {graph === "line" && 
                                (
                                    <div>
                                        <GraphBarLineChartLabel firstYear={firstYear} lastYear={lastYear} chartConfig={chartConfig} chartData={chartData} />
                                        <AuthorGraphBarLineChartLabel chartConfig={authorChartConfig} chartData={authorChartData} />
                                    </div>
                                )}
                                {graph === "radar" && <GraphRadarChart firstYear={firstYear} lastYear={lastYear} chartConfig={chartConfig} chartData={chartData} />}
                                {graph === "pie" && <GraphPieChartDonut firstYear={firstYear} lastYear={lastYear} chartConfig={chartConfig} chartData={chartData} />}
                            </section>
                        )}
                    </Card>
                </TabsContent>
                <TabsContent value="classification">
                        <ClassificationInfo categories={categories.categories} />
                </TabsContent>
            </Tabs>
        </section>
    )
}

