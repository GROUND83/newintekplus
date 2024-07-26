"use server";

import resetPassTemplate from "@/lib/mailtemplate/resetPassTemplate";
import sendMail from "@/lib/sendMail/sendMail";
import Participant from "@/models/participant";
import Teacher from "@/models/teacher";
import Token from "@/models/token";
import User from "@/models/user";
import crypto from "crypto";

import bcrypt from "bcrypt";
import temp_pw_issuance from "@/lib/generatePassword";

export async function findPass(formdata: FormData) {
  let email = formdata.get("email");
  let type = formdata.get("type");
  //
  try {
    if (type === "student") {
      const exUser = await Participant.findOne({ email });
      if (exUser) {
        //
        let temppasswrd = temp_pw_issuance();
        const hashedPasswrod = await bcrypt.hash(temppasswrd, 12);

        let updateuser = await Participant.findOneAndUpdate(
          {
            _id: exUser._id,
          },
          {
            password: hashedPasswrod,
          }
        );

        let to = `${email}`;
        const mailData: any = {
          to: to,
          subject: "임시 비밀번호 안내 메일입니다.",
          from: "noreply@saloncanvas.kr",
          html: resetPassTemplate({
            auth: temppasswrd,
          }),
        };

        let res = await sendMail(mailData);
        return { data: JSON.stringify(updateuser) };
      } else {
        return { message: "계정이 없습니다." };
      }
    } else if (type === "teacher") {
      const exUser = await Teacher.findOne({ email });
      if (exUser) {
        let temppasswrd = temp_pw_issuance();
        const hashedPasswrod = await bcrypt.hash(temppasswrd, 12);

        let updateuser = await Teacher.findOneAndUpdate(
          {
            _id: exUser._id,
          },
          {
            password: hashedPasswrod,
          }
        );

        let to = `${email}`;
        const mailData: any = {
          to: to,
          subject: "임시 비밀번호 안내 메일입니다.",
          from: "noreply@saloncanvas.kr",
          html: resetPassTemplate({
            auth: temppasswrd,
          }),
        };

        let res = await sendMail(mailData);
        return { data: JSON.stringify(updateuser) };
      } else {
        return { message: "계정이 없습니다." };
      }
    } else if (type === "admin") {
      const exUser = await User.findOne({ email });
      if (exUser) {
        let temppasswrd = temp_pw_issuance();
        const hashedPasswrod = await bcrypt.hash(temppasswrd, 12);

        let updateuser = await User.findOneAndUpdate(
          {
            _id: exUser._id,
          },
          {
            password: hashedPasswrod,
          }
        );

        let to = `${email}`;
        const mailData: any = {
          to: to,
          subject: "임시 비밀번호 안내 메일입니다.",
          from: "noreply@saloncanvas.kr",
          html: resetPassTemplate({
            auth: temppasswrd,
          }),
        };

        let res = await sendMail(mailData);
        return { data: JSON.stringify(updateuser) };
      } else {
        return { message: "계정이 없습니다." };
      }
    }
  } catch (e) {
    return { message: e };
  }
  //
}
