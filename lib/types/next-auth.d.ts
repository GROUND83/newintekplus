import NextAuth, { type DefaultSession, type DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      _id: string;
      username: string | null | undefined;
      email: string | null | undefined;
      role: "admin" | "teacher" | "participant";
    } & DefaultSession["user"];
  }
  interface User extends DefaultUser {
    _id: string;
    username: string | null;
    email: string | null;
    role: string | null;
  }
  interface User extends AdapterUser {
    _id: string;
    username: string | null;
    email: string | null;
    role: string | null;
  }
}

import { JWT } from "@auth/core/jwt";
import { AdapterUser } from "@auth/core/adapters";

declare module "@auth/core/jwt" {
  interface JWT {
    role: "admin" | "teacher" | "participant";
  }
}
