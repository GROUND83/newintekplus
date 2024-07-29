"use client";

import React from "react";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //

  return (
    <div className="w-full flex flex-col items-stretch flex-1  ">
      <div className="w-full bg-white py-3 border-b px-6 flex flex-row items-center justify-between h-[70px]">
        <p>프로필</p>
      </div>
      <div className=" flex-1 flex flex-col items-stretch bg-white ">
        {children}
      </div>
    </div>
  );
}
