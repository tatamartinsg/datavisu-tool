import Image from "next/image";
import AddInputBibtexForm from "./(components)/bibtex/form";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Ferramenta</h1>
      <p className="text-lg mb-8">Essa ferramenta é top, confia.</p>
      <AddInputBibtexForm />
    </div>
  );
}
