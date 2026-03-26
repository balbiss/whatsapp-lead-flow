import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Rocket, Building2, Crown } from 'lucide-react';
import { toast } from 'sonner';

const plans = [
  {
    name: 'Starter',
    id: 'starter',
    price: 'R$ 97',
    description: 'Ideal para quem está começando e precisa do básico.',
    features: ['Até 500 leads/mês', '1 Instância WhatsApp', 'IA básica', 'Kanban simplificado'],
    icon: Rocket,
    color: 'blue'
  },
  {
    name: 'Pro',
    id: 'pro',
    price: 'R$ 197',
    popular: true,
    description: 'Nossa solução mais completa para negócios em escala.',
    features: ['Leads Ilimitados', '3 Instâncias WhatsApp', 'IA Avançada (GPT-4)', 'Automações de Chat', 'Suporte Prioritário'],
    icon: Zap,
    color: 'emerald'
  },
  {
    name: 'Enterprise',
    id: 'enterprise',
    price: 'Sob Consulta',
    description: 'Para grandes operações que precisam de personalização.',
    features: ['Custom API Integration', 'Múltiplos usuários Admin', 'SLA Garantido', 'Gerente de Contas Dedicado'],
    icon: Crown,
    color: 'indigo'
  }
];

const Subscription = () => {
  const { tenant } = useAuth();
  const currentStatus = tenant?.subscription_status || 'active';

  const handleSubscribe = (planId: string) => {
    const toastId = toast.loading('Redirecionando para o checkout da Cakto...');
    
    // Simulate redirection
    setTimeout(() => {
      toast.dismiss(toastId);
      toast.success('Checkout simulado com sucesso!');
      window.open('https://cakto.com.br/checkout/exemplo', '_blank');
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Assinatura e Planos</h1>
        <p className="text-muted-foreground">
          Gerencie o plano da sua empresa e desbloqueie novas funcionalidades.
        </p>
      </div>

      <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white rounded-xl shadow-sm border">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-lg">{tenant?.name}</h3>
            <p className="text-sm text-muted-foreground">Status atual da conta</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={currentStatus === 'active' ? 'default' : 'destructive'} className="px-4 py-1.5 text-sm uppercase font-bold tracking-wider">
            {currentStatus === 'active' ? 'Assinatura Ativa' : 'Assinatura Expirada'}
          </Badge>
          {currentStatus === 'expired' && (
            <span className="text-sm text-red-500 font-medium animate-pulse">
              Regularize seu pagamento para continuar usando a IA
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className={`relative flex flex-col border-2 transition-all duration-300 hover:shadow-xl ${plan.popular ? 'border-primary ring-4 ring-primary/5 scale-105 z-10' : 'border-slate-200'}`}>
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-white hover:bg-primary px-4 py-1 text-xs uppercase font-black">
                  Mais Popular
                </Badge>
              </div>
            )}
            <CardHeader>
              <div className={`p-2 w-10 h-10 rounded-lg bg-${plan.color}-100 text-${plan.color}-600 mb-2 flex items-center justify-center`}>
                <plan.icon size={24} />
              </div>
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold">{plan.price}</span>
                {plan.price !== 'Sob Consulta' && <span className="text-muted-foreground font-medium">/mês</span>}
              </div>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleSubscribe(plan.id)}
                className={`w-full py-6 text-lg font-bold transition-all ${plan.popular ? 'bg-primary hover:bg-primary/90' : 'bg-slate-900 hover:bg-slate-800'}`}
              >
                {plan.price === 'Sob Consulta' ? 'Falar com Consultor' : 'Assinar Agora'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Subscription;
