import Container from "./(components)/bibtex/container";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 py-12 bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Data Visualization Tool</h1>
      <p className="text-lg mb-8">Essa ferramenta pode ser utilizada para gerar nuvem de palavras e gráficos a partir de arquivos bibtex.</p>
      <div className="w-full flex gap-2">
        <Container />
      </div>
    </div>
  );
}
