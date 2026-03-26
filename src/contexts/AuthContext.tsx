import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  tenantId: string;
}

interface Profile {
  id: string;
  tenant_id: string;
  role: 'admin' | 'seller';
  full_name: string;
}

interface Tenant {
  id: string;
  name: string;
  segment: string;
  subscription_status: 'active' | 'expired' | 'trialing';
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  tenant: Tenant | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuth = async () => {
      const token = localStorage.getItem('crm_token');
      const storedUser = localStorage.getItem('crm_user');
      const storedTenant = localStorage.getItem('crm_tenant');

      if (token && storedUser && storedTenant) {
        setUser(JSON.parse(storedUser));
        setTenant(JSON.parse(storedTenant));
        setProfile({
          id: JSON.parse(storedUser).id,
          tenant_id: JSON.parse(storedTenant).id,
          role: JSON.parse(storedUser).role.toLowerCase(),
          full_name: JSON.parse(storedUser).name
        });
      }
      setLoading(false);
    };

    loadAuth();
  }, []);

  const fetchProfileAndTenant = async (userId: string) => {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileData) {
      setProfile(profileData);
      
      if (profileData.tenant_id) {
        const { data: tenantData } = await supabase
          .from('tenants')
          .select('*')
          .eq('id', profileData.tenant_id)
          .single();
        
        if (tenantData) {
          setTenant(tenantData);
        }
      }
    }
  };

  const signOut = async () => {
    localStorage.removeItem('crm_token');
    localStorage.removeItem('crm_user');
    localStorage.removeItem('crm_tenant');
    setUser(null);
    setTenant(null);
    setProfile(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, profile, tenant, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
