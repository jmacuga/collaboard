import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const publicPaths = [
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/error",
  "/auth/verify",
  "/api/auth",
  "/api/socket",
];

const isPublicPath = (path: string) => {
  const normalizedPath = path.endsWith("/") ? path.slice(0, -1) : path;

  return publicPaths.some(
    (publicPath) =>
      normalizedPath === publicPath ||
      normalizedPath.startsWith(`${publicPath}/`)
  );
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/api/auth/session" || pathname === "/api/auth/session/") {
    return NextResponse.next();
  }

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token && !isPublicPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/sign-in";
    return NextResponse.redirect(url);
  }

  if (
    pathname.startsWith("/api/") &&
    !pathname.startsWith("/api/auth/") &&
    !pathname.startsWith("/api/socket") &&
    !token
  ) {
    return new NextResponse(null, {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
