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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import PerformEvaluation from "../_component/performEvaluation";
import ViewFeedBack from "../_component/viewfeedBack";
import FeedbackSend from "../_component/feedback";
import { useQuery } from "@tanstack/react-query";
import { updateLessonPerform } from "../actions";
import { Input } from "@/components/ui/input";
import { FormSubmitButton } from "@/components/commonUi/formUi";
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
  const [updateLoading, setUpdateLoading] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });
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
        if (lessonResult.newPerform) {
          form.reset({
            downUrl: lessonResult.newPerform.lessonPerformdownloadURL, //레슨다운로드
            fileName: lessonResult.newPerform.lessonPerformFileName, // 레슨파일이름
          });
        }
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
  async function onSubmit(values: z.infer<typeof FormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // values.lessonDirective.file.name = Buffer.from(
    //   values.lessonDirective.file.name,
    //   "ascii"
    // ).toString("utf8");
    setUpdateLoading(true);
    console.log("values", values);
    const formData = new FormData();
    formData.append("lessonResultId", lessonResult._id);
    formData.append("file", values.file);
    formData.append("groupId", params.groupId);
    formData.append("lessonId", params.lessonId);
    try {
      let res = await updateLessonPerform(formData);
      let resdat = await JSON.parse(res);
      console.log("resdat", resdat);
      if (resdat.data) {
        //
        toast.success("레슨 생성에 성공하였습니다.");
        refetch();
        // router.push("/admin/courseprofile");
      }
    } catch (e) {
      //
      console.log("message", e);
      toast.error(e);
    } finally {
      setUpdateLoading(false);
    }
  }
  return (
    <div className="bg-white border flex-1 w-full flex flex-col items-start ">
      <div className=" px-6 flex flex-row items-center w-full h-[50px] border-b">
        <p className="text-md font-bold">과제수행 평가</p>
      </div>
      <ScrollArea className="w-full flex flex-col  bg-white h-[calc(100vh-230px)] ">
        <div className="bg-white  flex-1 w-full flex flex-col items-start p-6">
          {lessonResult?.isLessonClose ? (
            <div>
              <p>과제수행</p>
              <p>레슨이 종료되었습니다.</p>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 w-full border p-3 rounded-sm"
              >
                <div className="col-span-12 grid grid-cols-12   gap-4  w-full">
                  <FormField
                    control={form.control}
                    name="file"
                    render={({ field: { ref, name, onBlur, onChange } }) => (
                      <FormItem className="flex flex-col   col-span-12">
                        <FormLabelWrap title="과제수행" required={false} />
                        {form.getValues("downUrl") ? (
                          <div className="flex flex-row items-center gap-3 mt-3">
                            {show ? (
                              <>
                                <FormControl>
                                  <Input
                                    type="file"
                                    ref={ref}
                                    name={name}
                                    onBlur={onBlur}
                                    className="bg-neutral-100"
                                    onChange={(e) =>
                                      onChange(e.target.files?.[0])
                                    }
                                  />
                                </FormControl>
                                <Button
                                  type="button"
                                  onClick={() => {
                                    form.setValue("file", undefined);
                                    setShow(false);
                                  }}
                                >
                                  취소
                                </Button>
                              </>
                            ) : (
                              <>
                                <a
                                  href={form.getValues("downUrl")}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className=" border px-3 py-2 text-primary border-primary flex-1 flex flex-row items-center gap-3  hover:bg-primary/30 transition-all"
                                >
                                  <DownloadIcon className="size-5" />
                                  <p className=" line-clamp-1">
                                    {form.getValues("fileName")}
                                  </p>
                                </a>
                                <Button
                                  type="button"
                                  onClick={() => setShow(true)}
                                >
                                  수정
                                </Button>
                              </>
                            )}
                          </div>
                        ) : (
                          <div className="flex flex-row items-center gap-3 mt-3">
                            <FormControl>
                              <Input
                                type="file"
                                ref={ref}
                                name={name}
                                onBlur={onBlur}
                                onChange={(e) => onChange(e.target.files?.[0])}
                              />
                            </FormControl>
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormSubmitButton
                    title="과제 제출"
                    form={form}
                    loading={updateLoading}
                    disabled={false}
                  />
                </div>
              </form>
            </Form>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
