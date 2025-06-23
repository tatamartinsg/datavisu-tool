import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GraphBarYear } from "./bars/vertical";


export default function GraphsInfo() {

  return (
    <div className="w-full">
        <CardHeader>
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Gerar gráfico</h1>
            <p className="text-gray-400">
              Esta página permite que você gere gráficos a partir de arquivos BibTeX. 
              Basta fazer o upload do seu arquivo BibTeX e escolher o tipo de gráfico que deseja.
            </p>
          </div>
            <h2 className="text-lg font-semibold">Informações</h2>
            <p className="text-sm text-muted-foreground">
                Leia atentamente as instruções a seguir sobre o uso da ferramenta de geração de gráficos
            </p>
        </CardHeader>
        <Separator className="m-4" />
    </div>
  );
}