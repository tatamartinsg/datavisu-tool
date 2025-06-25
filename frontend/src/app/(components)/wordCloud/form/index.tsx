"use client"
import { set, z } from "zod";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import '@citation-js/plugin-bibtex';
import WordCloud from "react-d3-cloud";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const wordCloudSchema = z.object({
  rotate: z.coerce.number().optional(),
  padding: z.coerce.number().min(0).max(10).optional(),
  fontMapp: z.enum(["log", "lin"], {
    required_error: "Você deve escolher um tipo de mapeamento",
  }),
  logValue: z.coerce.number().min(0).max(25).optional(),
  linValue: z.coerce.number().min(0).max(10).optional(),
})

export default function WordCloudForm({ wordCloudData } : { wordCloudData: { text: string; value: number }[] }) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof wordCloudSchema>>({
      resolver: zodResolver(wordCloudSchema),
      defaultValues: {
          rotate: 0,
          padding: 0,
          fontMapp: "log", // ou "lin", dependendo do que você deseja como padrão
          logValue: 10,
          linValue: 1,
      },
  });

  const onSubmit = (values: z.infer<typeof wordCloudSchema>) => {
    console.log("Dados do formulário:", values);
      
  };

  const { errors } = form.formState;

  const { setValue } = form

  const rotateWatch = form.watch("rotate") || 0;
  const paddingWatch = form.watch("padding") || 0;
  const fontMappWatch = form.watch("fontMapp") || "log";
  const linValueWatch = form.watch("linValue");
  const logValueWatch = form.watch("logValue");

  const fontSizeMapper = (word: { value: number }) => Math.log2(word.value + 1) * 10;
  
//   const rotate = (word: any) => (~~(Math.random() * 2) * rotateWatch);

  const [tooltip, setTooltip] = useState({ visible: false, text: '', x: 0, y: 0 });

  const handleMouseOver = (event, word) => {
    setTooltip({
        visible: true,
        text: `${word.text} (${word.value})`,
        x: event.clientX,
        y: event.clientY,
    });
    };

    const handleMouseOut = () => {
    setTooltip({ ...tooltip, visible: false });
    };

    const dataWithFixedRotationRef = useRef<{ text: string; value: number; rotate: number }[]>([]);

    const [rotate, setRotate] = useState(0);

    useEffect(() => {
        setRotate((~~(Math.random() * 2) * rotateWatch));
    }, [rotateWatch]);

    const wordCloudElement = useMemo(() => (
    <WordCloud
        data={wordCloudData}
        fontSize={(word: any) => fontMappWatch === "log"
        ? Math.log2(word.value + 1) * Number(logValueWatch)
        : word.value * Number(linValueWatch)
        }
        onWordMouseOver={handleMouseOver}
        onWordMouseOut={handleMouseOut}
        rotate={rotate}
        width={800}
        height={800}
        padding={paddingWatch}
    />
    ), [wordCloudData, fontMappWatch, logValueWatch, linValueWatch, paddingWatch, rotateWatch]);

  return (
    <div className="w-full">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
                {wordCloudData.length > 0 && (
                    <Card className="w-full flex flex-row mt-8">
                        <CardHeader className="w-1/2">
                            <div className="my-2 space-y-8">
                                <CardTitle>Nuvem de Palavras (Keywords)</CardTitle>
                                <FormField
                                control={form.control}
                                name="rotate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Escolha um valor para rotacionar as palavras:</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Rotação"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={form.control}
                                name="padding"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Escolha um valor para o espaçamento entre as palavras:</FormLabel>
                                        <FormDescription>Entre (0 e 10), para 0 muito perto e 10 mais distantes</FormDescription>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Espaçamento"
                                                {...field}
                                                onChange={(e) => {
                                                const value = parseFloat(e.target.value);
                                                if (value >= 0 && value <= 10) {
                                                    field.onChange(value);
                                                }
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                            control={form.control}
                            name="fontMapp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Escolha como será distribuído o tamanho das palavras:</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-col space-y-1"
                                        >
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="log" />
                                            </FormControl>
                                            <FormLabel className="log">
                                                Logarítmico
                                            </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="lin" />
                                            </FormControl>
                                            <FormLabel className="lin">
                                                Linear
                                            </FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormDescription>
                                        Logarítmico: O crescimento é suavizado. 
                                        Cresce rápido no início, depois desacelera. 
                                        Reduz o impacto das palavras extremamente frequentes, 
                                        dando mais visibilidade às menos frequentes. 
                                        Usa-se frequentemente e especialmente quando 
                                        há grande disparidade de frequência nas palavras.

                                    </FormDescription>
                                    <FormDescription>
                                        Linear:
                                        O tamanho cresce diretamente proporcional ao valor (frequência). Portanto, 
                                        se uma palavra aparece 10 vezes, ela terá tamanho 10 * ValorEscolhido, logo
                                        se o ValorEscolhido é 10, o tamanho seria 10 * 10 = 100. Usa-se quando os 
                                        dados estão bem equilibrados, sem grandes discrepâncias.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                            {fontMappWatch === "log" && (
                            <FormField
                                control={form.control}
                                name="logValue"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Escolha um valor para o tamanho das palavras (log):</FormLabel>
                                    <FormDescription>Entre (0 e 25), para 0 muito pequeno e 25 maior</FormDescription>
                                    <FormControl>
                                        <Input
                                        type="number"
                                        placeholder="Tamanho das palavras"
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            )}
                            {fontMappWatch === "lin" && (
                            <FormField
                                control={form.control}
                                name="linValue"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Escolha um valor para o tamanho das palavras (linear):</FormLabel>
                                    <FormDescription>Entre (0 e 10), para 0 muito pequeno e 10 maior</FormDescription>
                                    <FormControl>
                                        <Input
                                        type="number"
                                        placeholder="Tamanho das palavras"
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="w-1/2">
                        <div className="">
                            {wordCloudElement}
                            {tooltip.visible && (
                                <div
                                style={{
                                    position: 'fixed',
                                    top: tooltip.y + 10,
                                    left: tooltip.x + 10,
                                    background: 'rgba(0, 0, 0, 0.8)',
                                    color: '#fff',
                                    padding: '6px 10px',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    pointerEvents: 'none',
                                    zIndex: 9999,
                                }}
                                >
                                {tooltip.text}
                                </div>
                            )}
                        </div>
                    </CardContent>
                    </Card>
                )}
            </form>
        </Form>
    </div>
  );
}