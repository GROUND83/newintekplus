"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import Group from "@/models/group";
import { usePathname } from "next/navigation";
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //
  const pathname = usePathname();
  return (
    <div className="w-full flex flex-col items-stretch flex-1  ">
      <div className="w-full bg-white py-3 border-b px-6 flex flex-row items-center justify-between  h-[70px]">
        <p>이수현황</p>
      </div>
      <div className="w-full bg-white border-b h-[50px] flex flex-row items-center gap-2 px-3">
        <Link
          href={"/admin/complete/personal"}
          className={`p-2 rounded-md flex flex-row items-center gap-2 ${
            pathname.includes("/admin/complete/personal")
              ? "bg-primary text-white"
              : "bg-neutral-100 text-black border"
          }`}
        >
          개별 이수현황
        </Link>

        <Link
          href={"/admin/complete/monthly"}
          className={`p-2 rounded-md flex flex-row items-center gap-2 ${
            pathname.includes("/admin/complete/monthly")
              ? "bg-primary text-white"
              : "bg-neutral-100 text-black border"
          }`}
        >
          월별 이수현황
        </Link>
      </div>
      <div className="flex flex-col  bg-neutral-100">{children}</div>
    </div>
  );
}
