import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, Wifi, WifiOff, RefreshCw, Smartphone, Info, Clock, MessageSquare, Keyboard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const WhatsApp = () => {
  const { tenant } = useAuth();
  const [status, setStatus] = useState<"no_instance" | "offline" | "connecting" | "online">("no_instance");
  const [showQr, setShowQr] = useState(false);
  const [showPairing, setShowPairing] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [pairingPhone, setPairingPhone] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/whatsapp/status`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('crm_token')}`
        }
      });
      const data = await response.json();
      console.log("[DEBUG] WhatsApp Status Response:", data);
      
      if (data.status === 'online' || data.Connected || data.connected) {
        setStatus('online');
        setShowQr(false);
        setShowPairing(false);
      } else if (data.status === 'no_instance') {
        setStatus('no_instance');
      } else {
        setStatus('offline');
      }
    } catch (error) {
      console.error('[CRITICAL] Error fetching status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateInstance = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/whatsapp/instance', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('crm_token')}`
        }
      });
      const data = await response.json();
      
      if (data.status === 'success' || data.token) {
        toast.success("Instância criada com sucesso!");
        fetchStatus();
      } else {
        toast.error(data.error || "Erro ao criar instância.");
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleGetQR = async () => {
    try {
      setLoading(true);
      // 1. First ensure we are connected (session started)
      await fetch(`${import.meta.env.VITE_API_URL}/whatsapp/connect', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('crm_token')}`
        }
      });

      // 2. Wait a second for Wuzapi to initialize
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 3. Get the QR code
      const response = await fetch(`${import.meta.env.VITE_API_URL}/whatsapp/qr', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('crm_token')}`
        }
      });
      const data = await response.json();
      
      if (data.QRCode) {
        setQrCode(data.QRCode);
        setShowQr(true);
        setShowPairing(false);
        setStatus('offline'); // Still offline until scanned
        toast.success("QR Code gerado!");
      } else {
        toast.error("Erro ao gerar QR Code. Tente novamente em instantes.");
      }
    } catch (error) {
      toast.error("Erro ao obter QR Code.");
    } finally {
      setLoading(false);
    }
  };

  const handlePairPhone = async () => {
    if (!pairingPhone) {
      toast.error("Informe o número de telefone.");
      return;
    }

    try {
      setLoading(true);
      // 1. Ensure session started
      await fetch(`${import.meta.env.VITE_API_URL}/whatsapp/connect', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('crm_token')}`
        }
      });

      await new Promise(resolve => setTimeout(resolve, 2000));

      // 2. Request pairing code
      const response = await fetch(`${import.meta.env.VITE_API_URL}/whatsapp/pairphone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('crm_token')}`
        },
        body: JSON.stringify({ phone: pairingPhone })
      });
      const data = await response.json();
      
      if (data.PairingCode) {
        setPairingCode(data.PairingCode);
        setShowPairing(true);
        setShowQr(false);
        toast.info("Código de pareamento gerado.");
      } else {
        toast.error(data.error || "Erro ao gerar código.");
      }
    } catch (error) {
      toast.error("Erro no pareamento.");
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/whatsapp/disconnect', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('crm_token')}`
        }
      });
      const data = await response.json();
      
      if (data.status === 'success' || !data.error) {
        setStatus('offline');
        setShowQr(false);
        setShowPairing(false);
        setQrCode(null);
        setPairingCode(null);
        toast.success("Desconectado.");
      }
    } catch (error) {
      toast.error("Erro ao desconectar.");
    }
  };

  const handleDeleteInstance = async () => {
    if (!confirm("Tem certeza que deseja DELETAR esta instância? Isso removerá todos os dados da conexão na API e no banco de dados. Esta ação não pode ser desfeita.")) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/whatsapp/instance', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('crm_token')}`
        }
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        toast.success("Instância deletada com sucesso!");
        setStatus('no_instance');
        setShowQr(false);
        setShowPairing(false);
        setQrCode(null);
        setPairingCode(null);
      } else {
        toast.error(data.message || "Erro ao deletar instância.");
      }
    } catch (error) {
      toast.error("Erro ao deletar instância.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SubscriptionGuard>
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Conexão WhatsApp</h1>
          <p className="text-muted-foreground">
            Sua empresa: <span className="font-semibold text-primary">{tenant?.name}</span>. 
            Siga o fluxo para conectar seu dispositivo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="border-border lg:col-span-2 shadow-sm">
            <CardHeader className="border-b bg-slate-50/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-primary" />
                  Instância WhatsApp
                </CardTitle>
                <Badge
                  variant="secondary"
                  className={
                    status === "online"
                      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                      : status === "no_instance"
                      ? "bg-slate-100 text-slate-500"
                      : "bg-amber-100 text-amber-700 border-amber-200"
                  }
                >
                  <div
                    className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                      status === "online"
                        ? "bg-emerald-500 animate-pulse"
                        : status === "no_instance"
                        ? "bg-slate-400"
                        : "bg-amber-500 animate-pulse"
                    }`}
                  />
                  {status === "online" ? "Online" : status === "no_instance" ? "Sem Instância" : "Aguardando Conexão"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
              <div className="flex flex-col items-center py-6">
                {status === "no_instance" ? (
                  <div className="text-center space-y-6 max-w-sm mx-auto">
                    <div className="h-24 w-24 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto text-slate-400 shadow-inner">
                      <Smartphone className="h-10 w-10" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Primeiro Passo: Criar Instância</h3>
                      <p className="text-sm text-slate-500 mt-2">
                        Clique abaixo para inicializar o seu servidor de mensagens exclusivo.
                      </p>
                    </div>
                    <Button onClick={handleCreateInstance} disabled={loading} size="lg" className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20">
                      {loading ? <RefreshCw className="h-5 w-5 animate-spin mr-2" /> : <Smartphone className="h-5 w-5 mr-2" />}
                      Criar Instância da Empresa
                    </Button>
                  </div>
                ) : status === "online" ? (
                  <div className="text-center animate-in zoom-in duration-300">
                    <div className="bg-emerald-100 p-8 rounded-full mb-4 inline-block">
                      <Wifi className="h-16 w-16 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-emerald-700">Conectado!</h3>
                    <p className="text-slate-500 mt-2">Seu WhatsApp está pronto para disparar mensagens automáticas.</p>
                    <Button variant="outline" onClick={handleDisconnect} className="mt-8 text-destructive border-destructive hover:bg-destructive/10">
                      <WifiOff className="h-4 w-4 mr-2" /> Desconectar Dispositivo
                    </Button>
                  </div>
                ) : (
                  <div className="w-full max-w-md space-y-8">
                    {!showQr && !showPairing ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button
                          variant="outline"
                          size="lg"
                          className="h-32 flex-col gap-4 border-2 hover:border-primary hover:bg-primary/5 transition-all"
                          onClick={handleGetQR}
                          disabled={loading}
                        >
                          <QrCode className="h-8 w-8 text-primary" />
                          <div className="text-center">
                            <p className="font-bold">Gerar QR Code</p>
                            <p className="text-xs text-muted-foreground">Escaneamento rápido</p>
                          </div>
                        </Button>
                        <Button
                          variant="outline"
                          size="lg"
                          className="h-32 flex-col gap-4 border-2 hover:border-primary hover:bg-primary/5 transition-all"
                          onClick={() => setShowPairing(true)}
                          disabled={loading}
                        >
                          <Keyboard className="h-8 w-8 text-primary" />
                          <div className="text-center">
                            <p className="font-bold">Código de Conexão</p>
                            <p className="text-xs text-muted-foreground">Parear via número</p>
                          </div>
                        </Button>
                      </div>
                    ) : showQr ? (
                      <div className="text-center space-y-6">
                        <div className="relative p-6 bg-white rounded-2xl shadow-xl border-2 border-primary/10 inline-block mx-auto">
                          {qrCode ? (
                            <img src={qrCode} alt="QR Code" className="h-64 w-64" />
                          ) : (
                            <div className="h-64 w-64 flex items-center justify-center">
                              <RefreshCw className="h-10 w-10 text-primary animate-spin" />
                            </div>
                          )}
                        </div>
                        <p className="text-sm font-medium text-slate-600">Abra o WhatsApp {'>'} Configurações {'>'} Dispositivos Conectados</p>
                        <Button variant="ghost" onClick={() => { setShowQr(false); setQrCode(null); }}>Voltar</Button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200">
                          <h4 className="font-bold text-slate-800 mb-4">Pareamento por Código</h4>
                          {pairingCode ? (
                            <div className="text-center py-4">
                              <p className="text-sm text-muted-foreground mb-2">Seu código de pareamento:</p>
                              <div className="text-5xl font-mono font-black tracking-widest text-primary bg-white p-6 rounded-xl shadow-inner border">
                                {pairingCode}
                              </div>
                              <p className="mt-4 text-xs text-slate-500">Insira este código na notificação do seu celular</p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Número (com DDI + DDD)</label>
                                <Input
                                  placeholder="5511999998888"
                                  value={pairingPhone}
                                  onChange={(e) => setPairingPhone(e.target.value)}
                                  className="h-12 text-lg font-mono"
                                />
                              </div>
                              <Button onClick={handlePairPhone} disabled={loading} className="w-full h-12">
                                {loading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Keyboard className="h-4 w-4 mr-2" />}
                                Gerar Código
                              </Button>
                            </div>
                          )}
                        </div>
                        <Button variant="ghost" className="w-full" onClick={() => { setShowPairing(false); setPairingCode(null); }}>Voltar</Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-3 border-b bg-slate-50/30">
                <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider text-slate-500">
                  <Info className="h-4 w-4" />
                  Detalhes da Conexão
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <span className="text-sm text-muted-foreground font-medium">Empresa</span>
                  <span className="text-sm font-bold text-slate-700">{tenant?.name}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <span className="text-sm text-muted-foreground font-medium">Status</span>
                  <Badge variant={status === 'online' ? 'default' : 'outline'} className={status === 'online' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}>
                    {status === "online" ? "Ativo" : status === "no_instance" ? "Pendente" : "Desconectado"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <span className="text-sm text-muted-foreground font-medium">Instância ID</span>
                  <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">wuzapi_{tenant?.id?.slice(0,8)}</span>
                </div>
                {status !== 'no_instance' && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleDeleteInstance}
                    className="w-full mt-4 text-xs text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20"
                    disabled={loading}
                  >
                    {loading ? <RefreshCw className="h-3 w-3 animate-spin mr-2" /> : <RefreshCw className="h-3 w-3 mr-2" />}
                    Deletar e Resetar Instância
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm bg-gradient-to-br from-white to-slate-50/50">
              <CardContent className="p-6">
                <h4 className="font-bold flex items-center gap-2 text-primary mb-4">
                  <Clock className="h-4 w-4" /> Dica de Conexão
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Para uma melhor experiência, utilize o <strong>Pareamento por Código</strong> se o seu QR Code estiver demorando para carregar. É mais rápido e seguro!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SubscriptionGuard>
  );
};

export default WhatsApp;
