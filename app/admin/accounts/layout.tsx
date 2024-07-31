"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import AddStudentExcel from "./student/_components/addStudentExcel";
import AddTeacherExcel from "./student/_components/addTeacherExcel";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //
  const pathname = usePathname();
  return (
    <div className="w-full flex flex-col items-stretch flex-1  ">
      <div className="w-full bg-white py-3 border-b px-6 flex flex-row items-center justify-between h-[70px]">
        <p>계정 관리</p>
        {pathname === "/admin/wholenotice" && (
          <Button asChild size={"sm"}>
            <Link
              href={"/admin/wholenotice/new"}
              className="flex flex-row items-center gap-2"
            >
              <PlusIcon className="size-4" />
              공지사항 생성
            </Link>
          </Button>
        )}
      </div>
      <div className="w-full h-[50px] flex flex-row items-center justify-between gap-3 px-6 bg-white border-b">
        <div className="flex flex-row items-center gap-2">
          <Button
            asChild
            size="xs"
            variant={pathname.includes("/teacher") ? "default" : "outline"}
          >
            <Link href={"/admin/accounts/teacher"}>강사</Link>
          </Button>
          <Button
            asChild
            size="xs"
            variant={pathname.includes("/student") ? "default" : "outline"}
          >
            <Link href={"/admin/accounts/student"}>교육생</Link>
          </Button>
        </div>
        <div>
          {pathname.includes("admin/accounts/teacher") && <AddTeacherExcel />}
          {pathname.includes("admin/accounts/student") && <AddStudentExcel />}
        </div>
      </div>
      <div className=" flex-1 flex flex-col items-stretch bg-neutral-100 ">
        {children}
      </div>
    </div>
  );
}
