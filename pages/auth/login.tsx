import AuthLayout from "@/components/layouts/auth-layout";
import { LoginForm } from "@/components/auth/login/login-form";

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
        </div>
      </main>
    </AuthLayout>
  );
};

export default LoginPage;
