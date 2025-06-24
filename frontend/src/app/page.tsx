import { ModeToggle } from "@/components/ui/toggle";
import Container from "./(components)/bibtex/container";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 py-12 bg-gray-100 dark:bg-slate-950">
      <div className="flex items-center mb-4 gap-4">
        <h1 className="text-4xl font-bold">BibViz Tool</h1>
        <ModeToggle />
      </div>
      <p className="text-lg mb-8">Essa ferramenta pode ser utilizada para gerar nuvem de palavras e gráficos a partir de arquivos bibtex.</p>
      <div className="w-full flex gap-2">
        <Container />
      </div>
    </div>
  );
}
