"use client";
import React from "react";
import { getLessonDetail, updateLessonPerform } from "./actions";
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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormLabelWrap from "@/components/formLabel";
import { DownloadIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [lessonResult, setlessonResult] = React.useState<any>();
  const session = useSession();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });
  //
  const getLessonData = async () => {
    console.log("session", session);
    if (session.data?.user?.email) {
      let res = await getLessonDetail({
        lessonId: params.lessonId,
        participantEmail: session.data?.user?.email,
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
        form.reset({
          downUrl: lessonResult.perform.downUrl || "", //레슨다운로드
          fileName: lessonResult.perform.fileName || "", // 레슨파일이름
          size: lessonResult.perform.size || undefined, // 레슨 파일 크기
          file: undefined,
        });
      }
    }
  };
  React.useEffect(() => {
    getLessonData();
  }, [params.lessonId, session.data]);
  //

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // values.lessonDirective.file.name = Buffer.from(
    //   values.lessonDirective.file.name,
    //   "ascii"
    // ).toString("utf8");
    console.log("values", values);
    const formData = new FormData();
    formData.append("lessonResultId", lessonResult._id);
    formData.append("file", values.file);

    try {
      let res = await updateLessonPerform(formData);
      let resdat = await JSON.parse(res);
      console.log("resdat", resdat);
      if (resdat.data) {
        //
        toast.success("레슨 생성에 성공하였습니다.");
        getLessonData();
        // router.push("/admin/courseprofile");
      }
    } catch (e) {
      //
      console.log("message", e);
      toast.error(e);
    }
  }
  return (
    <div className="w-full flex flex-col items-stretch flex-1  ">
      <ScrollArea className="flex flex-col  w-full gap-2 h-[calc(100vh-120px)]">
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
              <div className=" col-span-12 flex flex-col gap-2 border-b py-4">
                <p className="text-neutral-500">과제지시문</p>
                <p className="text-md  whitespace-pre-wrap">
                  {lesson.lessonDirective.contentdescription}
                </p>
                <div className="mt-3">
                  <Button asChild>
                    <a
                      href={lesson.lessonDirective.LessonDirectiveURL}
                      download={lesson.lessonDirective.contentfileName}
                      target="_blank"
                    >
                      {lesson.lessonDirective.contentfileName}
                    </a>
                  </Button>
                </div>
              </div>
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
            </div>
          )}
        </div>
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
                className="space-y-8 w-full"
              >
                <div className="col-span-12 grid grid-cols-12   gap-4  w-full">
                  <FormField
                    control={form.control}
                    name="file"
                    render={({ field: { ref, name, onBlur, onChange } }) => (
                      <FormItem className="flex flex-col   col-span-12">
                        <FormLabelWrap title="과제수행" required={false} />
                        {form.getValues("downUrl") ? (
                          <div className="flex flex-row items-center gap-3">
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
                          <div className="flex flex-row items-center gap-3">
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
                  <Button type="submit">과제 제출</Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
