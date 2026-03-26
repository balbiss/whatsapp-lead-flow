import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Users, ArrowRight } from "lucide-react";

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
  const nextAgent = availableAgents.length
    ? availableAgents.reduce((min, a) => (a.leadsReceived < min.leadsReceived ? a : min), availableAgents[0])
    : null;

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Roleta de Atendentes</h1>
        <p className="text-sm text-muted-foreground">Rodízio Round Robin automático</p>
      </div>

      {nextAgent && (
        <Card className="border-success/30 bg-success/5">
          <CardContent className="p-4 flex items-center gap-3">
            <ArrowRight className="h-5 w-5 text-success" />
            <div>
              <p className="text-xs font-medium text-success uppercase tracking-wide">Próximo da Fila</p>
              <p className="text-sm font-semibold text-foreground">{nextAgent.name}</p>
            </div>
            <Badge variant="secondary" className="ml-auto bg-success/10 text-success border-success/20">
              {nextAgent.leadsReceived} leads
            </Badge>
          </CardContent>
        </Card>
      )}

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Users className="h-4 w-4" />
            Equipe ({agents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {agents.map((agent) => (
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
    </div>
  );
}
