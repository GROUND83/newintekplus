import type { Metadata } from "next";
import { Roboto, Inter, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import AuthProvider from "@/components/authProvider";
// import { connectToMongoDB } from "@/lib/db";
import { Toaster } from "@/components/ui/sonner";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import React from "react";
import { ReactQueryClientProvider } from "@/components/reactQuery/queryProvider";
import Head from "next/head";

//
const notoSansKr = Noto_Sans_KR({
  // preload: true, 기본값
  preload: false,
  weight: ["100", "400", "700"],
});

const roboto = Roboto({
  subsets: ["latin"], // preload에 사용할 subsets입니다.
  weight: ["100", "400", "700"],
  variable: "--roboto", // CSS 변수 방식으로 스타일을 지정할 경우에 사용합니다.
});
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "인재육성교육지원시스템 | SMARTAL Inc",
  description: "인재육성교육지원시스템 by SMARTAL Inc",
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  // connectToMongoDB();
  return (
    <html lang="en">
      <Head>
        <meta
          http-equiv="Content-Security-Policy"
          content="default-src 'self';script-src 'self';"
        />
      </Head>
      <AuthProvider>
        <body
          className={cn(notoSansKr.className, roboto.variable)}
          style={{ fontSize: 14 }}
        >
          {/* <ReactQueryClientProvider> */}
          {children}
          <Toaster richColors />
          {/* </ReactQueryClientProvider> */}
        </body>
      </AuthProvider>
    </html>
  );
}
