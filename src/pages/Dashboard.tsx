import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Bot, UserCheck, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const stats = [
  { label: "Total de Leads", value: "1.284", change: "+12%", up: true, icon: Users, color: "text-info" },
  { label: "Conversas por IA", value: "847", change: "+8%", up: true, icon: Bot, color: "text-kanban-ai" },
  { label: "Transferidos (Humano)", value: "312", change: "-3%", up: false, icon: UserCheck, color: "text-kanban-human" },
  { label: "Taxa de Conversão", value: "24.3%", change: "+2.1%", up: true, icon: TrendingUp, color: "text-success" },
];

const hourlyData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, "0")}h`,
  mensagens: Math.floor(Math.random() * 80 + (i > 8 && i < 20 ? 40 : 5)),
}));

const activities = [
  { text: "IA qualificou lead Maria Silva", time: "2 min atrás", type: "ai" },
  { text: "João transferido para atendente Carlos", time: "5 min atrás", type: "transfer" },
  { text: "Novo lead: Pedro Santos (+55 11 9xxxx)", time: "8 min atrás", type: "new" },
  { text: "Venda fechada: Ana Costa - R$ 2.500", time: "15 min atrás", type: "closed" },
  { text: "IA respondeu 12 mensagens simultâneas", time: "20 min atrás", type: "ai" },
  { text: "Atendente Marcos ficou disponível", time: "30 min atrás", type: "agent" },
];

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral do seu CRM</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{s.label}</p>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                </div>
                <div className={`h-10 w-10 rounded-lg bg-secondary flex items-center justify-center ${s.color}`}>
                  <s.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs">
                {s.up ? (
                  <ArrowUpRight className="h-3 w-3 text-success" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-destructive" />
                )}
                <span className={s.up ? "text-success" : "text-destructive"}>{s.change}</span>
                <span className="text-muted-foreground">vs. mês anterior</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border-border">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Volume de Mensagens por Hora</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="hour" className="text-xs" tick={{ fill: "hsl(240 3.8% 46.1%)", fontSize: 11 }} />
                <YAxis className="text-xs" tick={{ fill: "hsl(240 3.8% 46.1%)", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(0 0% 100%)",
                    border: "1px solid hsl(240 5.9% 90%)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="mensagens" fill="hsl(240 5.9% 10%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Atividades Recentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activities.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-foreground leading-tight">{a.text}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
