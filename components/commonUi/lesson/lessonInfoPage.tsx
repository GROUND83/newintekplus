"use client";
import React from "react";
import { getLessonDetail } from "../../commonActions/commonActions";
import { useSession } from "next-auth/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ContentWrap from "@/components/commonUi/contentWrap";
import DownLoadButton from "@/components/commonUi/downloadButton";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export default function LessonInfoPage() {
  const params = useParams<{ groupId: string; lessonId: string }>();

  const session = useSession();

  const fetchDataOptions = {
    lessonId: params.lessonId,
    groupId: params.groupId,
  };
  const {
    data: lesson,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    //
    queryKey: ["lessonInfo", fetchDataOptions],
    queryFn: async () => {
      let res = await getLessonDetail(fetchDataOptions);
      if (res.data) {
        let lesson = JSON.parse(res.data);
        console.log("lesson", lesson);
        return lesson;
      }
    },
  });

  //
  if (isLoading) {
    return (
      <div
        className={`w-full  h-[calc(100vh-170px)]  flex flex-col items-center justify-center`}
      >
        <Loader2 className=" animate-spin size-8 text-primary" />
      </div>
    );
  }
  return (
    <div className="w-full flex flex-col   ">
      <ScrollArea className="w-full flex flex-col  bg-white h-[calc(100vh-170px)] ">
        <div className=" flex-1 w-full flex flex-col items-start p-6 ">
          {lesson && (
            <div className="grid grid-cols-12 gap-3 w-full">
              <div className=" col-span-12 flex flex-col gap-2 border-b py-4">
                <p className="text-neutral-500">레슨명</p>
                <p className="text-md">{lesson.title}</p>
              </div>
              <div className=" col-span-12 flex flex-col gap-2 border-b py-4">
                <p className="text-neutral-500">학습목표</p>
                <p className="text-md  whitespace-pre-wrap ">
                  {lesson.description}
                </p>
              </div>
              {lesson.lessonDirective && (
                <div className=" col-span-12 flex flex-col gap-2 border-b py-4">
                  <p className="text-neutral-500">과제지시문</p>
                  <p className="text-md  whitespace-pre-wrap">
                    {lesson.lessonDirective?.contentdescription}
                  </p>
                  <div className="mt-3">
                    <DownLoadButton
                      downLoadUrl={lesson.lessonDirective?.LessonDirectiveURL}
                      fileName={lesson.lessonDirective?.contentfileName}
                    />
                  </div>
                </div>
              )}
              {lesson?.lessonContents.length > 0 ? (
                <div className=" col-span-12 flex flex-col gap-2 pb-2">
                  <p className="text-neutral-500">레슨 컨텐츠</p>

                  <div className="grid w-full grid-cols-2 gap-3 ">
                    {lesson?.lessonContents.map((item: any, index: any) => {
                      return <ContentWrap key={item._id} data={item} />;
                    })}
                  </div>
                </div>
              ) : (
                <div className="w-full bg-white   h-[200px] flex flex-col items-center justify-center">
                  <div className="w-[200px] h-[200px] flex flex-col items-center justify-center">
                    <p>학습컨텐츠가 없습니다.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
