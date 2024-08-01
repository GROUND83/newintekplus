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
import { useQueries, useQuery } from "@tanstack/react-query";
import DownLoadButton from "@/components/commonUi/downloadButton";
import ContentWrap from "@/components/commonUi/contentWrap";
import LessonInfoPage from "@/components/commonUi/lesson/lessonInfoPage";

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
  // const [show, setShow] = React.useState(false);
  // // const [lesson, setlesson] = React.useState<any>();
  // // const [lessonResult, setlessonResult] = React.useState<any>([]);
  // const session = useSession();

  // //
  // const fetchDataOptions = {
  //   lessonId: params.lessonId,
  //   groupId: params.groupId,
  // };
  // const {
  //   data: lesson,
  //   isLoading,
  //   isError,
  //   refetch,
  // } = useQuery({
  //   //
  //   queryKey: ["lessonInfo", fetchDataOptions],
  //   queryFn: async () => {
  //     let res = await getLessonDetail(fetchDataOptions);
  //     if (res.data) {
  //       let lesson = JSON.parse(res.data);
  //       console.log("lesson", lesson);
  //       return lesson;
  //     }
  //   },
  // });

  // if (isLoading) {
  //   return (
  //     <div
  //       className={`w-full  h-[calc(100vh-170px)]  flex flex-col items-center justify-center`}
  //     >
  //       <Loader2 className=" animate-spin size-8 text-primary" />
  //     </div>
  //   );
  // }
  return <LessonInfoPage />;
}
