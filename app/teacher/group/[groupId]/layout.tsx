"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { useParams, usePathname } from "next/navigation";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //

  const params = useParams<{ groupId: string }>();
  const pathname = usePathname();

  return (
    <div className="w-full flex flex-col items-stretch flex-1  ">
      <div className="w-full bg-white py-3 border-b px-6 flex flex-row items-center gap-6 h-[70px]">
        <Link
          href={`/teacher/group/${params.groupId}/notice`}
          className={`px-3 py-2 ${
            pathname.includes("/notice")
              ? "bg-primary text-white"
              : "bg-neutral-100 text-black border"
          } rounded-md`}
        >
          그룹 공지사항
        </Link>
        <Link
          href={`/teacher/group/${params.groupId}/module`}
          className={`px-3 py-2 ${
            pathname.includes("/module")
              ? "bg-primary text-white"
              : "bg-neutral-100 text-black border"
          } rounded-md`}
        >
          학습리스트
        </Link>
        <Link
          href={`/teacher/group/${params.groupId}/message`}
          className={`px-3 py-2 ${
            pathname.includes("/message")
              ? "bg-primary text-white"
              : "bg-neutral-100 text-black border"
          } rounded-md`}
        >
          메세지
        </Link>
        <Link
          href={`/teacher/group/${params.groupId}/livesurvey`}
          className={`px-3 py-2 ${
            pathname.includes("/livesurvey")
              ? "bg-primary text-white"
              : "bg-neutral-100 text-black border"
          } rounded-md`}
        >
          설문응답
        </Link>
      </div>
      <div className="flex flex-col  bg-neutral-100">{children}</div>
    </div>
  );
}
