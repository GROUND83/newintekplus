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
import {
  resetGroupdata,
  whoeLessonResultDelete,
} from "./evaluation/_component/actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //
  const [moduleData, setModuleData] = React.useState<any>();
  const [lesson, setLesson] = React.useState<any>();

  const params = useParams<{
    groupId: string;
    moduleId: string;
    lessonId: string;
  }>();
  const pathname = usePathname();

  // const getModuleDetaildata = async () => {
  //   //
  //   console.log(" params.lessonId", params.lessonId);
  //   let res = await getModuleDetail({
  //     lessonId: params.lessonId,
  //     moduleId: params.moduleId,
  //   });
  //   if (res.data) {
  //     let data = JSON.parse(res.data);
  //     console.log("data", data);
  //     setModuleData(data.module);
  //     setLesson(data.lesson);
  //   }
  // };
  // React.useEffect(() => {
  //   getModuleDetaildata();
  // }, [params.moduleId]);

  // const wholeDelete = async () => {
  //   //
  //   let res = await whoeLessonResultDelete(params.groupId);
  //   console.log(res);

  //   if (res.data) {
  //     toast.success("레슨 결과를 전부 삭제 하였습니다.");
  //   }
  // };
  // const resetGroup = async () => {
  //   //
  //   let res = await resetGroupdata(params.groupId);
  //   console.log(res);

  //   if (res.data) {
  //     toast.success("그룹을 초기화 하였습니다.");
  //   }
  // };
  return (
    <div className="w-full flex flex-col items-stretch   ">
      <div className="w-full bg-white  border-b px-6 flex flex-row items-center gap-2 h-[50px] justify-start">
        <Link
          href={`/student/group/${params.groupId}/module/${params.moduleId}/self/${params.lessonId}/info`}
          className={`px-3 py-2 text-xs ${
            pathname.includes("/info")
              ? "bg-primary text-white"
              : "bg-neutral-100 text-black border"
          } rounded-md`}
        >
          레슨 정보
        </Link>
        <Link
          href={`/student/group/${params.groupId}/module/${params.moduleId}/self/${params.lessonId}/evaluation`}
          className={`px-3 py-2 text-xs ${
            pathname.includes("/evaluation")
              ? "bg-primary text-white"
              : "bg-neutral-100 text-black border"
          } rounded-md`}
        >
          과제 수행
        </Link>
        {/* <Button size="xs" onClick={() => wholeDelete()}>
          과제수행 전체삭제
        </Button>
        <Button size="xs" onClick={() => resetGroup()}>
          그룹초기화
        </Button> */}
      </div>
      <div className="flex flex-col  bg-neutral-100">{children}</div>
    </div>
  );
}
