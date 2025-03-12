import AuthLayout from "@/components/layouts/auth-layout";
import { RegisterForm } from "@/components/auth/register-form";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Register - CollaBoard"
      description="Register to CollaBoard"
    >
      <main className="flex items-center justify-center h-screen">
        <div className=" flex-col w-full max-w-md mx-auto px-4">
          <RegisterForm />
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-500">
              Login
            </Link>
          </p>
        </div>
      </main>
    </AuthLayout>
  );
}
