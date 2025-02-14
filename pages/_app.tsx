import type { AppProps } from "next/app";
import { Session } from "next-auth";
import AuthProvider from "../providers/session-provider";
import "../styles/global.css";
import TeamLayout from "@/components/layouts/team-layout";
import { AppLayout } from "@/components/layouts/app-layout";

type AppPropsWithSession = AppProps & {
  pageProps: {
    session?: Session;
  };
};
function MyApp({ Component, pageProps, router }: AppPropsWithSession) {
  const isTeamRoute = router.pathname.startsWith("/teams");

  if (isTeamRoute) {
    return (
      <AuthProvider>
        <AppLayout>
          <TeamLayout>
            <Component {...pageProps} />
          </TeamLayout>
        </AppLayout>
      </AuthProvider>
    );
  }
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
