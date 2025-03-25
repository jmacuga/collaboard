"use client";

import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { Button } from "../ui/button";
import { useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemaSignIn } from "@/lib/schemas/sign-in.schema";
import { z } from "zod";
import { signIn } from "next-auth/react";

type FormData = z.infer<typeof schemaSignIn>;

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(schemaSignIn),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: "/teams",
      });

      if (result?.error) {
        toast.error("Invalid email or password");
        return;
      }
      toast.success("Sign in successful!");
      router.push("/teams");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`mb-3 text-2xl`}>Please sign in to continue.</h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                {...form.register("email")}
                placeholder="Enter your email address"
                aria-describedby="email-error"
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {form.formState.errors.email && (
              <div className="mt-2 flex items-center text-sm text-red-500">
                <ExclamationCircleIcon className="mr-1 h-4 w-4" />
                <p>{form.formState.errors.email.message}</p>
              </div>
            )}
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                {...form.register("password")}
                placeholder="Enter password"
                aria-describedby="password-error"
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {form.formState.errors.password && (
              <div className="mt-2 flex items-center text-sm text-red-500">
                <ExclamationCircleIcon className="mr-1 h-4 w-4" />
                <p>{form.formState.errors.password.message}</p>
              </div>
            )}
          </div>
        </div>
        <Button
          type="submit"
          className="mt-6 w-full"
          aria-disabled={isLoading}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Signing in...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              Sign in <ArrowRightIcon className="ml-auto h-5 w-5" />
            </div>
          )}
        </Button>
      </div>
    </form>
  );
}
