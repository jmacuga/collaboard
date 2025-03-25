import { SignInForm } from "@/components/auth/sign-in-form";
import Head from "next/head";
import Link from "next/link";

const SignInPage = () => {
  return (
    <>
      <Head>
        <title>Sign in - CollaBoard</title>
        <meta name="description" content="Sign in to your CollaBoard account" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <SignInForm />
          <p className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link href="/auth/sign-up" className="text-blue-500">
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </>
  );
};

export default SignInPage;
