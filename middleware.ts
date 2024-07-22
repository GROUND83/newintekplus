import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { auth as middleware } from "@/auth";
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
interface Routes {
  [key: string]: boolean;
}
const publicOnlyUrls: Routes = {
  "/": true,
  "/auth/login": true,
  "/auth/naver/start": true,
  "/auth/naver/complete": true,
  "/auth/kakao/start": true,
  "/auth/kakao/complete": true,
  "/login": true,
  "/sms": true,
  "/register": true,
  "/github/start": true,
  "/github/complete": true,
  "/auth/error": true,
};

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;
  const pathname = nextUrl.pathname;
  console.log("pathname", pathname, req.auth);

  if (pathname.startsWith("/admin")) {
    if (req.auth) {
      console.log("session admin", req.auth);
      if (req.auth) {
        console.log("check");
        return NextResponse.next();
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
    if (req.auth) {
      console.log("session participant", req.auth);
      if (req.auth) {
        console.log("check");
        return NextResponse.next();
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
    if (req.auth) {
      console.log("session teacher", req.auth);
      if (req.auth) {
        console.log("check");
        return NextResponse.next();
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
//   //
//   if (pathname.startsWith("/othersAuth")) {
//     if (session) {
//       console.log("session writer", session, session.role, session.id);
//       if (session) {
//         console.log("check");
//         return NextResponse.redirect(new URL("/", req.url));
//         //
//       } else {
//         // console.log("session", session);
//         return NextResponse.next();
//       }
//     } else {
//       return NextResponse.next();
//     }
//   }
//   if (pathname.startsWith("/profile")) {
//     console.log("session", session);
//     if (session?.role === "user") {
//       return NextResponse.next();
//     } else {
//       return NextResponse.redirect(new URL("/auth/login", req.url));
//     }
//   }
//   if (pathname.startsWith("/admin")) {
//     console.log("session", session);
//     if (session) {
//       if (session.id && session.role) {
//         if (session.role === "manager") {
//           console.log("session", session);
//           return NextResponse.next();
//         } else if (session.role === "superAdmin") {
//           return NextResponse.next();
//         } else {
//           return NextResponse.redirect(
//             new URL("/othersAuth/manager/login", req.url)
//           );
//         }
//         //
//       } else {
//         // console.log("session", session);
//         return NextResponse.redirect(
//           new URL("/othersAuth/manager/login", req.url)
//         );
//       }
//     } else {
//       return NextResponse.redirect(
//         new URL("/othersAuth/manager/login", req.url)
//       );
//     }
//   }
//   if (pathname.startsWith("/dashwriter")) {
//     if (session) {
//       console.log("session writer", session, session.role, session.id);
//       if (session.id && session.role) {
//         console.log("check");
//         if (session.role === "writer") {
//           console.log("check");
//           return NextResponse.next();
//         } else {
//           return NextResponse.redirect(
//             new URL("/othersAuth/writer/login", req.url)
//           );
//         }
//         //
//       } else {
//         // console.log("session", session);
//         return NextResponse.redirect(
//           new URL("/othersAuth/writer/login", req.url)
//         );
//       }
//     } else {
//       return NextResponse.redirect(
//         new URL("/othersAuth/writer/login", req.url)
//       );
//     }
//   }
//   if (pathname.startsWith("/dashfarmer")) {
//     if (session) {
//       console.log("session writer", session, session.role, session.id);
//       if (session.id && session.role) {
//         console.log("check");
//         if (session.role === "farmer") {
//           console.log("check");
//           return NextResponse.next();
//         } else {
//           return NextResponse.redirect(
//             new URL("/othersAuth/farmer/login", req.url)
//           );
//         }
//         //
//       } else {
//         // console.log("session", session);
//         return NextResponse.redirect(
//           new URL("/othersAuth/farmer/login", req.url)
//         );
//       }
//     } else {
//       return NextResponse.redirect(
//         new URL("/othersAuth/farmer/login", req.url)
//       );
//     }
//   }

export const config = {
  //   matcher: ["/", "/profile", "auth/:path*"], // 미들웨어 실행할 path
  matcher: [
    // "/reservaton/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$|.*\\.jpg$|.*\\.svg$).*)", //제외
  ], // 미들웨어 실행할 path
};
