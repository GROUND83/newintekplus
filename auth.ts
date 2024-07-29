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
// function checkCredential({
//   email,
//   password,
//   role,
// }: {
//   email: any;
//   password: any;

//   role: any;
// }) {
//   return new Promise(async (resolve, reject) => {
//     let user: any = {};
//     try {
//       await connectToMongoDB();
//       if (role === "admin") {
//         console.log(email, password, role);
//         let findUser = await User.findOne({ email: email })
//           .select("username email  role _id password")
//           .lean();
//         console.log("findUser", findUser);
//         if (findUser) {
//           user = findUser;
//         } else {
//           return reject("계정이 없습니다.");
//         }
//       }
//       if (role === "participant") {
//         let findUser = await Participant.findOne({ email: email })
//           .select("username email  role _id password")
//           .lean();
//         console.log("findUser", findUser);
//         if (findUser) {
//           user = findUser;
//         } else {
//           reject("계정이 없습니다.");
//         }
//       }
//       if (role === "teacher") {
//         let findUser = await Teacher.findOne({ email: email })
//           .select("username email  role _id password")
//           .lean();
//         console.log("findUser", findUser);
//         if (findUser) {
//           user = findUser;
//         } else {
//           return reject("계정이 없습니다.");
//         }
//         console.log(email, password, role);
//       }

//       console.log("user", user);
//       if (Object.keys(user).length > 0) {
//         const ok = await bcrypt.compare(password, user!.password ?? "");
//         console.log("ok", ok);
//         if (ok) {
//           let userdata = exclude(user, ["password"]);
//           console.log("userdata", userdata);
//           if (userdata) {
//             return resolve(userdata);
//           }
//         } else {
//           return reject("비밀번호가 불일치 합니다.");
//         }
//       } else {
//         console.log("reejct");
//         return reject("계정이 없습니다.");
//         // throw new Error("등록된 계정이 없습니다.");
//       }
//     } catch (e: any) {
//       console.log(e);
//       return reject(e);
//     }
//   });
// }

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials: any) => {
        let user = null;
        console.log("credentials", credentials);

        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        console.log("credentials.role", credentials.role);
        if (credentials.role === "admin") {
          await connectToMongoDB();

          let findUser = await User.findOne({ email: credentials.email })
            .select("username email  role _id password")
            .lean();
          console.log("findUser", findUser);
          if (findUser) {
            user = findUser;
          } else {
            throw new Error("계정이 없습니다.");
          }
          console.log("user", user);
          if (Object.keys(user).length > 0) {
            const ok = await bcrypt.compare(
              credentials.password,
              user!.password ?? ""
            );
            console.log("ok", ok);
            if (ok) {
              let userdata = exclude(user, ["password"]);
              console.log("userdata", userdata);

              return userdata;
            } else {
              throw new Error("비밀번호가 불일치 합니다.");
            }
          } else {
            throw new Error("계정이 없습니다.");

            // throw new Error("등록된 계정이 없습니다.");
          }
        } else if (credentials.role === "teacher") {
          await connectToMongoDB();

          let findUser = await Teacher.findOne({ email: credentials.email })
            .select("username email  role _id password")
            .lean();
          console.log("findUser", findUser);
          if (findUser) {
            user = findUser;
          } else {
            throw new Error("계정이 없습니다.");
          }
          console.log("user", user);
          if (Object.keys(user).length > 0) {
            const ok = await bcrypt.compare(
              credentials.password,
              user!.password ?? ""
            );
            console.log("ok", ok);
            if (ok) {
              let userdata = exclude(user, ["password"]);
              console.log("userdata", userdata);

              return userdata;
            } else {
              throw new Error("비밀번호가 불일치 합니다.");
            }
          } else {
            throw new Error("계정이 없습니다.");

            // throw new Error("등록된 계정이 없습니다.");
          }
        } else if (credentials.role === "participant") {
          await connectToMongoDB();

          let findUser = await Participant.findOne({ email: credentials.email })
            .select("username email  role _id password")
            .lean();
          console.log("findUser", findUser);
          if (findUser) {
            user = findUser;
          } else {
            throw new Error("계정이 없습니다.");
          }
          console.log("user", user);
          if (Object.keys(user).length > 0) {
            const ok = await bcrypt.compare(
              credentials.password,
              user!.password ?? ""
            );
            console.log("ok", ok);
            if (ok) {
              let userdata = exclude(user, ["password"]);
              console.log("userdata", userdata);

              return userdata;
            } else {
              throw new Error("비밀번호가 불일치 합니다.");
            }
          } else {
            throw new Error("계정이 없습니다.");

            // throw new Error("등록된 계정이 없습니다.");
          }
        }
      },
    }),
  ],
});
