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
        <p>코스프로파일</p>
        {pathname === "/admin/courseprofile" && (
          <Button asChild size={"sm"}>
            <Link
              href={"/admin/courseprofile/new"}
              className="flex flex-row items-center gap-2"
            >
              <PlusIcon className="size-4" />
              코스프로파일 생성
            </Link>
          </Button>
        )}
      </div>
      <div className="flex flex-col  bg-neutral-100">{children}</div>
    </div>
  );
}
