import { SyncService } from "@/services/sync/syc-service";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

import { useRouter } from "next/router";
const Home = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/teams");
    }
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>CollaBoard - Real-time Collaborative Whiteboard</title>
        <meta
          name="description"
          content="A real-time collaborative whiteboard application for teams"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="container flex flex-col items-center justify-center gap-8 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Colla<span className="text-primary">Board</span>
          </h1>
          <p className="text-center text-2xl text-muted-foreground">
            Real-time collaborative whiteboard for teams
          </p>
        </div>
      </main>
    </>
  );
};

export default Home;
