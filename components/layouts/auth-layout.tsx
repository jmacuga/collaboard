import { ReactNode } from "react";
import Head from "next/head";
import Link from "next/link";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

const AuthLayout = ({
  children,
  title,
  description = "CollaBoard - Real-time Collaborative Whiteboard",
}: AuthLayoutProps) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>

      <div className="flex min-h-screen flex-col">
        <header className="border-b border-border py-4">
          <div className="container">
            <Link href="/">
              <a className="text-2xl font-bold">
                Colla<span className="text-primary">Board</span>
              </a>
            </Link>
          </div>
        </header>

        {children}
      </div>
    </>
  );
};

export default AuthLayout;
