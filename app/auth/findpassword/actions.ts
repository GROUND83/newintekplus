"use server";

import resetPassTemplate from "@/lib/mailtemplate/resetPassTemplate";
import sendMail from "@/lib/sendMail/sendMail";
import Participant from "@/models/participant";
import Teacher from "@/models/teacher";
import Token from "@/models/token";
import User from "@/models/user";
import crypto from "crypto";
export async function findPass(formdata: FormData) {
  let email = formdata.get("email");
  let type = formdata.get("type");
  //
  try {
    if (type === "student") {
      const exUser = await Participant.findOne({ email });
      if (exUser) {
        const token = crypto.randomBytes(20).toString("hex");
        console.log(token);
        console.log(token);
        const data = {
          token,
          email: email,
          ttl: 300,
          type: "student",
        };
        let to = `${email}`;
        const mailData: any = {
          to: to,
          subject: "비밀번호 재설정 메일입니다.",
          from: "noreply@saloncanvas.kr",
          html: resetPassTemplate({
            auth: token,
          }),
        };
        let tokendata = await Token.create(data);
        console.log(tokendata);

        let res = await sendMail(mailData);
        return { data: JSON.stringify(tokendata) };
      } else {
        return { message: "계정이 없습니다." };
      }
    } else if (type === "teacher") {
      const exUser = await Teacher.findOne({ email });
      if (exUser) {
        const token = crypto.randomBytes(20).toString("hex");
        console.log(token);
        console.log(token);
        const data = {
          token,
          email: email,
          ttl: 300,
          type: "teacher",
        };
        let to = `${email}`;
        const mailData: any = {
          to: to,
          subject: "비밀번호 재설정 메일입니다.",
          from: "noreply@saloncanvas.kr",
          html: resetPassTemplate({
            auth: token,
          }),
        };
        let tokendata = await Token.create(data);
        console.log(tokendata);

        let res = await sendMail(mailData);
        return { data: JSON.stringify(tokendata) };
      } else {
        return { message: "계정이 없습니다." };
      }
    } else if (type === "admin") {
      const exUser = await User.findOne({ email });
      if (exUser) {
        const token = crypto.randomBytes(20).toString("hex");
        console.log(token);
        console.log(token);
        const data = {
          token,
          email: email,
          ttl: 300,
          type: "admin",
        };
        let to = `${email}`;
        const mailData: any = {
          to: to,
          subject: "비밀번호 재설정 메일입니다.",
          from: "noreply@saloncanvas.kr",
          html: resetPassTemplate({
            auth: token,
          }),
        };
        let tokendata = await Token.create(data);
        console.log(tokendata);

        let res = await sendMail(mailData);
        return { data: JSON.stringify(tokendata) };
      } else {
        return { message: "계정이 없습니다." };
      }
    }
  } catch (e) {
    return { message: e };
  }
  //
}
