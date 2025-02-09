import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

export const authConfig = {
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAuthRoute = nextUrl.pathname.startsWith("/auth");
      const isPublicRoute = nextUrl.pathname.startsWith("/public");
      if (isAuthRoute) {
        if (isLoggedIn) {
          return Response.redirect(new URL(`/teams`, nextUrl));
        }
        return false;
      }

      if (!isLoggedIn && !isPublicRoute) {
        return Response.redirect(new URL("/auth/login", nextUrl));
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
