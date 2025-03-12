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
          <div className="container mx-auto">
            <Link href="/">
              <a className="text-2xl font-bold">CollaBoard</a>
            </Link>
          </div>
        </header>

        {children}
      </div>
    </>
  );
};

export default AuthLayout;
