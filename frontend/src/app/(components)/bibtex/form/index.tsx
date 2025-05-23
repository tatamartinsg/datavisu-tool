"use client"
import { z } from "zod";
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
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Cite } from '@citation-js/core';
import '@citation-js/plugin-bibtex';
import { ScrollArea } from "@/components/ui/scroll-area"
import WordCloud from "react-d3-cloud";

const MAX_SIZE = 1000000 //1mb

const messageNomeNoticia = "O nome da notícia deve ter no máximo 250 caracteres"
const messageNomeSubtitle = "A descrição da notícia deve ter no máximo 550 caracteres"
const message = "Campo obrigatório"

type BibFileForm = z.infer<typeof bibFileSchema>;

const bibFileSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.type === "application/x-bibtex" || file.name.endsWith(".bib"), {
      message: "O arquivo deve ser um arquivo .bib",
    }),
  rotate: z.number().optional(),
})

export default function AddInputBibtexForm() {
    const [parsedData, setParsedData] = useState<any[]>([]);
    const [wordCloudData, setWordCloudData] = useState<{ text: string; value: number }[]>([]);

    const form = useForm<BibFileForm>({
        resolver: zodResolver(bibFileSchema),
        defaultValues: {
            file: undefined,
            rotate: 0,
        },
    });

    // const bibtexString = `
    //     @article{einstein1905,
    //     title={Zur Elektrodynamik bewegter Körper},
    //     author={Einstein, Albert},
    //     journal={Annalen der Physik},
    //     volume={322},
    //     number={10},
    //     pages={891--921},
    //     year={1905},
    //     publisher={Wiley Online Library}
    //     }
    // `;

    // const cite = new Cite(bibtexString);

    // const json = cite.get({ type: 'json' });
    // console.log(json);

    // const bib = cite.format('bibtex');
    // console.log(bib);


    const onSubmit = (data: BibFileForm) => {
        const file = data.file;
        const reader = new FileReader();

        reader.onload = () => {
        const text = reader.result as string;
        console.log("Texto do arquivo:", text);
        try {
            const cite = new Cite(text);
            const json = cite.get({ type: "json" });
            setParsedData(json);
            createWordCloud(json);
            
        } catch (error) {
            console.error("Erro ao processar BibTeX:", error);
        }
        };

        reader.readAsText(file);
    };

    const createWordCloud = (jsonList: any) => {
      const keywordsArray = jsonList.flatMap((item:any) => {
        const keywords = item.keyword || item.keywords;
        if (typeof keywords === "string") {
          return keywords.split(/[,;]/).map(kw => kw.trim().toLowerCase());
        }
        return [];
      });

    // Contagem de frequência
    const freqMap = new Map<string, number>();

    keywordsArray.forEach((keyword : any) => {
      freqMap.set(keyword, (freqMap.get(keyword) || 0) + 1);
    });

    // Transformar em array para a wordcloud
    const wordCloudData = Array.from(freqMap.entries())
      .map(([text, value]) => ({ text, value,}))
      .sort((a, b) => b.value - a.value)
      .slice(0, 200); // Limitar a 100 palavras

    console.log("Word Cloud Data:", wordCloudData);

    setWordCloudData(wordCloudData);
    }

  const { errors,  } = form.formState;

  const { setValue } = form

  const rotateWatch = form.watch("rotate") || 0;

  const fontSizeMapper = (word: { value: number }) => Math.log2(word.value) * 5;

  const [rotateValue, setRotateValue] = useState(0);
  
  const rotate = (word: any) => (~~(Math.random() * 2) * rotateValue);

  // useEffect(() => {
  //   const rotate = (word: any) => (~~(Math.random() * 2) * rotateWatch);
  //   setRotate(rotate);
  // }, [rotateWatch]);

  return (
    <div>
      <div className="px-8">
        <h1 className="text-2xl font-bold">Titulo</h1>
        <p className="text-gray-400">Descrição</p>
      </div>
      <div className="p-8">
        <Separator className="mb-8" /> 
        <div className="w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Arquivo BibTeX</FormLabel>
                        <FormControl>
                            <Input
                            type="file"
                            accept=".bib"
                            onChange={(e) => {
                                field.onChange(e.target.files?.[0]);
                            }}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                  />
                    <Button variant={"default"} type="submit">Enviar</Button>
                    {wordCloudData.length > 0 && (
                      <Card className="w-full mt-8">
                        <CardHeader>
                          <CardTitle>Nuvem de Palavras (Keywords)</CardTitle>
                          <div className="my-2 space-y-2">
                              <div>
                                <Button onClick={() => {
                                  rotateValue === 0 ? setRotateValue(90) : setRotateValue(0);
                                }}>
                                  {rotateValue === 0 ? "Rotacionar em 90º" : "Tirar rotação"}
                                </Button>
                                  
                              </div>
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
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                
                              />
                          </div>
                        </CardHeader>
                        <CardContent className="w-full">
                          <div className="w-[800px] h-[800px]">
                            <WordCloud
                              data={wordCloudData}
                              // fontSizeMapper={fontSizeMapper}
                              rotate={rotate}
                              width={330}
                              height={330}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    )}
                </form>
            </Form>

        </div>
      </div>
    </div>
  );
}