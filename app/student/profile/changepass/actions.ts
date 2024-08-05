"use server";

import Participant from "@/models/participant";

import bcrypt from "bcrypt";

export async function chagePass(formdata: FormData) {
  let password = formdata.get("password") as string;
  let email = formdata.get("email") as string;
  // let token = formdata.get("token");
  //

  console.log(new Date());
  try {
    const hash = await bcrypt.hash(password, 10);
    let res = await Participant.findOneAndUpdate(
      { email: email },
      { password: hash }
    );
    return { data: JSON.stringify(res) };
  } catch (e) {
    return { message: e };
  }
}
//
