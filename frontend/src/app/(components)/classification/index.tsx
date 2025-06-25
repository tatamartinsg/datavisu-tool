import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Flow from "./flow";

interface ClassificationInfoProps {
  categories?: Record<string, string[]>;
}

export default function ClassificationInfo(props: ClassificationInfoProps) {

  return (
    <div className="w-full h-screen">
      <Card className="h-full flex flex-col mb-24 border-none border-t-4 shadow-none">
        <CardHeader>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Classificador</h1>
                <p className="text-gray-400">
                Este classificador agrupa automaticamente os artigos com base na similaridade temática dos seus títulos, 
                resumos e palavras-chave. Ele utiliza técnicas de modelagem de tópicos (NMF) para 
                identificar padrões nos textos e nomeia cada grupo com expressões representativas 
                extraídas com o modelo KeyBERT. Em seguida, nomes de categorias semelhantes são agrupados 
                com base na semelhança semântica.
                </p>
            </div>
            <h2 className="text-lg font-semibold">Importância</h2>
              
            <p className="text-sm text-muted-foreground">
              Esse processo é essencial para organizar grandes volumes de artigos em tópicos compreensíveis, 
              facilitando a análise, visualização e extração de insights em revisões sistemáticas 
              e estudos exploratórios.
            </p>
        </CardHeader>
        {/* <Separator className="my-4" /> */}
        <CardContent className="flex-grow h-0 p-0">
          <Flow categories={props.categories} />
        </CardContent>
      </Card>
    </div>
  );
}