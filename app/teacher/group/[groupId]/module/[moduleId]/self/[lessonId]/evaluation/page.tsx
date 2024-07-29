"use client";
import React from "react";
import { getLessonDetail } from "./_component/actions";
import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormLabelWrap from "@/components/formLabel";
import { DownloadIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { ScrollArea } from "@/components/ui/scroll-area";
import PerformEvaluation from "../_component/performEvaluation";
import ViewFeedBack from "../_component/viewfeedBack";
import FeedbackSend from "../_component/feedback";

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
  const [show, setShow] = React.useState(false);
  const [lesson, setlesson] = React.useState<any>();
  const [lessonResult, setlessonResult] = React.useState<any>([]);
  const session = useSession();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });
  //
  const getLessonData = async () => {
    console.log("session", session);

    let res = await getLessonDetail({
      lessonId: params.lessonId,
      groupId: params.groupId,
    });
    if (res.data) {
      let lesson = JSON.parse(res.data);
      console.log("lesson", lesson);
      setlesson(lesson);
    }
    if (res.lessonResult) {
      let lessonResult = JSON.parse(res.lessonResult);
      console.log("lessonResult", lessonResult);
      setlessonResult(lessonResult);
    }
  };
  React.useEffect(() => {
    getLessonData();
  }, []);
  //

  return (
    <div className="w-full flex flex-col items-stretch flex-1 bg-white ">
      <div className="flex-1 flex flex-col  w-full ">
        <div className="bg-white border flex-1 w-full flex flex-col items-start p-6">
          <p className="text-md font-bold">과제수행 평가</p>

          <div className="w-full grid grid-cols-12 gap-1 mt-3">
            <div className=" col-span-12 grid grid-cols-12 gap-1">
              <div className=" col-span-2 bg-neutral-100 border p-2">
                <p>교육 대상자</p>
              </div>

              <div className=" col-span-6 bg-neutral-100 border p-2">
                <p>과제수행</p>
              </div>
              <div className=" col-span-2 bg-neutral-100 border p-2">
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
                  <div className=" col-span-2 bg-white border p-2">
                    <p>{item.onwer.username}</p>
                  </div>
                  <div className=" col-span-6 bg-white border p-2">
                    {item.perform.downUrl ? (
                      <a
                        href={item.perform.downUrl}
                        download
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-row items-center justify-between flex-1 w-full "
                      >
                        <p className="flex-1 w-full truncate">
                          {item.perform.fileName}
                        </p>
                      </a>
                    ) : (
                      <p>미제출</p>
                    )}
                  </div>
                  <div className=" col-span-2 bg-white border p-2">
                    <PerformEvaluation
                      lessonResult={item}
                      getLessonData={getLessonData}
                    />
                  </div>
                  <div className=" col-span-2 bg-white border p-2">
                    {item.feedBack ? (
                      <div>
                        <ViewFeedBack
                          lessonResult={item}
                          getLessonData={getLessonData}
                        />
                      </div>
                    ) : (
                      <FeedbackSend
                        lessonResult={item}
                        getLessonData={getLessonData}
                        lessonId={params.lessonId}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
