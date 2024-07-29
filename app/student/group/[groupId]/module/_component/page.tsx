"use client";

import React from "react";
import { getModuleList } from "./actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import FeedBackView from "@/app/student/feedback/_components/feedBackView";

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

  const fetchDataOptions = {
    groupId: params.groupId,
  };
  const {
    data: groupData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["groupDetail", fetchDataOptions],
    queryFn: async () => {
      let res = await getModuleList(params.groupId);
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
      <div className="w-full  h-[calc(100vh-70px)]  flex flex-col items-center justify-center">
        <Loader2 className=" animate-spin size-8 text-primary" />
      </div>
    );
  }
  return (
    <div className="w-full flex flex-col items-stretch flex-1  ">
      <div className="flex-1 flex flex-col  w-full">
        <ScrollArea className="w-full flex flex-col items-start h-[calc(100vh-120px)] bg-white">
          <div className="w-full">
            {groupData && (
              <div className="w-full flex flex-col gap-2 p-3 py-3  rounded-sm">
                {groupData.courseProfile.modules.map(
                  (moduledata: any, moduleIndex: any) => {
                    return (
                      <div
                        key={moduledata._id}
                        className="w-full p-3 px-6 flex  flex-col  bg-white border"
                      >
                        <div className="w-full  py-2">
                          <p className="font-bold">{moduledata.title}</p>
                        </div>
                        <div className="pl-2">
                          {moduledata.lessons.map(
                            (lesson: any, lessonsIndex: any) => {
                              return (
                                <div
                                  key={lesson._id}
                                  className=" px-3 py-2 flex flex-row items-center justify-between border rounded-sm"
                                >
                                  <p>{lesson.title}</p>
                                  <div className="flex flex-row items-center gap-3">
                                    <div>
                                      {lesson.finishedPerform ? (
                                        <div className="flex flex-row items-center gap-2">
                                          <p className="border-primary text-primary px-2 py-1 rounded-md border text-xs">
                                            제출 완료
                                          </p>
                                          <FeedBackView
                                            feedBack={
                                              lesson.lessonResult.feedBack
                                            }
                                          />
                                        </div>
                                      ) : (
                                        <p className="border border-neutral-500 text-neutral-500 px-2 py-1 rounded-md text-xs">
                                          미제출
                                        </p>
                                      )}
                                    </div>
                                    {groupData.courseProfile.eduForm ===
                                    "집합교육" ? (
                                      <Button size="xs">
                                        {" "}
                                        <Link
                                          href={`/student/group/${params.groupId}/module/live/${lesson._id}`}
                                        >
                                          레슨입장
                                        </Link>
                                      </Button>
                                    ) : (
                                      <Button size="xs">
                                        <Link
                                          href={`/student/group/${params.groupId}/module/self/${lesson._id}`}
                                        >
                                          셀프러닝
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
