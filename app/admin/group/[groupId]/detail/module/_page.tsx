"use client";
import React from "react";
import { getLessonDetail } from "./[moduleId]/live/[lessonId]/actions";
import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormLabelWrap from "@/components/formLabel";
import { DownloadIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { ScrollArea } from "@/components/ui/scroll-area";
import PerformEvaluation from "@/components/commonUi/lesson/component/performEvaluation";

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
        <div className="bg-white  flex-1 w-full flex flex-col items-start p-6">
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
                    <Button asChild>
                      <a
                        href={lesson.lessonDirective?.LessonDirectiveURL}
                        download={lesson.lessonDirective?.contentfileName}
                        target="_blank"
                      >
                        {lesson.lessonDirective?.contentfileName}
                      </a>
                    </Button>
                  </div>
                </div>
              )}
              {lesson?.lessonContents.length > 0 && (
                <div className=" col-span-12 flex flex-col gap-2 pb-2">
                  <p className="text-neutral-500">레슨 컨텐츠</p>
                  {lesson?.lessonContents?.length > 0 ? (
                    <div className="grid w-full grid-cols-2 gap-3 ">
                      {lesson?.lessonContents.map((item: any, index: any) => {
                        return (
                          <div key={index} className="col-span-1 p-3 ">
                            <div className="flex flex-col items-start w-full p-3 bg-white border rounded-lg">
                              <p className="bg-primary text-white px-2 py-1">
                                {item.type}
                              </p>

                              <div className="flex flex-col items-start w-full mt-3 gap-3">
                                {item.lessonContendescription && (
                                  <p className="w-full truncate whitespace-pre-wrap">
                                    {item.lessonContendescription}
                                  </p>
                                )}
                                {item.link && (
                                  <p className="w-full truncate whitespace-pre-wrap">
                                    {item.link}
                                  </p>
                                )}
                                {item.lessonContentdownloadURL && (
                                  <Button asChild size="sm">
                                    <a
                                      href={item.lessonContentdownloadURL}
                                      download={item.lessonContenFileName}
                                      target="_blank"
                                    >
                                      {item.lessonContenFileName}
                                    </a>
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
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
          )}
        </div>
        <div className="bg-white  flex-1 w-full flex flex-col items-start p-6 border-t">
          <p className="text-md font-bold">참여자</p>
          <ScrollArea className="w-full flex h-[400px]">
            <div className="w-full grid grid-cols-12 gap-1 mt-3">
              <div className=" col-span-12 grid grid-cols-12 gap-1">
                <div className=" col-span-2 bg-neutral-100 border p-2">
                  <p>교육 대상자</p>
                </div>

                <div className=" col-span-10 bg-neutral-100 border p-2">
                  <p>레슨 평가</p>
                </div>
              </div>
              {lessonResult.map((item: any, index: any) => {
                return (
                  <div
                    key={item._id}
                    className=" col-span-12 grid grid-cols-12 gap-1"
                  >
                    <div className=" col-span-2 bg-white border p-2 flex flex-col items-start justify-center">
                      <p>{item.onwer.username}</p>
                    </div>
                    {/* <div className=" col-span-6 bg-white border p-2">
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
                    </div> */}
                    <div className=" col-span-10 bg-white border p-2">
                      <PerformEvaluation
                        lessonResult={item}
                        getLessonData={getLessonData}
                      />
                    </div>
                    {/* <div className=" col-span-2 bg-white border p-2">
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
                        />
                      )}
                    </div> */}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
