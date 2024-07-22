"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FormLabelWrap from "@/components/formLabel";
import { Textarea } from "@/components/ui/textarea";
import { XIcon } from "lucide-react";
import {
  competencyType,
  eduPlaceData,
  evaluationMethod,
  jobGroupType,
  lessonType,
  sendToType,
} from "@/lib/common";
import React from "react";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { detailGroupNotice, updateGroupNotice } from "./action";
import NoticeFileEdit from "./_component/noticeFileEdit";
import dayjs from "dayjs";
const FormSchema = z.object({
  _id: z.string(),
  title: z.string({
    required_error: "과정명을 입력하세요.",
  }),
  description: z.string(),
  sendTo: z.string(),
  contents: z
    .array(
      z.object({
        _id: z.string().optional(),
        contentdownloadURL: z.string().optional(),
        contentName: z.string().optional(),
        contentSize: z.number().optional(),
        file: z.instanceof(File).optional(),
      })
    )
    .optional(),
});
export default function Page({
  params,
}: {
  params: { groupId: string; noticeId: string };
}) {
  const [loading, setLoading] = React.useState(false);
  const [notice, setNotice] = React.useState<any>();
  const router = useRouter();
  const session = useSession();

  const initailData = async () => {
    //
    let response = await detailGroupNotice(params.noticeId);
    if (response.data) {
      let result = JSON.parse(response.data);

      console.log("data", result);
      return result;
    }
  };
  const reload = async () => {
    setLoading(true);
    let data = await initailData();
    setNotice(data);

    setLoading(false);
  };

  React.useEffect(() => {
    reload();
  }, []);

  return (
    <div className="w-full flex flex-col items-stretch flex-1  ">
      {notice && (
        <div className="p-3 flex-1 flex flex-col  w-full ">
          <div className="border bg-white p-6 flex flex-col gap-3">
            <div className="border-b w-full py-3">
              <p>
                {notice.sendTo === "all"
                  ? "전체"
                  : notice.sendTo === "teacher"
                  ? "리더"
                  : "참여자"}
              </p>
              <p className="text-lg">{notice.title}</p>
              <p>{dayjs(notice.createdAt).format("YYYY-MM-DD")}</p>
            </div>
            <div className="border-b w-full py-3 min-h-[400px]">
              <p className=" whitespace-pre-wrap">{notice.description}</p>
            </div>
            <div className="flex flex-col gap-3">
              <p>첨부파일</p>
              {notice.contents.map((content: any, index: any) => {
                return (
                  <div key={content._id}>
                    <Button asChild size="sm">
                      <a
                        href={content.contentdownloadURL}
                        download={content.contentName}
                        target="_blank"
                      >
                        {content.contentName}
                      </a>
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
