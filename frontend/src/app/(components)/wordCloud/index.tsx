import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function WordCloudInfo() {

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Nuvem de palavras / Word Cloud</h1>
                <p className="text-gray-400">
                Esta página permite que você envie um arquivo BibTeX e 
                gere uma nuvem de palavras a partir dos dados contidos nele. 
                A nuvem de palavras é uma representação visual das palavras 
                mais frequentes no arquivo, onde o tamanho de cada palavra indica sua frequência.
                </p>
            </div>
            <h2 className="text-lg font-semibold">Informações</h2>
            <p className="text-sm text-muted-foreground">
                Leia atentamente as instruções a seguir sobre o uso da ferramenta de nuvem de palavras. 
                Esta ferramenta permite que você visualize as palavras mais frequentes em um arquivo BibTeX, 
                onde o tamanho de cada palavra indica sua frequência. 
                Para começar, faça o upload do seu arquivo BibTeX e defina a 
                quantidade de palavras que deseja visualizar na nuvem. 
                Quanto maior a quantidade, mais palavras serão exibidas.
            </p>
        </CardHeader>
        <Separator className="m-4" />
        <CardContent className="space-y-4">
            <div>
                <h2 className="font-semibold">Rotação</h2>
                <p className="text-sm">
                    O campo para escolher a rotação se refere 
                    à orientação das palavras na nuvem.
                </p>
            </div>
            <div>
                <h2 className="font-semibold">Espaçamento</h2>
                <p className="text-sm">
                    O campo para escolher o espaçamento se refere
                    ao espaço entre as palavras na nuvem. 
                    O valor padrão é 1, mas você pode ajustá-lo para aumentar ou diminuir o espaçamento, entre valores de 0 a 10.
                    Desse modo, quanto maior o valor, mais espaçadas as palavras estarão.
                </p>
            </div>
            <div>
                <h2 className="font-semibold">Distribuição do tamanho das palavras</h2>
                <p className="text-sm">
                    Esse campo permite que você escolha como o tamanho das palavras será distribuído na nuvem.
                    Você pode optar por uma distribuição linear ou logarítimica.
                </p>
                <ul className="list-disc pl-5 text-sm space-y-4 my-2">
                    <li>
                        <span className="font-semibold">Logarítmica: </span>O crescimento é suavizado. 
                        Cresce rápido no início, depois desacelera. 
                        Reduz o impacto das palavras extremamente frequentes, 
                        dando mais visibilidade às menos frequentes. 
                        Usa-se frequentemente e especialmente quando 
                        há grande disparidade de frequência nas palavras.
                    </li>
                    <li>
                        <span className="font-semibold">Linear: </span>
                        O tamanho cresce diretamente proporcional ao valor (frequência). Portanto, 
                        se uma palavra aparece 10 vezes, ela terá tamanho 10 * ValorEscolhido, logo
                        se o ValorEscolhido é 10, o tamanho seria 10 * 10 = 100. Usa-se quando os 
                        dados estão bem equilibrados, sem grandes discrepâncias.
                    </li>
                </ul>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}