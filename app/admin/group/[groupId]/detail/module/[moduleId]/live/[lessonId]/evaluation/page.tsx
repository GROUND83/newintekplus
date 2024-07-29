"use client";
import React from "react";
import { getLessonDetail } from "./_component/actions";
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
import { useQuery } from "@tanstack/react-query";

export default function Page({
  params,
}: {
  params: { groupId: string; lessonId: string };
}) {
  const session = useSession();

  //
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
    queryKey: ["liveEvaluation", fetchDataOptions],
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
    <div className="w-full flex flex-col items-stretch flex-1 bg-white h-[calc(100vh-170px)] ">
      {lessonResult && (
        <div className="bg-white  flex-1 w-full flex flex-col items-start px-6">
          <div className="h-[50px] flex flex-row items-center w-full">
            <p className="text-md font-bold">레슨 평가</p>
          </div>

          <div className="w-full grid grid-cols-12 ">
            <div className=" col-span-12 grid grid-cols-12 gap-1 h-[30px]">
              <div className=" col-span-2 bg-neutral-100 border flex flex-row items-center px-3">
                <p className="text-xs">교육 대상자</p>
              </div>

              <div className=" col-span-10 bg-neutral-100 border  flex flex-row items-center px-3">
                <p className="text-xs">레슨 평가</p>
              </div>
            </div>
            <ScrollArea className="col-span-12  flex flex-col  bg-white h-[calc(100vh-250px)] ">
              <div className=" w-full flex flex-col ">
                {lessonResult.map((item: any, index: any) => {
                  return (
                    <div
                      key={item._id}
                      className=" col-span-12 grid grid-cols-12 gap-1"
                    >
                      <div className=" col-span-2 bg-white border flex flex-row items-center p-2">
                        <p className="text-xs">{item.onwer.username}</p>
                      </div>

                      <div className=" col-span-10 bg-white border flex flex-row items-center p-2 ">
                        <PerformEvaluation
                          lessonResult={item}
                          getLessonData={refetch}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
}
