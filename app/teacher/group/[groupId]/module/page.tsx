"use client";

import React from "react";
import { getModuleList } from "./actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";

export default function Page({ params }: { params: { groupId: string } }) {
  console.log("groupId", params.groupId);
  const [group, setGroup] = React.useState<any>();
  const session = useSession();
  const getModuleListdata = async () => {
    let res = await getModuleList(params.groupId);
    if (res.data) {
      let group = JSON.parse(res.data);
      console.log("group", group);
      setGroup(group);
    }
  };
  React.useEffect(() => {
    getModuleListdata();
  }, [params.groupId]);
  //
  // const checkIsDone = ({ lessonId }: { lessonId: string }) => {
  //   //
  //   let findarrya = group.lessonResults.find(
  //     (item: any) =>
  //       item.lessonId === lessonId &&
  //       item.onwer.email === session.data.user.email
  //   );
  //   // console.log("lessonResults", findarrya);
  //   if (findarrya.isLessonDone) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // };
  return (
    <div className="w-full flex flex-col items-stretch flex-1  ">
      <div className="flex-1 flex flex-col  w-full">
        <ScrollArea className="  flex-1 w-full flex flex-col items-start max-h-[calc(100vh-170px)]">
          <div className="w-full">
            {group && (
              <div className="w-full flex flex-col gap-2">
                {group.courseProfile.modules.map(
                  (moduledata: any, moduleIndex: any) => {
                    return (
                      <div
                        key={moduledata._id}
                        className="w-full p-3 flex gap-2 flex-col border bg-white"
                      >
                        <div className="w-full border-b py-2 flex flex-row items-center gap-2">
                          <p>모듈</p>
                          <p>{moduledata.title}</p>
                        </div>
                        <div className="pl-2">
                          {moduledata.lessons.map(
                            (lesson: any, lessonsIndex: any) => {
                              return (
                                <div
                                  key={lesson._id}
                                  className="border-b px-3 py-1 flex flex-row items-center justify-between"
                                >
                                  <div className="flex flex-row items-center gap-2">
                                    <p>레슨</p>
                                    <p>{lesson.title}</p>
                                  </div>
                                  <div className="flex flex-row items-center gap-3">
                                    {group.courseProfile.eduForm ===
                                    "집합교육" ? (
                                      <Button size="xs">
                                        <Link
                                          href={`/teacher/group/${params.groupId}/module/${moduledata._id}/live/${lesson._id}/info`}
                                        >
                                          레슨입장
                                        </Link>
                                      </Button>
                                    ) : (
                                      <Button size="xs">
                                        <Link
                                          href={`/teacher/group/${params.groupId}/module/${moduledata._id}/self/${lesson._id}/info`}
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
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
