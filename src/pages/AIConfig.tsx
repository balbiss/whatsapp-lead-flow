import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bot, Save, Building2, ShoppingBag, ShieldAlert, ArrowRightLeft, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import SubscriptionGuard from "@/components/SubscriptionGuard";

const AIConfig = () => {
  const { tenant } = useAuth();
  const [personality, setPersonality] = useState("");

  const handleSave = () => {
    toast.success("Configurações da empresa salvas com sucesso!");
  };

  return (
    <SubscriptionGuard>
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Cérebro da IA</h1>
            <p className="text-muted-foreground">
              Personalize o atendente robótico para <span className="font-semibold text-primary">{tenant?.name}</span>.
            </p>
          </div>
          <Button onClick={handleSave} className="gap-2 h-12 px-6 font-bold shadow-lg shadow-primary/20">
            <Save className="h-5 w-5" />
            Salvar Configurações
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border shadow-sm border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-500" />
                Contexto do Negócio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company" className="font-semibold">Nome para Atendimento</Label>
                <Input id="company" defaultValue={tenant?.name} className="bg-slate-50 border-slate-200" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="font-semibold">O que sua empresa faz?</Label>
                <Textarea
                  id="description"
                  placeholder="Ex: Somos uma concessionária de luxo focada em veículos importados..."
                  className="bg-slate-50 border-slate-200 min-h-[120px]"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm border-l-4 border-l-emerald-500">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-emerald-500" />
                Catálogo e Preços
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="products" className="font-semibold">Lista de Produtos/Serviços</Label>
                <Textarea
                  id="products"
                  placeholder={"Produto A - R$ 99,00\nServiço B - R$ 450,00"}
                  className="bg-slate-50 border-slate-200 min-h-[160px] font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm border-l-4 border-l-amber-500">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                Voz da Marca (Personalidade)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-semibold">Estilo de Comunicação</Label>
                  <Select value={personality} onValueChange={setPersonality}>
                    <SelectTrigger className="bg-slate-50 border-slate-200 h-11">
                      <SelectValue placeholder="Escolha como a IA deve falar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aggressive">🔥 Vendedor Agressivo — Foco em gatilhos e escassez</SelectItem>
                      <SelectItem value="friendly">😊 Amigável e Solícito — Acolhedor e paciente</SelectItem>
                      <SelectItem value="formal">👔 Executivo — Profissional, técnico e direto</SelectItem>
                      <SelectItem value="relaxed">😎 Casual — Linguagem leve e com emojis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 italic text-sm text-amber-800">
                  "A personalidade define o tom de voz, as gírias e a forma como a IA tenta conduzir o lead para o fechamento."
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm border-l-4 border-l-red-500">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-red-500" />
                Regras de Proteção
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="restrictions" className="font-semibold">O que é PROIBIDO falar?</Label>
                <Textarea
                  id="restrictions"
                  placeholder="Ex: Não falar sobre política, não prometer prazos de entrega inferiores a 3 dias..."
                  className="bg-slate-50 border-slate-200 min-h-[120px]"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm lg:col-span-2 border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5 text-primary" />
                Transbordo para Humano
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="trigger" className="font-semibold">Palavras-chave de Transferência</Label>
                  <Input
                    id="trigger"
                    placeholder="Ex: atendente, ajuda, humano, suporte, gerente"
                    className="bg-slate-50 border-slate-200 h-11"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Separe as palavras por vírgula. Quando o lead digitar qualquer uma delas, o robô pausará e notificará sua equipe.
                  </p>
                </div>
                <div className="flex items-center justify-center p-6 bg-slate-50 rounded-2xl border border-dashed text-center">
                  <div className="space-y-1">
                    <p className="text-2xl font-black text-primary">24/7</p>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Monitoramento IA</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SubscriptionGuard>
  );
};

export default AIConfig;
