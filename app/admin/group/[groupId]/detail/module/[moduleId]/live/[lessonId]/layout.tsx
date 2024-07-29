"use client";

import React from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useParams, usePathname } from "next/navigation";
import { getModuleDetail } from "./_component/actions";
import { Button } from "@/components/ui/button";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //

  const params = useParams<{
    groupId: string;
    moduleId: string;
    lessonId: string;
  }>();
  const pathname = usePathname();

  return (
    <div className="w-full flex flex-col items-start  ">
      <div className="flex flex-row items-center gap-2 h-[50px] bg-white w-full px-6 border-b">
        <Button
          asChild
          size="xs"
          variant={
            pathname ===
            `/admin/group/${params.groupId}/detail/module/${params.moduleId}/live/${params.lessonId}/info`
              ? "default"
              : "defaultoutline"
          }
        >
          <Link
            href={`/admin/group/${params.groupId}/detail/module/${params.moduleId}/live/${params.lessonId}/info`}
          >
            레슨 정보
          </Link>
        </Button>
        <Button
          asChild
          size="xs"
          variant={
            pathname ===
            `/admin/group/${params.groupId}/detail/module/${params.moduleId}/live/${params.lessonId}/evaluation`
              ? "default"
              : "defaultoutline"
          }
        >
          <Link
            href={`/admin/group/${params.groupId}/detail/module/${params.moduleId}/live/${params.lessonId}/evaluation`}
          >
            레슨 평가
          </Link>
        </Button>
      </div>

      <div className="flex flex-col  bg-neutral-100   w-full">{children}</div>
    </div>
  );
}
