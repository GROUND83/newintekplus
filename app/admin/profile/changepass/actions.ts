"use server";

import resetPassTemplate from "@/lib/mailtemplate/resetPassTemplate";
import sendMail from "@/lib/sendMail/sendMail";
import Participant from "@/models/participant";
import Token from "@/models/token";
import crypto from "crypto";
import dayjs from "dayjs";
import bcrypt from "bcrypt";
import Teacher from "@/models/teacher";
import User from "@/models/user";
//
export async function chagePass(formdata: FormData) {
  let password = formdata.get("password") as string;
  let email = formdata.get("email") as string;
  // let token = formdata.get("token");
  //

  console.log(new Date());
  try {
    const hash = await bcrypt.hash(password, 10);
    let res = await User.findOneAndUpdate({ email: email }, { password: hash });
    return { data: JSON.stringify(res) };
  } catch (e) {
    return { message: e };
  }
}
//
