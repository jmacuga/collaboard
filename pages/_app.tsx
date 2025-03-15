import type { AppProps } from "next/app";
import { Session } from "next-auth";
import AuthProvider from "@/components/auth/session-provider";
import "@/styles/global.css";
import TeamLayout from "@/components/layouts/team-layout";
import { AppLayout } from "@/components/layouts/app-layout";
import { ToastProvider } from "@/components/providers/toast-provider";
import { NetworkStatusProvider } from "@/components/providers/network-status-provider";

type AppPropsWithSession = AppProps & {
  pageProps: {
    session?: Session;
  };
};
function MyApp({ Component, pageProps, router }: AppPropsWithSession) {
  const isTeamDetailRoute = router.pathname.startsWith("/teams");
  const isTeamsRoute = router.pathname === "/teams";
  const isProfileRoute = router.pathname.startsWith("/profile");

  if (isTeamsRoute || isProfileRoute) {
    return (
      <AuthProvider>
        <NetworkStatusProvider>
          <AppLayout>
            <Component {...pageProps} />
            <ToastProvider />
          </AppLayout>
        </NetworkStatusProvider>
      </AuthProvider>
    );
  }
  if (isTeamDetailRoute) {
    return (
      <AuthProvider>
        <NetworkStatusProvider>
          <AppLayout>
            <TeamLayout>
              <Component {...pageProps} />
              <ToastProvider />
            </TeamLayout>
          </AppLayout>
        </NetworkStatusProvider>
      </AuthProvider>
    );
  }
  return (
    <AuthProvider>
      <NetworkStatusProvider>
        <Component {...pageProps} />
        <ToastProvider />
      </NetworkStatusProvider>
    </AuthProvider>
  );
}

export default MyApp;
