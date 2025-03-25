import AuthLayout from "@/components/layouts/auth-layout";
import { SignUpForm } from "@/components/auth/sign-up-form";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <AuthLayout title="SignUp - CollaBoard" description="SignUp to CollaBoard">
      <main className="flex items-center justify-center h-screen">
        <div className=" flex-col w-full max-w-md mx-auto px-4">
          <SignUpForm />
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/auth/sign-in" className="text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </AuthLayout>
  );
}
