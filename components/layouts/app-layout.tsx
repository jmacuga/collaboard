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
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1 w-full max-w-full">
            <SidebarTrigger />
            <div className="w-full max-w-full p-6 md:p-12">{children}</div>
          </main>
        </div>
      </SidebarProvider>
    </SessionProvider>
  );
}
