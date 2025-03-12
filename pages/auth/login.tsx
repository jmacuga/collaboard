import AuthLayout from "@/components/layouts/auth-layout";
import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";

const LoginPage = () => {
  return (
    <AuthLayout
      title="Login - CollaBoard"
      description="Login to your CollaBoard account"
    >
      <main className="flex items-center justify-center md:h-screen">
        <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
          <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
            <div className="w-32 text-white md:w-36"></div>
          </div>
          <LoginForm />
          <p className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link href="/auth/register" className="text-blue-500">
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </AuthLayout>
  );
};

export default LoginPage;
