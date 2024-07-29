import type { NextAuthConfig } from "next-auth";
import User from "./models/user";
import Participant from "./models/participant";
import Teacher from "./models/teacher";

export const authConfig = {
  session: {
    strategy: "jwt",
    maxAge: 3 * 24 * 60 * 60, // 3 days
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
    // async signIn({ user, profile, credentials }) {
    //   if (user) {
    //     console.log("useruser", user);
    //     try {
    //       // 데이터베이스에 유저가 있는지 확인
    //       let db_user: any = {};
    //       if (user.role === "admin") {
    //         let userdata = await User.findOne({
    //           email: user.email!,
    //         })
    //           .select("username email  role _id")
    //           .lean();
    //         if (userdata) {
    //           db_user = { ...userdata };
    //         } else {
    //           return false;
    //         }
    //       }
    //       if (user.role === "participant") {
    //         let userdata = await Participant.findOne({
    //           email: user.email!,
    //         })
    //           .select("username email  role _id")
    //           .lean();
    //         if (userdata) {
    //           db_user = { ...userdata };
    //         } else {
    //           return false;
    //         }
    //       }
    //       if (user.role === "teacher") {
    //         let userdata = await Teacher.findOne({ email: user.email! })
    //           .select("username email  role _id")
    //           .lean();
    //         if (userdata) {
    //           db_user = { ...userdata };
    //         } else {
    //           return false;
    //         }
    //       }

    //       if (!db_user) {
    //         return false;
    //       }
    //       // 유저 정보에 데이터베이스 아이디, 역할 연결
    //       user._id = db_user._id;
    //       user.role = db_user.role;
    //       user.email = db_user.email;
    //       user.username = db_user.username;
    //       return true;
    //     } catch (error) {
    //       // console.log("로그인 도중 에러가 발생했습니다. " + error);
    //       return false;
    //     }
    //   } else {
    //     return false;
    //   }
    // },
    // signIn: async ({ user, account, profile, email, credentials }) => {
    //   console.log("usercredentials", user, credentials);
    //   const isAllowedToSignIn = true;
    //   if (isAllowedToSignIn) {
    //     return true;
    //   } else {
    //     // Return false to display a default error message
    //     return false;
    //     // Or you can return a URL to redirect to:
    //     // return '/unauthorized'
    //   }
    // },
    jwt: async ({ token, user }) => {
      console.log("tokendata", token, user);
      return { ...token, ...user };
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
