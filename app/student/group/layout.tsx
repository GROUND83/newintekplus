"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import Group from "@/models/group";
import { useParams, usePathname } from "next/navigation";
import { detailGroup } from "./_components/table/actions";
import GroupData from "@/components/commonUi/groupData";
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //

  return (
    <div className="w-full flex flex-col items-stretch flex-1  ">
      <div className="w-full bg-white py-3 border-b px-6 flex flex-row items-center justify-between h-[70px]">
        <div className="flex flex-row items-center gap-2">
          <GroupData />
        </div>
      </div>
      <div className="flex flex-col  bg-neutral-100">{children}</div>
    </div>
  );
}
