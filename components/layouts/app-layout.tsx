import { SessionProvider } from "next-auth/react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SessionProvider>
      <SidebarProvider>
        <div className="flex min-h-screen">
          <AppSidebar />
          <main className="flex-1">
            <SidebarTrigger />
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </SessionProvider>
  );
}
