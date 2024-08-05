import type { NextAuthConfig } from "next-auth";
import User from "./models/user";
import Participant from "./models/participant";
import Teacher from "./models/teacher";

export const authConfig = {
  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60, // 3 days
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/auth/login",

    signOut: "/",
  },
  callbacks: {
    authorized({ auth }) {
      const isAuthenticated = !!auth?.user;
      console.log("auth authorized", auth, isAuthenticated);
      return isAuthenticated;
    },

    jwt: async ({ token, user }) => {
      console.log("tokendata", token, user);
      return { ...token, user };
    },
    session: async ({ session, token }) => {
      // console.log("sessiondata", session, token);
      if (session?.user) {
        session.user = token as any;
        // session.user._id = token._id;
      }
      console.log("sessionsession", session);

      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
