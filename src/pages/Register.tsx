import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Building2 } from 'lucide-react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [segment, setSegment] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!segment) {
      toast.error('Por favor, selecione o segmento da empresa');
      return;
    }
    setLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          email,
          password,
          companyName,
          segment
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao realizar cadastro');
      }

      // 2. Save token and user info
      localStorage.setItem('crm_token', data.token);
      localStorage.setItem('crm_user', JSON.stringify(data.user));
      localStorage.setItem('crm_tenant', JSON.stringify(data.tenant));
      
      toast.success('Empresa cadastrada com sucesso!');
      window.location.href = '/'; // Full reload to catch AuthContext changes
    } catch (error: any) {
      toast.error(error.message || 'Erro ao realizar cadastro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4 py-12">
      <Card className="w-full max-w-lg shadow-lg border-t-4 border-t-primary">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full text-primary">
              <Building2 size={32} />
            </div>
          </div>
          <CardTitle className="text-2xl text-center font-bold">Criar sua Conta SaaS</CardTitle>
          <CardDescription className="text-center">
            Cadastre sua empresa e comece a gerenciar seus leads hoje mesmo.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome Completo</Label>
                <Input 
                  id="fullName" 
                  placeholder="Seu nome" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Corporativo</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="empresa@exemplo.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Nome da Empresa</Label>
                <Input 
                  id="companyName" 
                  placeholder="Minha Empresa Ltda" 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="segment">Segmento</Label>
                <Select onValueChange={setSegment} value={segment}>
                  <SelectTrigger id="segment">
                    <SelectValue placeholder="Selecione o segmento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tecnologia">Tecnologia</SelectItem>
                    <SelectItem value="saude">Saúde & Bem-estar</SelectItem>
                    <SelectItem value="educacao">Education</SelectItem>
                    <SelectItem value="varejo">Retail / E-commerce</SelectItem>
                    <SelectItem value="servicos">General Services</SelectItem>
                    <SelectItem value="outro">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha de Acesso</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full h-11 text-base font-semibold" type="submit" disabled={loading}>
              {loading ? 'Configurando empresa...' : 'Criar minha conta e empresa'}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Já possui uma conta?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Fazer login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Register;
