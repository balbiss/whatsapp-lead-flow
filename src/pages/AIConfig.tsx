import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bot, Save, Building2, ShoppingBag, ShieldAlert, ArrowRightLeft } from "lucide-react";
import { toast } from "sonner";

export default function AIConfig() {
  const [personality, setPersonality] = useState("");

  const handleSave = () => {
    toast.success("Configurações salvas com sucesso!");
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configurar IA</h1>
        <p className="text-sm text-muted-foreground">
          Configure o comportamento da IA sem código
        </p>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Dados da Empresa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company">Nome da Empresa</Label>
            <Input id="company" placeholder="Ex: TechSolutions Ltda" className="bg-secondary border-border" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição do Negócio</Label>
            <Textarea
              id="description"
              placeholder="Descreva o que sua empresa faz, seu público-alvo e diferenciais..."
              className="bg-secondary border-border min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            Produtos e Preços
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="products">Liste seus produtos/serviços com preços</Label>
            <Textarea
              id="products"
              placeholder={"Plano Básico - R$97/mês\nPlano Pro - R$197/mês\nPlano Premium - R$397/mês"}
              className="bg-secondary border-border min-h-[120px] font-mono text-sm"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Personalidade da IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={personality} onValueChange={setPersonality}>
            <SelectTrigger className="bg-secondary border-border">
              <SelectValue placeholder="Escolha uma personalidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aggressive">🔥 Vendedor Agressivo — Foco em fechamento</SelectItem>
              <SelectItem value="friendly">😊 Suporte Amigável — Acolhedor e paciente</SelectItem>
              <SelectItem value="formal">👔 Consultor Formal — Profissional e técnico</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <ShieldAlert className="h-4 w-4" />
            Restrições
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="restrictions">O que a IA NÃO pode responder?</Label>
            <Textarea
              id="restrictions"
              placeholder="Ex: Não dar descontos acima de 10%, não falar sobre concorrentes, não prometer prazos..."
              className="bg-secondary border-border min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <ArrowRightLeft className="h-4 w-4" />
            Gatilho de Transferência
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="trigger">Palavras que ativam a transferência para humano</Label>
            <Input
              id="trigger"
              placeholder="Ex: falar com humano, gerente, reclamação, cancelar"
              className="bg-secondary border-border"
            />
            <p className="text-xs text-muted-foreground">
              Separe as palavras-chave por vírgula. Quando o lead mencionar qualquer uma, a IA transfere para um atendente.
            </p>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="gap-2">
        <Save className="h-4 w-4" />
        Salvar Configurações
      </Button>
    </div>
  );
}
