"use server";

import Participant from "@/models/participant";
import Token from "@/models/token";

import dayjs from "dayjs";
import bcrypt from "bcrypt";
import Teacher from "@/models/teacher";
import User from "@/models/user";
//
export async function resetPass(formdata: FormData) {
  let password = formdata.get("password") as string;
  let token = formdata.get("token");
  //
  if (token) {
    console.log(new Date());
    try {
      let tokendata = await Token.findOne({
        $and: [
          { token: token },
          { createdAt: { $gt: dayjs().subtract(3, "hour") } },
        ],
      });
      console.log("tokendata", tokendata);
      if (tokendata) {
        if (tokendata.type === "student") {
          const hash = await bcrypt.hash(password, 10);
          await Participant.findOneAndUpdate(
            { email: tokendata.email },
            { password: hash }
          );
          return { data: JSON.stringify({ type: tokendata.type }) };
        } else if (tokendata.type === "teacher") {
          const hash = await bcrypt.hash(password, 10);
          await Teacher.findOneAndUpdate(
            { email: tokendata.email },
            { password: hash }
          );
          return { data: JSON.stringify({ type: tokendata.type }) };
        } else if (tokendata.type === "admin") {
          const hash = await bcrypt.hash(password, 10);
          await User.findOneAndUpdate(
            { email: tokendata.email },
            { password: hash }
          );
          return { data: JSON.stringify({ type: tokendata.type }) };
        }
      } else {
        return { message: "토큰이 만료되었습니다." };
      }
    } catch (e) {
      return { message: e };
    }
  }
  //
}
