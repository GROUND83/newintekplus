import { NextRequest, NextResponse } from "next/server";

import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { auth } from "./auth";
import { getToken } from "next-auth/jwt";
const secret = process.env.NEXTAUTH_SECRET;
// export { auth as middleware } from "@/auth";
// import { auth } from "@/auth";
// const { auth } = NextAuth(authConfig);
export async function middleware(req: any) {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;
  const pathname = nextUrl.pathname;
  const session = await getToken({ req, secret, raw: false });
  //
  console.log("isAuthenticated", session, isAuthenticated);

  if (pathname.startsWith("/admin")) {
    if (session) {
      if (session.role === "admin") {
        console.log("session admin", session);

        return NextResponse.next();
        //
      } else {
        // console.log("session", session);
        return NextResponse.redirect(
          new URL("/auth/login?type=admin", nextUrl)
        );
      }
    } else {
      return NextResponse.redirect(new URL("/auth/login?type=admin", nextUrl));
    }
  }
  if (pathname.startsWith("/student")) {
    if (session) {
      if (session.role === "participant") {
        console.log("session participant", session);
        console.log("check");
        // const response = NextResponse.next();
        // const response = NextResponse.next({
        //   request: {
        //     headers: requestHeaders,
        //   },
        // });
        // response.headers.set(
        //   "Content-Security-Policy",
        //   contentSecurityPolicyHeaderValue
        // );
        // return response;
        return NextResponse.next();
        //
      } else {
        // console.log("session", session);
        return NextResponse.redirect(
          new URL("/auth/login?type=student", nextUrl)
        );
      }
    } else {
      return NextResponse.redirect(
        new URL("/auth/login?type=student", nextUrl)
      );
    }
  }
  if (pathname.startsWith("/teacher")) {
    if (session) {
      // console.log("session teacher", req.auth);
      if (session.role === "teacher") {
        console.log("check");

        return NextResponse.next();
        //
      } else {
        // console.log("session", session);
        return NextResponse.redirect(
          new URL("/auth/login?type=teacher", nextUrl)
        );
      }
    } else {
      return NextResponse.redirect(
        new URL("/auth/login?type=teacher", nextUrl)
      );
    }
  }
}

export const config = {
  //   matcher: ["/", "/profile", "auth/:path*"], // 미들웨어 실행할 path

  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$|.*\\.jpg$|.*\\.svg$).*)",
  ],
  // matcher: [
  //   // "/reservaton/:path*",
  //   {
  //     source:
  //       "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$|.*\\.jpg$|.*\\.svg$).*)", //제외

  //     // missing: [
  //     //   { type: "header", key: "next-router-prefetch" },
  //     //   { type: "header", key: "purpose", value: "prefetch" },
  //     // ],
  //   },
  // ], // 미들웨어 실행할 path
};
