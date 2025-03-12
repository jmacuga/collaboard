import type { AppProps } from "next/app";
import { Session } from "next-auth";
import AuthProvider from "@/components/auth/session-provider";
import "@/styles/global.css";
import TeamLayout from "@/components/layouts/team-layout";
import { AppLayout } from "@/components/layouts/app-layout";
import { ToastProvider } from "@/components/providers/toast-provider";

type AppPropsWithSession = AppProps & {
  pageProps: {
    session?: Session;
  };
};
function MyApp({ Component, pageProps, router }: AppPropsWithSession) {
  const isTeamRoute = router.pathname.startsWith("/teams");
  const isTeamsRoute = router.pathname === "/teams";

  if (isTeamsRoute) {
    return (
      <AuthProvider>
        <AppLayout>
          <Component {...pageProps} />
          <ToastProvider />
        </AppLayout>
      </AuthProvider>
    );
  }
  if (isTeamRoute) {
    return (
      <AuthProvider>
        <AppLayout>
          <TeamLayout>
            <Component {...pageProps} />
            <ToastProvider />
          </TeamLayout>
        </AppLayout>
      </AuthProvider>
    );
  }
  return (
    <AuthProvider>
      <Component {...pageProps} />
      <ToastProvider />
    </AuthProvider>
  );
}

export default MyApp;
