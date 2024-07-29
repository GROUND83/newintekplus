"use client";
import React from "react";
import { getLessonDetail, whoeLessonResultDelete } from "./_component/actions";
import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormLabelWrap from "@/components/formLabel";
import { DownloadIcon, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { ScrollArea } from "@/components/ui/scroll-area";
import PerformEvaluation from "../_component/performEvaluation";
import ViewFeedBack from "../_component/viewfeedBack";
import FeedbackSend from "../_component/feedback";
import { useQuery } from "@tanstack/react-query";

const FormSchema = z.object({
  downUrl: z.string().optional(), //레슨다운로드
  fileName: z.string().optional(), // 레슨파일이름
  size: z.number().optional(), // 레슨 파일 크기
  file: z.instanceof(File).optional(),
});

export default function Page({
  params,
}: {
  params: { groupId: string; lessonId: string };
}) {
  const fetchDataOptions = {
    lessonId: params.lessonId,
    groupId: params.groupId,
  };
  const {
    data: lessonResult,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    //
    queryKey: ["evauation", fetchDataOptions],
    queryFn: async () => {
      let res = await getLessonDetail(fetchDataOptions);
      if (res.lessonResult) {
        let lessonResult = JSON.parse(res.lessonResult);
        console.log("lessonResult", lessonResult);

        return lessonResult;
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

  return (
    <div className="bg-white border flex-1 w-full flex flex-col items-start ">
      <div className="h-[30px] px-6 flex flex-row items-center w-full">
        <p className="text-md font-bold">과제수행 평가</p>
      </div>
      <ScrollArea className="w-full flex flex-col  bg-white h-[calc(100vh-210px)] ">
        {lessonResult && (
          <div className="w-full grid grid-cols-12 gap-1 px-6">
            <div className=" col-span-12 grid grid-cols-12 gap-1 text-xs">
              <div className=" col-span-2 bg-neutral-100 border p-2">
                <p>교육 대상자</p>
              </div>

              <div className=" col-span-5 bg-neutral-100 border p-2">
                <p>과제수행</p>
              </div>
              <div className=" col-span-3 bg-neutral-100 border p-2">
                <p>평가</p>
              </div>
              <div className=" col-span-2 bg-neutral-100 border p-2">
                <p>피드백</p>
              </div>
            </div>
            {lessonResult.map((item: any, index: any) => {
              return (
                <div
                  key={item._id}
                  className=" col-span-12 grid grid-cols-12 gap-1"
                >
                  <div className=" col-span-2 bg-white border p-2 text-xs flex flex-row items-center">
                    <p>{item.onwer.username}</p>
                  </div>
                  <div className=" col-span-5 bg-white border p-2 flex flex-row items-center">
                    {item.perform.downUrl ? (
                      <a
                        href={item.perform.downUrl}
                        download
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-row items-center justify-between flex-1 w-full "
                      >
                        <p className="flex-1 w-full  text-xs line-clamp-1">
                          {item.perform.fileName}
                        </p>
                      </a>
                    ) : (
                      <p className="text-xs">미제출</p>
                    )}
                  </div>
                  <div className=" col-span-3 bg-white border p-2">
                    <PerformEvaluation
                      lessonResult={item}
                      getLessonData={refetch}
                    />
                  </div>
                  <div className=" col-span-2 bg-white border p-2">
                    {item.feedBack ? (
                      <div>
                        <ViewFeedBack
                          lessonResult={item}
                          getLessonData={refetch}
                        />
                      </div>
                    ) : (
                      <FeedbackSend
                        lessonResult={item}
                        getLessonData={refetch}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
