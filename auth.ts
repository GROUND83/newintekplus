import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import User from "@/models/user";
import NextAuth from "next-auth";

import Participant from "@/models/participant";
import Teacher from "@/models/teacher";
import { authConfig } from "./auth.config";
import { connectToMongoDB } from "./lib/db";
function exclude(user: any, keys: any) {
  for (let key of keys) {
    delete user[key];
  }
  return user;
}
function checkCredential({
  email,
  password,
  type,
  role,
}: {
  email: any;
  password: any;
  type: any;
  role: any;
}) {
  return new Promise(async (resolve, reject) => {
    let user: any = {};
    try {
      await connectToMongoDB();
      if (role === "admin") {
        console.log(email, password, type, role);
        let findUser = await User.findOne({ email: email });
        console.log("findUser", findUser);
        if (findUser) {
          user = findUser;
        } else {
          reject("계정이 없습니다.");
        }
      }
      if (role === "student") {
        console.log(email, password, type, role);
        let findUser = await Participant.findOne({ email: email });
        console.log("findUser", findUser);
        if (findUser) {
          user = findUser;
        } else {
          reject("계정이 없습니다.");
        }
      }
      if (role === "teacher") {
        console.log(email, password, type, role);
        let findUser = await Teacher.findOne({ email: email });
        console.log("findUser", findUser);
        if (findUser) {
          user = findUser;
        } else {
          reject("계정이 없습니다.");
        }
      }

      console.log("user", user);
      if (Object.keys(user).length > 0) {
        const ok = await bcrypt.compare(password, user!.password ?? "");
        console.log("ok", ok);
        if (ok) {
          let userdata = exclude(user, ["password"]);
          if (userdata) {
            resolve(userdata);
          }
        } else {
          reject("비밀번호가 불일치 합니다.");
        }
      } else {
        console.log("reejct");
        reject("계정이 없습니다.");
        // throw new Error("등록된 계정이 없습니다.");
      }
    } catch (e: any) {
      console.log(e);
      reject(e);
    }
  });
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials: any, req) => {
        let user = null;
        // console.log("credentials", credentials);
        let body = await req.json();
        console.log("body", body);
        let role: any = body?.role;
        let type: any = body?.type;
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        if (req.body) {
          console.log("role", role);
          if (role === "admin") {
            try {
              let result: any = await checkCredential({
                email: credentials.email!,
                password: credentials.password!,
                type: credentials.type!,
                role: credentials.role!,
              });
              return result;
            } catch (e: any) {
              //
              console.log("e", e);

              throw new Error(e);
            }
          } else if (role === "teacher") {
            try {
              let result: any = await checkCredential({
                email: credentials.email!,
                password: credentials.password!,
                type,
                role,
              });
              return result;
            } catch (e: any) {
              //
              console.log(e);
              throw new Error(e);
            }
          } else if (role === "student") {
            try {
              let result: any = await checkCredential({
                email: credentials.email!,
                password: credentials.password!,
                type,
                role,
              });
              return result;
            } catch (e: any) {
              //
              console.log(e);
              throw new Error(e);
            }
          }
        } else {
          throw new Error("잘못된 접근입니다.");
        }
      },
    }),
  ],
});
