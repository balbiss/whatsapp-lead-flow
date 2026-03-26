import {
  LayoutDashboard,
  Kanban,
  MessageSquare,
  Smartphone,
  Bot,
  Users,
  Settings,
  Zap,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { NavLink } from "@/components/NavLink";
import {
  CreditCard,
  LogOut,
  ChevronUp,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Funil de Vendas", url: "/funnel", icon: Kanban },
  { title: "Chat", url: "/chat", icon: MessageSquare },
];

const configItems = [
  { title: "WhatsApp", url: "/whatsapp", icon: Smartphone },
  { title: "Configurar IA", url: "/ai-config", icon: Bot },
  { title: "Roleta", url: "/roulette", icon: Users },
  { title: "Assinatura", url: "/subscription", icon: CreditCard },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { profile, tenant, signOut } = useAuth();
  const isActive = (path: string) => location.pathname === path;

  // Filter items based on role
  const filteredMainItems = profile?.role === 'admin' 
    ? mainItems 
    : mainItems.filter(item => item.url !== '/'); // Sellers don't see main dashboard for now

  const filteredConfigItems = profile?.role === 'admin'
    ? configItems
    : configItems.filter(item => item.url === '/whatsapp'); // Sellers only see WhatsApp

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Zap className="h-6 w-6" />
          </div>
          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <p className="text-sm font-bold text-foreground truncate">
                {tenant?.name || 'LeadFlow'}
              </p>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider truncate">
                {tenant?.segment || 'CRM & WhatsApp'}
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground/70 text-[10px] uppercase font-bold tracking-[0.1em] px-4 mb-2">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <NavLink to={item.url} end activeClassName="bg-primary/10 text-primary font-medium">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground/70 text-[10px] uppercase font-bold tracking-[0.1em] px-4 mb-2">
            Gestão & Config
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredConfigItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <NavLink to={item.url} end activeClassName="bg-primary/10 text-primary font-medium">
                      <item.icon className={`h-4 w-4 ${item.title === 'Assinatura' ? 'text-blue-500' : ''}`} />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4 bg-slate-50/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => signOut()}
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {!collapsed && <span>Sair da Conta</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
