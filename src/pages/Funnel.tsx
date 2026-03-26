import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Bot, User, Clock, Phone, GripVertical } from "lucide-react";

type Lead = {
  id: string;
  name: string;
  phone: string;
  waitTime: string;
  handler: "ai" | "human";
  column: string;
};

const columns = [
  { id: "new", title: "Novo Lead", color: "bg-kanban-new" },
  { id: "ai", title: "Atendimento IA", color: "bg-kanban-ai" },
  { id: "interested", title: "Interessados", color: "bg-kanban-interested" },
  { id: "human", title: "Atend. Humano", color: "bg-kanban-human" },
  { id: "closed", title: "Fechado", color: "bg-kanban-closed" },
];

const initialLeads: Lead[] = [
  { id: "1", name: "Maria Silva", phone: "(11) 98765-4321", waitTime: "2 min", handler: "ai", column: "new" },
  { id: "2", name: "João Santos", phone: "(21) 91234-5678", waitTime: "5 min", handler: "ai", column: "ai" },
  { id: "3", name: "Ana Costa", phone: "(31) 99876-5432", waitTime: "12 min", handler: "ai", column: "ai" },
  { id: "4", name: "Pedro Lima", phone: "(41) 98765-1234", waitTime: "8 min", handler: "ai", column: "interested" },
  { id: "5", name: "Carla Souza", phone: "(51) 91234-9876", waitTime: "20 min", handler: "human", column: "human" },
  { id: "6", name: "Lucas Oliveira", phone: "(61) 98765-6789", waitTime: "1h", handler: "human", column: "human" },
  { id: "7", name: "Fernanda Reis", phone: "(71) 91234-3456", waitTime: "—", handler: "human", column: "closed" },
  { id: "8", name: "Roberto Alves", phone: "(81) 98765-9012", waitTime: "3 min", handler: "ai", column: "new" },
  { id: "9", name: "Juliana Martins", phone: "(91) 91234-7890", waitTime: "15 min", handler: "ai", column: "interested" },
];

export default function Funnel() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleDragStart = (id: string) => setDraggedId(id);

  const handleDrop = (columnId: string) => {
    if (!draggedId) return;
    setLeads((prev) =>
      prev.map((l) => (l.id === draggedId ? { ...l, column: columnId } : l))
    );
    setDraggedId(null);
  };

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Funil de Vendas</h1>
        <p className="text-sm text-muted-foreground">Arraste os cards entre as colunas</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((col) => {
          const colLeads = leads.filter((l) => l.column === col.id);
          return (
            <div
              key={col.id}
              className="flex-shrink-0 w-[280px]"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(col.id)}
            >
              <div className="flex items-center gap-2 mb-3 px-1">
                <div className={`h-2.5 w-2.5 rounded-full ${col.color}`} />
                <h3 className="text-sm font-semibold text-foreground">{col.title}</h3>
                <span className="ml-auto text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                  {colLeads.length}
                </span>
              </div>
              <div className="space-y-2 min-h-[200px] bg-secondary/50 rounded-lg p-2 kanban-scroll overflow-y-auto max-h-[calc(100vh-220px)]">
                {colLeads.map((lead) => (
                  <Card
                    key={lead.id}
                    draggable
                    onDragStart={() => handleDragStart(lead.id)}
                    className={`p-3 cursor-grab active:cursor-grabbing border-border hover:border-primary/20 transition-colors ${
                      draggedId === lead.id ? "opacity-50" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
                        <p className="text-sm font-medium text-foreground">{lead.name}</p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`text-[10px] px-1.5 py-0 ${
                          lead.handler === "ai"
                            ? "bg-kanban-ai/10 text-kanban-ai border-kanban-ai/20"
                            : "bg-kanban-human/10 text-kanban-human border-kanban-human/20"
                        }`}
                      >
                        {lead.handler === "ai" ? (
                          <><Bot className="h-2.5 w-2.5 mr-0.5" /> IA</>
                        ) : (
                          <><User className="h-2.5 w-2.5 mr-0.5" /> Humano</>
                        )}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{lead.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Esperando: {lead.waitTime}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
