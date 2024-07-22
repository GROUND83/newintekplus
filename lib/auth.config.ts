import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  session: {
    strategy: "jwt",
    maxAge: 3 * 24 * 60 * 60, // 3 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    error: "/",
    signIn: "/",
    signOut: "/",
  },
  callbacks: {
    async session({ session, user, token }) {
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
