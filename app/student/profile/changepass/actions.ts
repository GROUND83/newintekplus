"use server";

import { auth } from "@/auth";
import Participant from "@/models/participant";

import bcrypt from "bcrypt";
import { notFound } from "next/navigation";

export async function chagePass(formdata: FormData) {
  let password = formdata.get("password") as string;
  let email = formdata.get("email") as string;
  // let token = formdata.get("token");
  //
  const session = await auth();
  if (!session.user) return notFound();

  console.log(new Date());
  try {
    const hash = await bcrypt.hash(password, 10);
    let res = await Participant.findOneAndUpdate(
      { email: session.user.email },
      { password: hash }
    );
    return { data: JSON.stringify(res) };
  } catch (e) {
    return { message: e };
  }
}
//
