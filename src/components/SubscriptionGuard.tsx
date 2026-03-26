import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

const SubscriptionGuard = ({ children }: SubscriptionGuardProps) => {
  const { tenant } = useAuth();
  const isExpired = tenant?.subscription_status === 'expired';

  if (isExpired) {
    return (
      <div className="flex flex-col space-y-6 animate-in fade-in duration-500">
        <Alert variant="destructive" className="border-2 shadow-lg bg-red-50">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="text-lg font-bold">Assinatura Expirada ou Pendente</AlertTitle>
          <AlertDescription className="text-base">
            O acesso a esta funcionalidade está bloqueado. Por favor, regularize sua assinatura para continuar utilizando os serviços de IA e Automação.
          </AlertDescription>
        </Alert>
        
        <div className="relative group">
          <div className="absolute inset-0 bg-slate-200/50 backdrop-blur-[2px] rounded-2xl flex items-center justify-center z-20">
            <div className="bg-white p-8 rounded-2xl shadow-2xl border flex flex-col items-center text-center space-y-4 max-w-sm">
              <div className="p-4 bg-primary/10 rounded-full text-primary">
                <CreditCard size={48} />
              </div>
              <h3 className="text-xl font-bold">Funcionalidade Bloqueada</h3>
              <p className="text-muted-foreground">
                Assine um dos nossos planos Pro ou Enterprise para liberar o acesso total ao CRM e robôs de WhatsApp.
              </p>
              <Button asChild className="w-full bg-primary hover:bg-primary/90 font-bold py-6 h-auto text-lg">
                <Link to="/subscription">Ver Planos Agora</Link>
              </Button>
            </div>
          </div>
          
          <div className="opacity-40 grayscale pointer-events-none select-none">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default SubscriptionGuard;
