"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ...

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
      callbackUrl: callbackUrl,
      redirect: false,
    });
    revalidatePath(callbackUrl);
    // redirect(callbackUrl);
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
