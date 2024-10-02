"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";
import { Loader2, PlusIcon } from "lucide-react";
import { useParams, usePathname } from "next/navigation";

import GroupData from "@/components/commonUi/groupData";
import { getModuleList } from "./actions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //

  const pathname = usePathname();
  const params = useParams<{ groupId: string }>();
  console.log("groupId", params.groupId);

  const fetchDataOptions = {
    groupId: params.groupId,
  };
  const {
    data: group,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    //
    queryKey: ["data", fetchDataOptions],
    queryFn: async () => {
      let res = await getModuleList(fetchDataOptions);
      if (res.data) {
        let group = JSON.parse(res.data);
        console.log("group", group);
        // setGroup(group);
        return group;
      }
    },
  });
  if (isLoading) {
    return (
      <div
        className={`w-full  h-[calc(100vh-170px)]  flex flex-col items-center justify-center`}
      >
        <Loader2 className=" animate-spin size-8 text-primary" />
      </div>
    );
  }

  const checkEvaluation = (lessonId: string) => {
    let isDone = 0;
    let isNew = 0;
    let total = 0;
    if (group.lessonResults.length > 0) {
      //
      let findResult = group.lessonResults.filter(
        (item: any) => item.lessonId === lessonId
      );
      if (findResult.length > 0) {
        let isDoneData = findResult.filter(
          (result: any) => result.isEvaluationDone
        );
        let isNewData = findResult.filter((result: any) => result.isNewdata);
        console.log("isDone", isDone);
        isDone = isDoneData.length;
        isNew = isNewData.length;
      }
      console.log("findResult", findResult);
      total = findResult.length;
    }
    //
    return { isDone: isDone, total: total, isNew: isNew };
  };
  return (
    <div className="w-full grid grid-cols-12 gap-1 ">
      <div className="col-span-6 flex flex-col items-start  justify-start border-r">
        <div className="w-full flex flex-row items-center h-[50px] px-6 bg-white border-b">
          <p>학습리스트</p>
        </div>
        {group && (
          <div className="w-full flex flex-col gap-2 px-6 bg-white h-full">
            <ScrollArea className="w-full flex flex-col h-[calc(100vh-170px)] gap-2 ">
              <div className="flex flex-col w-full gap-2">
                {group.courseProfile.modules.map(
                  (moduledata: any, moduleIndex: any) => {
                    return (
                      <div
                        key={moduledata._id}
                        className="w-full p-3 flex flex-col  bg-neutral-100 gap-2 border"
                      >
                        <div className="w-full  flex flex-row items-center gap-2">
                          <p>{moduledata.title}</p>
                        </div>
                        <div className="pl-2 flex flex-col w-full gap-1">
                          {moduledata.lessons.map(
                            (lesson: any, lessonsIndex: any) => {
                              return (
                                <div
                                  key={lesson._id}
                                  className={`px-3 py-1 flex flex-row items-center justify-between  border  gap-2 bg-white`}
                                >
                                  <div className="flex flex-col items-start gap-2">
                                    <p className=" line-clamp-1">
                                      {lesson.title}
                                    </p>
                                    <div className="flex flex-row items-center gap-2">
                                      <div className="flex flex-row items-center gap-1">
                                        <p>new</p>
                                        <p>
                                          {checkEvaluation(lesson._id).isNew}
                                        </p>
                                      </div>
                                      <p>/</p>
                                      <div className="flex flex-row items-center gap-1">
                                        <p>완료</p>
                                        <p>
                                          {checkEvaluation(lesson._id).isDone}
                                        </p>
                                      </div>
                                      <p>/</p>
                                      <div className="flex flex-row items-center gap-1">
                                        <p>총</p>
                                        <p>
                                          {checkEvaluation(lesson._id).total}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex flex-row items-center gap-3">
                                    {group.courseProfile.eduForm ===
                                    "집합교육" ? (
                                      <Button
                                        size="xs"
                                        variant={
                                          pathname.includes(`${lesson._id}`)
                                            ? "default"
                                            : "defaultoutline"
                                        }
                                        asChild
                                      >
                                        <Link
                                          href={`/admin/group/${params.groupId}/detail/module/${moduledata._id}/live/${lesson._id}/info`}
                                        >
                                          레슨입장
                                        </Link>
                                      </Button>
                                    ) : (
                                      <Button
                                        size="xs"
                                        variant={
                                          pathname.includes(`${lesson._id}`)
                                            ? "default"
                                            : "defaultoutline"
                                        }
                                        asChild
                                      >
                                        <Link
                                          href={`/admin/group/${params.groupId}/detail/module/${moduledata._id}/self/${lesson._id}/info`}
                                        >
                                          레슨입장
                                        </Link>
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
      <div className="flex flex-col  bg-neutral-100 col-span-6 border-l">
        {children}
      </div>
    </div>
  );
}
