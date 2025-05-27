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
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Cite } from '@citation-js/core';
import '@citation-js/plugin-bibtex';
import { ScrollArea } from "@/components/ui/scroll-area"
import WordCloud from "react-d3-cloud";
import wordCloudServices from "@/services/word_cloud.services";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const MAX_SIZE = 1000000 //1mb

const message = "Campo obrigatório"

type BibFileForm = z.infer<typeof bibFileSchema>;

const bibFileSchema = z.object({
  source: z.string().min(1, message).max(250, message),
  quantity: z.coerce.number().optional(),
  file: z
    .instanceof(File, { message: "Arquivo inválido" })
    .refine((file) => file.type === "application/x-bibtex" || file.name.endsWith(".bib"), {
      message: "O arquivo deve ser um arquivo .bib",
    }),
  rotate: z.coerce.number().optional(),
  padding: z.coerce.number().min(0).max(10).optional(),
  fontMapp: z.enum(["log", "lin"], {
    required_error: "Você deve escolher um tipo de mapeamento",
  }),
  logValue: z.coerce.number().min(0).max(25).optional(),
  linValue: z.coerce.number().min(0).max(10).optional(),
})

export default function AddInputBibtexForm() {

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


    // const onSubmit = (data: BibFileForm) => {
        // const file = data.file;
        // const reader = new FileReader();

        // reader.onload = () => {
        // const text = reader.result as string;
        // console.log("Texto do arquivo:", text);
        // try {
        //     const cite = new Cite(text);
        //     const json = cite.get({ type: "json" });
        //     setParsedData(json);

            
        // } catch (error) {
        //     console.error("Erro ao processar BibTeX:", error);
        // }
        // };

        // reader.readAsText(file);
    // };

    // const createWordCloud = (jsonList: any) => {
    //   const keywordsArray = jsonList.flatMap((item:any) => {
    //     const keywords = item.keyword || item.keywords;
    //     if (typeof keywords === "string") {
    //       return keywords.split(/[,;]/).map(kw => kw.trim().toLowerCase());
    //     }
    //     return [];
    //   });

    // Contagem de frequência
    // const freqMap = new Map<string, number>();

    // keywordsArray.forEach((keyword : any) => {
    //   freqMap.set(keyword, (freqMap.get(keyword) || 0) + 1);
    // });

    // Transformar em array para a wordcloud
    // const wordCloudData = Array.from(freqMap.entries())
    //   .map(([text, value]) => ({ text, value,}))
    //   .sort((a, b) => b.value - a.value)
    //   .slice(0, 200);

    // console.log("Word Cloud Data:", wordCloudData);

    // setWordCloudData(wordCloudData);
    // }

  const [parsedData, setParsedData] = useState<any[]>([]);
  const [wordCloudData, setWordCloudData] = useState<{ text: string; value: number }[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof bibFileSchema>>({
      resolver: zodResolver(bibFileSchema),
      defaultValues: {
          file: undefined,
          rotate: 0,
          quantity: 0,
          padding: 0,
          source: "",
          fontMapp: "log", // ou "lin", dependendo do que você deseja como padrão
          logValue: 10,
          linValue: 1,
      },
  });

  const getWordCloudData =  async (values: z.infer<typeof bibFileSchema>) => {
    console.log(process.env.NEXT_PUBLIC_API_URL)
    const response = await wordCloudServices.getWordCloudData({
      file: values.file,
      source: values.source,
      quantity: values.quantity,
    });

    if (response.status === 200) {
      console.log(response)
      setWordCloudData(response.data || []);
      toast.success("Nuvem de palavras gerada com sucesso!");
      setLoading(false);
    } else {
      setLoading(false);
      toast.error(response.message);
    }
  }

  const onSubmit = (values: z.infer<typeof bibFileSchema>) => {
    console.log("Dados do formulário:", values);
    const file = values.file;
    setLoading(true);
    getWordCloudData(values)
      
  };

  const { errors } = form.formState;

  const { setValue } = form

  const rotateWatch = form.watch("rotate") || 0;
  const paddingWatch = form.watch("padding") || 0;
  const fontMappWatch = form.watch("fontMapp") || "log";
  const linValueWatch = form.watch("linValue");
  const logValueWatch = form.watch("logValue");

  const fontSizeMapper = (word: { value: number }) => Math.log2(word.value + 1) * 10;
  
  const rotate = (word: any) => (~~(Math.random() * 2) * rotateWatch);

  // useEffect(() => {

  // }, [fontMappWatch])

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
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantidade de palavras</FormLabel>
                          <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                {...field}
                                min={0}
                                
                              />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                    )}  
                  />
                  <FormField
                    control={form.control}
                    name="source"
                    render={({ field }) => (
                        <FormItem>
                          <FormLabel>Source:</FormLabel>
                          <FormControl>
                              <Input
                                type="text"
                                placeholder="Digite a fonte do arquivo"
                                {...field} 
                              />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                    )}  
                  />
                  <Button loading={loading} variant={"default"} type="submit">Enviar</Button>
                    {wordCloudData.length > 0 && (
                      <Card className="w-full mt-8">
                        <CardHeader>
                          <CardTitle>Nuvem de Palavras (Keywords)</CardTitle>
                          <div className="my-2 space-y-2">
                              <div>
                                {/* <Button onClick={() => {
                                  rotateValue === 0 ? setRotateValue(90) : setRotateValue(0);
                                }}>
                                  {rotateValue === 0 ? "Rotacionar em 90º" : "Tirar rotação"}
                                </Button> */}
                                  
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
                                )}
                              />
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
                        <CardContent className="w-full">
                          <div className="w-[800px] h-[800px]">
                            <WordCloud
                              data={wordCloudData}
                              fontSize={(word: any) => {
                                if (fontMappWatch === "log") {
                                  return Math.log2(word.value + 1) * Number(logValueWatch); // Exemplo de mapeamento logarítmico
                                } else {
                                  return word.value * Number(linValueWatch); // Example linear mapping
                                }
                              }}
                              rotate={rotate}
                              width={800} // ou 500, teste o tamanho visual desejado
                              height={800}
                              padding={paddingWatch}
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