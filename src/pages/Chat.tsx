import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Hand, Send, User, Phone } from "lucide-react";

type Contact = {
  id: string;
  name: string;
  phone: string;
  lastMsg: string;
  time: string;
  handler: "ai" | "human";
  unread: number;
};

type Message = {
  id: string;
  sender: "lead" | "ai" | "agent";
  text: string;
  time: string;
};

const contacts: Contact[] = [
  { id: "1", name: "Maria Silva", phone: "(11) 98765-4321", lastMsg: "Qual o preço do plano premium?", time: "2 min", handler: "ai", unread: 3 },
  { id: "2", name: "João Santos", phone: "(21) 91234-5678", lastMsg: "Gostaria de agendar uma demo", time: "5 min", handler: "ai", unread: 0 },
  { id: "3", name: "Carla Souza", phone: "(51) 91234-9876", lastMsg: "Pode me transferir para alguém?", time: "8 min", handler: "human", unread: 1 },
  { id: "4", name: "Pedro Lima", phone: "(41) 98765-1234", lastMsg: "Obrigado pela informação!", time: "15 min", handler: "ai", unread: 0 },
  { id: "5", name: "Ana Costa", phone: "(31) 99876-5432", lastMsg: "Fechado! Vamos assinar.", time: "1h", handler: "human", unread: 0 },
];

const messagesMap: Record<string, Message[]> = {
  "1": [
    { id: "m1", sender: "lead", text: "Olá, boa tarde!", time: "14:30" },
    { id: "m2", sender: "ai", text: "Olá Maria! 👋 Bem-vinda à nossa empresa! Como posso ajudá-la hoje?", time: "14:30" },
    { id: "m3", sender: "lead", text: "Gostaria de saber sobre os planos disponíveis", time: "14:31" },
    { id: "m4", sender: "ai", text: "Temos 3 planos: Básico (R$97/mês), Profissional (R$197/mês) e Premium (R$397/mês). O mais popular é o Profissional! Quer que eu detalhe algum?", time: "14:31" },
    { id: "m5", sender: "lead", text: "Qual o preço do plano premium?", time: "14:32" },
  ],
  "3": [
    { id: "m1", sender: "lead", text: "Preciso falar com alguém da equipe", time: "14:20" },
    { id: "m2", sender: "ai", text: "Claro! Vou transferir você para um de nossos especialistas. Um momento! 🙌", time: "14:20" },
    { id: "m3", sender: "agent", text: "Olá Carla, sou o Carlos! Em que posso ajudar?", time: "14:22" },
    { id: "m4", sender: "lead", text: "Pode me transferir para alguém?", time: "14:25" },
  ],
};

export default function Chat() {
  const [selectedId, setSelectedId] = useState("1");
  const [inputMsg, setInputMsg] = useState("");
  const [controlledByHuman, setControlledByHuman] = useState<Record<string, boolean>>({});

  const selected = contacts.find((c) => c.id === selectedId)!;
  const messages = messagesMap[selectedId] || [];
  const isHumanControl = controlledByHuman[selectedId] || false;

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Contact list */}
      <div className="w-80 border-r border-border flex flex-col bg-card">
        <div className="p-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Conversas</h2>
        </div>
        <ScrollArea className="flex-1">
          {contacts.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className={`w-full text-left p-3 border-b border-border hover:bg-secondary/50 transition-colors ${
                selectedId === c.id ? "bg-secondary" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-foreground truncate">{c.name}</span>
                <span className="text-[10px] text-muted-foreground">{c.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground truncate pr-2">{c.lastMsg}</p>
                <div className="flex items-center gap-1.5">
                  {c.handler === "ai" ? (
                    <Bot className="h-3 w-3 text-kanban-ai" />
                  ) : (
                    <User className="h-3 w-3 text-kanban-human" />
                  )}
                  {c.unread > 0 && (
                    <span className="bg-info text-info-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {c.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </ScrollArea>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-14 border-b border-border flex items-center justify-between px-4 bg-card">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{selected.name}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Phone className="h-2.5 w-2.5" />
                {selected.phone}
              </div>
            </div>
          </div>
          <Button
            size="sm"
            variant={isHumanControl ? "default" : "outline"}
            onClick={() =>
              setControlledByHuman((prev) => ({ ...prev, [selectedId]: !prev[selectedId] }))
            }
            className="gap-1.5"
          >
            <Hand className="h-3.5 w-3.5" />
            {isHumanControl ? "IA Pausada" : "Assumir Controle"}
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3 max-w-2xl mx-auto">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === "lead" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[75%] rounded-xl px-3.5 py-2 text-sm ${
                    m.sender === "lead"
                      ? "bg-secondary text-foreground"
                      : m.sender === "ai"
                      ? "bg-kanban-ai/10 text-foreground border border-kanban-ai/20"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  {m.sender !== "lead" && (
                    <div className="flex items-center gap-1 mb-0.5">
                      {m.sender === "ai" ? (
                        <Bot className="h-3 w-3 text-kanban-ai" />
                      ) : (
                        <User className="h-3 w-3" />
                      )}
                      <span className="text-[10px] font-medium opacity-70">
                        {m.sender === "ai" ? "IA" : "Atendente"}
                      </span>
                    </div>
                  )}
                  <p>{m.text}</p>
                  <p className="text-[10px] opacity-50 mt-1 text-right">{m.time}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-border bg-card">
          <div className="flex gap-2 max-w-2xl mx-auto">
            <Input
              placeholder={isHumanControl ? "Digite sua mensagem..." : "IA respondendo automaticamente..."}
              disabled={!isHumanControl}
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              className="bg-secondary border-border"
            />
            <Button size="icon" disabled={!isHumanControl || !inputMsg.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          {!isHumanControl && (
            <p className="text-xs text-center text-muted-foreground mt-2">
              A IA está respondendo. Clique em "Assumir Controle" para responder manualmente.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
