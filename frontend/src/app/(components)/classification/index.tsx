import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Flow from "./flow";

interface ClassificationInfoProps {
  categories?: Record<string, string[]>;
}

export default function ClassificationInfo(props: ClassificationInfoProps) {

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Classificador</h1>
                <p className="text-gray-400">
                Escrever algo aqui
                </p>
            </div>
            <h2 className="text-lg font-semibold">Informações</h2>
            <p className="text-sm text-muted-foreground">
                Opa
            </p>
        </CardHeader>
        <Separator className="my-4" />
        <CardContent className="space-y-4">
            <Flow categories={props.categories} />
        </CardContent>
      </Card>
    </div>
  );
}