import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, Wifi, WifiOff, RefreshCw, Smartphone } from "lucide-react";

export default function WhatsApp() {
  const [status, setStatus] = useState<"offline" | "connecting" | "online">("offline");
  const [showQr, setShowQr] = useState(false);

  const handleGenerate = () => {
    setStatus("connecting");
    setShowQr(true);
    setTimeout(() => setStatus("online"), 3000);
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Conexão WhatsApp</h1>
        <p className="text-sm text-muted-foreground">Gerencie a instância Wuzapi</p>
      </div>

      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              Instância WhatsApp
            </CardTitle>
            <Badge
              variant="secondary"
              className={
                status === "online"
                  ? "bg-success/10 text-success border-success/20"
                  : status === "connecting"
                  ? "bg-warning/10 text-warning border-warning/20"
                  : "bg-secondary text-muted-foreground"
              }
            >
              <div
                className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                  status === "online"
                    ? "bg-success animate-pulse-dot"
                    : status === "connecting"
                    ? "bg-warning animate-pulse-dot"
                    : "bg-muted-foreground"
                }`}
              />
              {status === "online" ? "Online" : status === "connecting" ? "Conectando..." : "Offline"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center py-8">
            {showQr ? (
              <div className="relative">
                <div className="w-48 h-48 bg-secondary rounded-xl border-2 border-dashed border-border flex items-center justify-center">
                  {status === "online" ? (
                    <div className="text-center">
                      <Wifi className="h-12 w-12 text-success mx-auto mb-2" />
                      <p className="text-sm font-medium text-success">Conectado!</p>
                    </div>
                  ) : (
                    <div className="text-center space-y-2">
                      <QrCode className="h-16 w-16 text-muted-foreground mx-auto" />
                      <p className="text-xs text-muted-foreground">Escaneie com WhatsApp</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="h-20 w-20 bg-secondary rounded-2xl flex items-center justify-center mx-auto">
                  <WifiOff className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Nenhuma instância conectada</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Gere um QR Code para conectar seu WhatsApp
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 justify-center">
            <Button onClick={handleGenerate} className="gap-2">
              <QrCode className="h-4 w-4" />
              {showQr ? "Regenerar QR Code" : "Gerar QR Code"}
            </Button>
            {status === "online" && (
              <Button
                variant="outline"
                onClick={() => {
                  setStatus("offline");
                  setShowQr(false);
                }}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Desconectar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
