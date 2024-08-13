"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  detailWholeNotice,
  updateLiveSurvey,
  updateWholeNotice,
} from "../_components/table/actions";
import React from "react";
import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExclamationCircleIcon as FillExclamtion } from "@heroicons/react/24/solid";
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
import { Loader2, XIcon } from "lucide-react";
import { toast } from "sonner";
import { sendToType } from "@/lib/common";
import { Textarea } from "@/components/ui/textarea";
import { FileEdit } from "../_components/fileEdit";
import { UploadFileClient } from "@/lib/fileUploaderClient";
import { useRouter } from "next/navigation";
const FormSchema = z.object({
  sendTo: z.string({
    required_error: "대상을 선택하세요.",
  }),
  title: z.string({
    required_error: "제목을 입력하세요.",
  }),
  description: z.string().optional(),
  contents: z.array(
    z.object({
      _id: z.string().optional(),
      contentdownloadURL: z.string().optional(),
      contentName: z.string().optional(),
      file: z.instanceof(File).optional(),
    })
  ), // 요구 역량
});
export default function Page({
  params,
}: {
  params: { wholeNoticeId: string };
}) {
  //
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [updateloading, setUpdateLoading] = React.useState(false);
  const [editAvaliable, setEditAvaliable] = React.useState<any>([]);
  //
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });

  const {
    fields: contentsFields,
    append: contentsAppend,
    remove: contentsRemove,
  } = useFieldArray({
    control: form.control,
    name: "contents",
  });
  const initailData = async () => {
    //
    let response = await detailWholeNotice(params.wholeNoticeId);
    if (response.data) {
      let result = JSON.parse(response.data);

      return result;
    }
  };
  const reload = async () => {
    setLoading(true);
    let data = await initailData();
    console.log("data", data);
    form.reset(
      {
        sendTo: data.sendTo,
        title: data.title,
        description: data.description, // 요구 역량
        contents: data.contents,
      },
      { keepDirtyValues: true }
    );

    setLoading(false);
  };
  React.useEffect(() => {
    reload();
  }, []);

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    console.log("values", values);
    setUpdateLoading(true);
    try {
      const formData = new FormData();
      formData.append("_id", params.wholeNoticeId);
      formData.append("title", values.title);
      formData.append("sendTo", values.sendTo);
      formData.append("description", values.description);
      let newContent = [];
      // contents
      if (values.contents.length > 0) {
        for (const content of values.contents) {
          if (content.file) {
            const upload = await UploadFileClient({
              folderName: "noticeContents",
              file: content.file,
            });
            if (upload.location) {
              let contentdata = {
                isnew: true,
                contentdownloadURL: upload.location,
                contentName: content.file.name,
                contentSize: content.file.size,
              };
              newContent.push(contentdata);
            } else {
              toast.error("파일 업로드에 실폐하였습니다.");
              return;
            }
          } else {
            //
            newContent.push(content);
          }
        }
      }
      if (newContent.length > 0) {
        formData.append("newContent", JSON.stringify(newContent));
      }

      let res = await updateWholeNotice(formData);
      console.log("resdta", res);
      if (res.data) {
        //
        toast.success("공지사항 수정에 성공하였습니다.");

        router.push("/admin/wholenotice");
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
    <div className="w-full flex-1 flex ">
      <ScrollArea className=" w-full h-[calc(100vh-70px)] bg-white flex ">
        <div className=" w-full p-6 flex flex-col items-start">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 w-full"
            >
              <div className="w-full">
                <div>
                  <p className="text-xl font-bold">전체 공지사항 생성</p>

                  <div>
                    <p>전체 공지사항을 생성하세요.</p>
                  </div>
                </div>
                <div className="w-full grid grid-cols-12 gap-5 mt-3">
                  <FormField
                    control={form.control}
                    name="sendTo"
                    render={({ field }) => (
                      <FormItem className="flex flex-col col-span-4 gap-2">
                        <FormLabelWrap title="대상" required />

                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="대상을 선택하세요." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {sendToType.map((lessontype, index) => {
                              return (
                                <SelectItem
                                  value={lessontype.value}
                                  key={index}
                                >
                                  {lessontype.label}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field: { value, onChange } }) => (
                      <FormItem className="flex flex-col col-span-12 gap-2">
                        <FormLabelWrap title="제목" required />
                        <Input
                          value={value || ""}
                          onChange={onChange}
                          placeholder="제목을 입력하세요."
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field: { value, onChange } }) => (
                      <FormItem className="flex flex-col col-span-12 gap-2">
                        <FormLabelWrap title="내용" required />
                        <Textarea
                          rows={20}
                          value={value || ""}
                          onChange={onChange}
                          placeholder="내용을 입력하세요."
                          className=" resize-none"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="col-span-12  grid grid-cols-12 gap-3">
                    <div>
                      <Button onClick={() => contentsAppend({})} type="button">
                        + 첨부파일 추가
                      </Button>
                    </div>
                    {contentsFields.map((content, contentIndex) => {
                      console.log("content", content);
                      return (
                        <FileEdit
                          key={contentIndex}
                          form={form}
                          contentIndex={contentIndex}
                          content={content}
                          contentsRemove={contentsRemove}
                        />
                      );
                    })}
                  </div>

                  <div className=" col-span-12 flex flex-col items-end">
                    <Button
                      type="submit"
                      className="mt-6"
                      disabled={updateloading}

                      // disabled={editAvaliable.length > 0 ? true : false}
                    >
                      {updateloading ? (
                        <Loader2 className=" animate-spin" />
                      ) : (
                        <p>공지사항 수정</p>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </ScrollArea>
    </div>
  );
}
