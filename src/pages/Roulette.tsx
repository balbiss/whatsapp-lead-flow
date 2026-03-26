import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Users, ArrowRight, UserCheck, UserX, Trophy } from "lucide-react";

type Agent = {
  id: string;
  name: string;
  leadsReceived: number;
  available: boolean;
};

const initialAgents: Agent[] = [
  { id: "1", name: "Carlos Mendes", leadsReceived: 42, available: true },
  { id: "2", name: "Marcos Silva", leadsReceived: 38, available: true },
  { id: "3", name: "Juliana Torres", leadsReceived: 45, available: false },
  { id: "4", name: "Rafael Costa", leadsReceived: 36, available: true },
  { id: "5", name: "Patrícia Almeida", leadsReceived: 40, available: true },
];

export default function Roulette() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);

  const toggleAvailable = (id: string) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === id ? { ...a, available: !a.available } : a))
    );
  };

  const availableAgents = agents.filter((a) => a.available);
  const unavailableAgents = agents.filter((a) => !a.available);
  const nextAgent = availableAgents.length
    ? availableAgents.reduce((min, a) => (a.leadsReceived < min.leadsReceived ? a : min), availableAgents[0])
    : null;
  const totalLeads = agents.reduce((sum, a) => sum + a.leadsReceived, 0);
  const topAgent = agents.reduce((max, a) => (a.leadsReceived > max.leadsReceived ? a : max), agents[0]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Roleta de Atendentes</h1>
        <p className="text-sm text-muted-foreground">Rodízio Round Robin automático</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Atendentes</p>
                <p className="text-2xl font-bold text-foreground">{agents.length}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-info">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Disponíveis</p>
                <p className="text-2xl font-bold text-foreground">{availableAgents.length}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-success">
                <UserCheck className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total de Leads</p>
                <p className="text-2xl font-bold text-foreground">{totalLeads}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-warning">
                <Trophy className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-success/30 bg-success/5">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <ArrowRight className="h-5 w-5 text-success flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-success uppercase tracking-wide">Próximo da Fila</p>
                <p className="text-lg font-bold text-foreground truncate">{nextAgent?.name ?? "—"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Disponíveis ({availableAgents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {availableAgents.map((agent) => (
                <div key={agent.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                      <span className="text-xs font-semibold text-muted-foreground">
                        {agent.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{agent.name}</p>
                      <p className="text-xs text-muted-foreground">{agent.leadsReceived} leads recebidos</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {agent.id === nextAgent?.id && (
                      <Badge variant="secondary" className="bg-success/10 text-success border-success/20 text-[10px]">
                        Próximo
                      </Badge>
                    )}
                    <Switch
                      checked={agent.available}
                      onCheckedChange={() => toggleAvailable(agent.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <UserX className="h-4 w-4" />
              Indisponíveis ({unavailableAgents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {unavailableAgents.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Todos disponíveis!</p>
            ) : (
              <div className="divide-y divide-border">
                {unavailableAgents.map((agent) => (
                  <div key={agent.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center opacity-50">
                        <span className="text-xs font-semibold text-muted-foreground">
                          {agent.name.split(" ").map((n) => n[0]).join("")}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{agent.name}</p>
                        <p className="text-xs text-muted-foreground">{agent.leadsReceived} leads</p>
                      </div>
                    </div>
                    <Switch
                      checked={agent.available}
                      onCheckedChange={() => toggleAvailable(agent.id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
