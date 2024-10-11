"use server";

import resetPassTemplate from "@/lib/mailtemplate/resetPassTemplate";
import sendMail from "@/lib/sendMail/sendMail";
import Participant from "@/models/participant";
import Teacher from "@/models/teacher";

import User from "@/models/user";
import crypto from "crypto";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import bcrypt from "bcrypt";
import temp_pw_issuance from "@/lib/generatePassword";
import { connectToMongoDB } from "@/lib/db";

export async function findPass(formdata: FormData) {
  let email = formdata.get("email") as string;
  let type = formdata.get("type") as string;
  //
  await connectToMongoDB();
  console.log(email, type);
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

        sendMail(mailData);
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
      console.log("exUser", exUser);
      if (exUser) {
        // console.log(exUser);
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
        console.log(res);
        return { data: JSON.stringify(updateuser) };
      } else {
        return { message: "계정이 없습니다." };
      }
    }
  } catch (e) {
    console.log(e);
    return { message: e };
  }
  //
}

export async function authenticate(formData: FormData) {
  try {
    let email = formData.get("email");
    let password = formData.get("password");
    let role = formData.get("role");
    let callbackUrl = formData.get("callbackUrl") as string;
    console.log({
      email: email,
      password: password,
      role: role,
      callbackUrl: callbackUrl,
      redirect: false,
    });
    await signIn("credentials", {
      email: email,
      password: password,
      role: role,
      redirectTo: callbackUrl,
      redirect: true,
    });
    return false;
  } catch (error) {
    console.log("errorerror", error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          console.log(
            "error.message",

            error.cause.err.message
          );
          return JSON.stringify({ passwrod: error.cause.err.message });
      }
    }
    throw error;
  }
}
