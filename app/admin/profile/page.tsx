"use server";

import ProfileComponent from "@/components/commonUi/profileComponent";
import { auth } from "@/auth";
export default async function Page() {
  const session = await auth();

  console.log("session", session);
  return <ProfileComponent session={session} type="admin" />;
}
