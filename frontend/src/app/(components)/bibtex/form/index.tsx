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


const MAX_SIZE = 1000000 //1mb

const message = "Este campo é obrigatório";


export const fileWithSourceSchema = z.object({
  file: z.instanceof(File, { message: "Arquivo obrigatório" }),
  source: z.string().min(1, "Fonte obrigatória"),
});

export const formSchema = z.object({
  items: z.array(fileWithSourceSchema).min(1, "Adicione ao menos um arquivo"),
  quantity: z.coerce.number().optional(),
});

export type FormData = z.infer<typeof formSchema>;

interface AddInputBibtexFormProps {
  setWordCloudData: Dispatch<SetStateAction<{ text: string; value: number; }[]>>;
  setYearData: Dispatch<SetStateAction<{ year: string; count: number; }[]>>;
}

export default function AddInputBibtexForm({ setWordCloudData, setYearData }: AddInputBibtexFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { 
      items: [],
      quantity: undefined, // Default value for quantity
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
          <Input
            type="file"
            accept=".bib"
            multiple
            onChange={handleFileChange}
          />

           {/* <FormField
              control={form.control}
              name={``}
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
            /> */}

           {itemsWatch.length > 0 && fields.map((field, index) => (
           
              <div key={field.id} className="space-y-2">
                <Separator key={field.id} className="my-4 font-bold" />
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
                  className="text-red-500 p-0 opacity-60"
                  onClick={() => remove(index)}
                >
                  Remover arquivo: {form.getValues(`items.${index}.file`)?.name || "Arquivo selecionado"}
                </Button>
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
           
            <Button loading={loading} variant={"default"} type="submit">Enviar</Button>
            <Separator className="my-4" />
          </form>
      </Form>
  );
}