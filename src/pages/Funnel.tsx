import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Bot, User, Clock, Phone, GripVertical, Search, Filter } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Lead = {
  id: string;
  name: string;
  phone: string;
  waitTime: string;
  handler: "ai" | "human";
  column: string;
};

const columns = [
  { id: "new", title: "Novo Lead", color: "bg-blue-500" },
  { id: "ai", title: "Atendimento IA", color: "bg-purple-500" },
  { id: "interested", title: "Interessados", color: "bg-amber-500" },
  { id: "human", title: "Atend. Humano", color: "bg-indigo-500" },
  { id: "closed", title: "Fechado", color: "bg-emerald-500" },
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

const Funnel = () => {
  const { tenant, profile } = useAuth();
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
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Funil de Leads</h1>
            <Badge variant="outline" className="h-6 bg-slate-100 text-slate-600 font-bold">
              {leads.length} Contatos
            </Badge>
          </div>
          <p className="text-muted-foreground flex items-center gap-2">
            Pipeline comercial da <span className="font-semibold text-primary">{tenant?.name}</span>
            {profile?.role === 'seller' && (
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0 text-[10px] uppercase font-black tracking-wider">
                Minha Visão
              </Badge>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar lead..." className="pl-9 w-[200px] bg-white h-10 shadow-sm" />
          </div>
          <Button variant="outline" size="icon" className="h-10 w-10">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
        {columns.map((col) => {
          const colLeads = leads.filter((l) => l.column === col.id);
          return (
            <div
              key={col.id}
              className="flex-shrink-0 w-[300px] flex flex-col"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(col.id)}
            >
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${col.color} shadow-sm`} />
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-tight">{col.title}</h3>
                </div>
                <Badge variant="secondary" className="bg-slate-200/50 text-slate-600 font-bold">
                  {colLeads.length}
                </Badge>
              </div>
              
              <div className="flex-1 space-y-3 min-h-[500px] bg-slate-100/50 rounded-2xl p-3 border-2 border-dashed border-slate-200/50 transition-colors hover:bg-slate-100/80">
                {colLeads.map((lead) => (
                  <Card
                    key={lead.id}
                    draggable
                    onDragStart={() => handleDragStart(lead.id)}
                    className={`p-4 cursor-grab active:cursor-grabbing border-slate-200 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200 group relative ${
                      draggedId === lead.id ? "opacity-30 scale-95" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{lead.name}</p>
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          <span>{lead.phone}</span>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`text-[9px] font-black px-1.5 py-0 uppercase tracking-tighter ${
                          lead.handler === "ai"
                            ? "bg-purple-100 text-purple-700 border-purple-200"
                            : "bg-indigo-100 text-indigo-700 border-indigo-200"
                        }`}
                      >
                        {lead.handler === "ai" ? 'IA Active' : 'Human'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
                        <Clock className="h-3 w-3 text-slate-400" />
                        <span>{lead.waitTime}</span>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical className="h-4 w-4 text-slate-300" />
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
};

export default Funnel;
