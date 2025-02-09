import { auth } from "@/lib/auth";
import { SessionProvider } from "@/node_modules/next-auth/react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <SidebarProvider>
        <AppSidebar />
        <main>
          <SidebarTrigger />
          <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </SessionProvider>
  );
}
