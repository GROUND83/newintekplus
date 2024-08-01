"use client";

import { useParams } from "next/navigation";
import React from "react";
import GroupData from "@/components/commonUi/groupData";
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //

  const params = useParams<{ groupId: string }>();

  return (
    <div className="w-full flex flex-col items-stretch flex-1  ">
      <div className="w-full bg-white py-3 border-b px-6 flex flex-row items-center justify-between h-[70px]">
        <GroupData />
      </div>
      <div className="flex flex-col  bg-neutral-100">{children}</div>
    </div>
  );
}
