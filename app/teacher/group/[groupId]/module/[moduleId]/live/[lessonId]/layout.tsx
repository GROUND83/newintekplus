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

  const getModuleDetaildata = async () => {
    //
    console.log(" params.lessonId", params.lessonId);
    let res = await getModuleDetail({
      lessonId: params.lessonId,
      moduleId: params.moduleId,
    });
    if (res.data) {
      let data = JSON.parse(res.data);
      console.log("data", data);
      setModuleData(data.module);
      setLesson(data.lesson);
    }
  };
  React.useEffect(() => {
    getModuleDetaildata();
  }, [params.moduleId]);
  return (
    <div className="w-full flex flex-col items-stretch flex-1  ">
      <div className="w-full bg-white py-3 border-b px-6 flex flex-row items-center gap-2 h-[50px] justify-between">
        {moduleData && (
          <div>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={`/admin/group/${params.groupId}/detail/module`}
                  >
                    학습리스트
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{moduleData.title}</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{lesson.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        )}
        <div className="flex flex-row items-center gap-2">
          <Link
            href={`/teacher/group/${params.groupId}/module/${params.moduleId}/live/${params.lessonId}/info`}
            className={`px-3 py-2 text-xs ${
              pathname.includes("/info")
                ? "bg-primary text-white"
                : "bg-neutral-100 text-black border"
            } rounded-md`}
          >
            레슨 정보
          </Link>
          <Link
            href={`/teacher/group/${params.groupId}/module/${params.moduleId}/live/${params.lessonId}/evaluation`}
            className={`px-3 py-2 text-xs ${
              pathname.includes("/evaluation")
                ? "bg-primary text-white"
                : "bg-neutral-100 text-black border"
            } rounded-md`}
          >
            레슨 평가
          </Link>
        </div>
      </div>
      <div className="flex flex-col  bg-neutral-100">{children}</div>
    </div>
  );
}
