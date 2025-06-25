"use client"
import { set, z } from "zod";
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
import '@citation-js/plugin-bibtex';
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox"

const MAX_SIZE = 1000000 //1mb

const message = "Este campo é obrigatório";


export const fileWithSourceSchema = z.object({
  file: z.instanceof(File, { message: "Arquivo obrigatório" }),
  source: z.string().min(1, "Fonte obrigatória"),
});

export const formSchema = z.object({
  edgeColor: z.string(),
  nodeColor: z.string(),
  animation: z.boolean(),
});

export type FormData = z.infer<typeof formSchema>;

interface ClassificationFlowProps {
//   setWordCloudData: Dispatch<SetStateAction<{ text: string; value: number; }[]>>;
  setDefaultEdgeOptions: Dispatch<React.SetStateAction<{
    animated: boolean;
      type: string;
      style: {
          stroke: string;
      };
  }>>
  setNodes: React.Dispatch<React.SetStateAction<{
      id: string;
      type: string;
      data: {
          name: string;
          emoji: string;
      };
      position: {
          x: number;
          y: number;
      };
  }[]>>
  // setEdgeColor: Dispatch<SetStateAction<string>>;
  setNodeColor: Dispatch<SetStateAction<string>>;
}

export default function ClassificationFlow({ setDefaultEdgeOptions, setNodeColor, setNodes }: ClassificationFlowProps) {
  const [loading, setLoading] = useState(false);


  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { 
      edgeColor: "#00ffff", // Default color for edges
      nodeColor: "", // Default color for nodes
      animation: true, // Default value for animation
    },
  });


  const onSubmit = (values: FormData) => {
    console.log("Dados do formulário:", values);
    setLoading(true);
      
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Card className="p-8 mb-8">
            {/* <div>
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
            </div> */}
            <div className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name="animation"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormLabel className="text-sm font-medium p-0">
                        Animação das linhas:
                      </FormLabel>
                      <FormControl>              
                        <Checkbox 
                          defaultChecked={field.value}
                          onCheckedChange={(checked) => {
                            setDefaultEdgeOptions((prev :any )=> ({
                              ...prev,
                              animated: checked
                            }));
                            field.onChange(checked);
                            return checked
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="nodeColor"
                render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cor dos nós:</FormLabel>
                      <FormControl>
                          <Input
                            type="color"
                            placeholder="0"
                            onChange={(e) => {
                              form.setValue("nodeColor", e.target.value);
                              setNodeColor(e.target.value);
                              setNodes((prevNodes) =>
                                prevNodes.map((node) => ({
                                  ...node,
                                  style: {
                                    backgroundColor: e.target.value,
                                  }
                                }))
                              );
                              console.log("Color changed to:", e.target.value);
                            }}
                            value={form.watch("nodeColor")}
                            min={0}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                )}  
              />
              <FormField
                control={form.control}
                name="edgeColor"
                render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cor das linhas:</FormLabel>
                      <FormControl>
                          <Input
                            type="color"
                            placeholder="0"
                            onChange={(e) => {
                              form.setValue("edgeColor", e.target.value);
                              setDefaultEdgeOptions((prev :any )=> ({
                                ...prev,
                                style: {
                                  ...prev.style,
                                  stroke: e.target.value
                                }
                              }));
                            }}
                            value={form.watch("edgeColor")}
                            min={0}
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