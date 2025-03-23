import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/auth/sign-in",
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
        return Response.redirect(new URL("/auth/sign-in", nextUrl));
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
