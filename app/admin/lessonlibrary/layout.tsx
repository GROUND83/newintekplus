"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //
  const pathname = usePathname();
  return (
    <div className="w-full flex flex-col items-stretch h-screen ">
      <div className="w-full bg-white py-3  px-6 flex flex-row items-center justify-between h-[70px] border-b">
        <p>레슨 라이브러리</p>
        {pathname === "/admin/lessonlibrary" && (
          <Button asChild size={"sm"}>
            <Link
              href={"/admin/lessonlibrary/new"}
              className="flex flex-row items-center gap-2"
            >
              <PlusIcon className="size-4" />
              레슨 라이브러리 생성
            </Link>
          </Button>
        )}
      </div>
      <div className="  flex flex-col  bg-neutral-100">{children}</div>
    </div>
  );
}
