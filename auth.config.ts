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
      // console.log("auth authorized", auth, isAuthenticated);
      return isAuthenticated;
    },

    jwt: async ({ token, user }) => {
      // console.log("tokendata", token, user);
      if (user) {
        token.username = (user.username as any) || "";
        token.email = user.email as any;
        token.role = user.role as any;
        token._id = user._id as any;
        // session.user._id = token._id;
      }
      // console.log("!tokendata", token);
      return token;
    },
    session: async ({ session, token }) => {
      console.log("sessiondata", session, token);

      session.user = token as any;
      // session.email = token.email as any;
      // session.role = token.role as any;
      // session._id = token._id as any;
      // console.log("sessionsession", session);

      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
