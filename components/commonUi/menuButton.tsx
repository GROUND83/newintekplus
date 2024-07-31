"use client";
import Link from "next/link";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { auth } from "@/auth";
import React from "react";
import { getSession } from "next-auth/react";
// import { getSession } from "../commonActions/commonActions";

//
export const ProfileButton = () => {
  const getSessiondata = async () => {
    // "use server";
    let session = await getSession();
    console.log("session", session);
  };
  // getSession();
  React.useEffect(() => {
    getSessiondata();
  }, []);
  return (
    <Link className="py-6 gap-2 flex flex-col" href={"/admin/profile"}>
      <p>프로필</p>

      {/* <Avatar className="bg-white flex flex-col items-center justify-center">
        <AvatarFallback>AM</AvatarFallback>
      </Avatar> */}
    </Link>
  );
};
