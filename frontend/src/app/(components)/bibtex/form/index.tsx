"use client"
import { z } from "zod";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
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


const MAX_SIZE = 1000000 //1mb

const message = "Este campo é obrigatório";

const bibFileSchema = z.object({
  source: z.string().min(1, message).max(250, message),
  quantity: z.coerce.number().optional(),
  file: z
    .instanceof(File, { message: "Arquivo inválido" })
    .refine((file) => file.type === "application/x-bibtex" || file.name.endsWith(".bib"), {
      message: "O arquivo deve ser um arquivo .bib",
    }),
})

interface AddInputBibtexFormProps {
  setWordCloudData: Dispatch<SetStateAction<{ text: string; value: number; }[]>>;
  setYearData: Dispatch<SetStateAction<{ year: string; count: number; }[]>>;
}

export default function AddInputBibtexForm({ setWordCloudData, setYearData }: AddInputBibtexFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof bibFileSchema>>({
      resolver: zodResolver(bibFileSchema),
      defaultValues: {
          file: undefined,
          quantity: 0,
          source: "",
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
      setYearData(response.year_data || []);
      toast.success("Nuvem de palavras gerada com sucesso!");
      setLoading(false);
    } else {
      setLoading(false);
      toast.error(response.message);
    }
  }

  const onSubmit = (values: z.infer<typeof bibFileSchema>) => {
    console.log("Dados do formulário:", values);
    setLoading(true);
    getWordCloudData(values)
      
  };

  return (
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
            <Separator className="my-4" />
          </form>
      </Form>
  );
}