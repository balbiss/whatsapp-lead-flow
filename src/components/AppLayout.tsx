import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50/30">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 flex items-center border-b border-slate-200 px-6 bg-white sticky top-0 z-10 shadow-sm">
            <SidebarTrigger className="mr-4 hover:bg-slate-100" />
            <div className="flex-1" />
            {/* Header profile/notifications could go here */}
          </header>
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
