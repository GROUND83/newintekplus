import { NextRequest, NextResponse } from "next/server";

import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const cspHeader = `
      default-src 'self';
      script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https: http: 'unsafe-inline' 'unsafe-eval';
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data:;
      font-src 'self';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      upgrade-insecure-requests;
  `;
  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, " ")
    .trim();
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue
  );

  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;
  const pathname = nextUrl.pathname;
  // console.log("pathname", pathname, req.auth);

  if (pathname.startsWith("/admin")) {
    if (isAuthenticated) {
      if (req.auth.user.role === "admin") {
        console.log("session admin", req.auth);
        console.log("check");
        // const response = NextResponse.next();
        const response = NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        });
        response.headers.set(
          "Content-Security-Policy",
          contentSecurityPolicyHeaderValue
        );
        return response;
        //
      } else {
        // console.log("session", session);
        return NextResponse.redirect(new URL("/auth/admin/login", nextUrl));
      }
    } else {
      return NextResponse.redirect(new URL("/auth/admin/login", nextUrl));
    }
  }
  if (pathname.startsWith("/student")) {
    if (isAuthenticated) {
      if (req.auth.user.role === "participant") {
        console.log("session participant", req.auth);
        console.log("check");
        // const response = NextResponse.next();
        const response = NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        });
        response.headers.set(
          "Content-Security-Policy",
          contentSecurityPolicyHeaderValue
        );
        return response;
        //
      } else {
        // console.log("session", session);
        return NextResponse.redirect(
          new URL("/auth/participant/login", nextUrl)
        );
      }
    } else {
      return NextResponse.redirect(new URL("/auth/participant/login", nextUrl));
    }
  }
  if (pathname.startsWith("/teacher")) {
    if (isAuthenticated) {
      // console.log("session teacher", req.auth);
      if (req.auth.user.role === "teacher") {
        console.log("check");
        // const response = NextResponse.next();
        const response = NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        });
        response.headers.set(
          "Content-Security-Policy",
          contentSecurityPolicyHeaderValue
        );
        return response;
        //
      } else {
        // console.log("session", session);
        return NextResponse.redirect(new URL("/auth/teacher/login", nextUrl));
      }
    } else {
      return NextResponse.redirect(new URL("/auth/teacher/login", nextUrl));
    }
  }
});

export const config = {
  //   matcher: ["/", "/profile", "auth/:path*"], // 미들웨어 실행할 path
  matcher: [
    // "/reservaton/:path*",
    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$|.*\\.jpg$|.*\\.svg$).*)", //제외

      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ], // 미들웨어 실행할 path
};
