"use client"
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
import wordCloudServices from "@/services/word_cloud.services";
import { withMask } from 'use-mask-input';
import { Label } from "recharts";
import { Card } from "@/components/ui/card";

const MAX_SIZE = 1000000 //1mb

const message = "Este campo é obrigatório";


export const fileWithSourceSchema = z.object({
  file: z.instanceof(File, { message: "Arquivo obrigatório" }),
  source: z.string().min(1, "Fonte obrigatória"),
});

export const formSchema = z.object({
  items: z.array(fileWithSourceSchema).min(1, "Adicione ao menos um arquivo"),
  quantity: z.coerce.number().optional(),
  firstYear: z.coerce.number(),
  lastYear: z.coerce.number(),
});

export type FormData = z.infer<typeof formSchema>;

interface AddInputBibtexFormProps {
  setWordCloudData: Dispatch<SetStateAction<{ text: string; value: number; }[]>>;
  setYearData: Dispatch<SetStateAction<{ year: string; count: number; }[]>>;
  setFirstYear: Dispatch<SetStateAction<number>>;
  setLastYear: Dispatch<SetStateAction<number>>;
}

export default function AddInputBibtexForm({ setWordCloudData, setYearData, setFirstYear, setLastYear }: AddInputBibtexFormProps) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { 
      items: [],
      quantity: 100, // Default value for quantity
      firstYear: 2000, // Default value for first year
      lastYear: 2025, // Default value for last year
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const getWordCloudData =  async (values: FormData) => {
    console.log(values)
    const response = await wordCloudServices.getWordCloudData({
      items: values.items,
      quantity: values.quantity,
      firstYear: values.firstYear,
      lastYear: values.lastYear,
    });

    if (response.status === 200) {
      console.log(response)
      setWordCloudData(response.data || []);
      setYearData(response.year_data || []);
      setFirstYear(values.firstYear);
      setLastYear(values.lastYear);
      toast.success("Nuvem de palavras gerada com sucesso!");
      setLoading(false);
    } else {
      setLoading(false);
      toast.error(response.message);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      append({ file, source: "" });
    });

    // Reset file input to allow uploading same file again
    e.target.value = "";
  };

  const onSubmit = (values: FormData) => {
    console.log("Dados do formulário:", values);
    setLoading(true);
    getWordCloudData(values)
      
  };

  const itemsWatch = form.watch(`items`);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Card className="p-8 mb-8">
            <div>
              <FormLabel className="text-sm font-medium p-0">
                Adicione os arquivos BibTeX:
              </FormLabel>
              <FormControl>
                <Input
                type="file"
                accept=".bib"
                multiple
                onChange={handleFileChange}
              />
              </FormControl>
            </div>

            {itemsWatch.length > 0 && fields.map((field, index) => (
           
              <div key={field.id} className="space-y-2">
                <Separator key={field.id} className="my-4 font-bold" />
                <div className="flex flex-col gap-2">
                  <FormField
                    control={form.control}
                    name={`items.${index}.source`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Escreva a fonte para o arquivo: {form.getValues(`items.${index}.file`)?.name || "Arquivo selecionado"} </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Fonte ex: Scopus, Scholar..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="link"
                    className="text-red-500 p-0 opacity-60 dark:text-red-500 dark:opacity-80"
                    onClick={() => remove(index)}
                  >
                    Remover arquivo: {form.getValues(`items.${index}.file`)?.name || "Arquivo selecionado"}
                  </Button>
                </div>
              </div>
            ))}
          
          <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade de palavras para a Word Cloud</FormLabel>
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

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="firstYear"
                render={({ field }) => (
                    <FormItem>
                      <FormLabel>Digite o ano inicial para análise:</FormLabel>
                      <FormControl>
                          <Input
                            type="number"
                            // placeholder="YYYY"
                            {...field}
                            min={1000}
                          />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                )}  
              />
              <FormField
                control={form.control}
                name="lastYear"
                render={({ field }) => (
                    <FormItem>
                      <FormLabel>Digite o último ano para análise:</FormLabel>
                      <FormControl>
                          <Input
                            type="number"
                            {...field}
                            min={1000}
                            max={2030}
                          />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                )}  
              />
            </div>
            <Button loading={loading} variant={"default"} className="w-32" type="submit">Enviar</Button>
          </Card>
      </form>
    </Form>
  );
}