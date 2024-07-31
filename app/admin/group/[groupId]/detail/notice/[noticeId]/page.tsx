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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FormLabelWrap from "@/components/formLabel";
import { Textarea } from "@/components/ui/textarea";
import { sendToType } from "@/lib/common";
import React from "react";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  deleteGroupNotice,
  detailGroupNotice,
  updateGroupNotice,
} from "./action";
import NoticeFileEdit from "./_component/noticeFileEdit";
import { ScrollArea } from "@/components/ui/scroll-area";
import DeleteModal from "@/components/commonUi/DeleteModal";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
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
  const router = useRouter();
  const session = useSession();
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  // const initailData = async () => {
  //   //
  //   let response = await detailGroupNotice(params.noticeId);
  //   if (response.data) {
  //     let result = JSON.parse(response.data);

  //     console.log("data", result);
  //     return result;
  //   }
  // };
  // const reload = async () => {
  //   setLoading(true);
  //   let data = await initailData();
  //   let newContents = [];
  //   for (const content of data.contents) {
  //     newContents.push({
  //       _id: content._id,
  //       contentdownloadURL: content.contentdownloadURL,
  //       contentName: content.contentName,
  //       contentSize: content.contentSize,
  //       file: undefined,
  //     });
  //   }
  //   console.log("newContents", newContents);
  //   form.reset(
  //     {
  //       _id: data._id,
  //       title: data.title,
  //       description: data.description,
  //       sendTo: data.sendTo,
  //       contents: newContents,
  //     },
  //     { keepDirtyValues: true }
  //   );
  //   setLoading(false);
  // };

  const fetchDataOptions = {
    noticeId: params.noticeId,
  };

  const {
    data: groupData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["groupNoticeDetail", fetchDataOptions],
    queryFn: async () => {
      let response = await detailGroupNotice(params.noticeId);

      let data = JSON.parse(response.data);

      let newContents = [];
      for (const content of data.contents) {
        newContents.push({
          _id: content._id,
          contentdownloadURL: content.contentdownloadURL,
          contentName: content.contentName,
          contentSize: content.contentSize,
          file: undefined,
        });
      }
      console.log("newContents", newContents);
      form.reset(
        {
          _id: data._id,
          title: data.title,
          description: data.description,
          sendTo: data.sendTo,
          contents: newContents,
        },
        { keepDirtyValues: true }
      );
      return data;
    },
    refetchOnMount: true,
  });
  // React.useEffect(() => {
  //   reload();
  // }, []);
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

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    console.log("values", values);
    const formData = new FormData();
    let newContentFile = [];
    for (let i = 0; i < values.contents.length; i++) {
      if (values.contents[i].file) {
        formData.append(`contents_${i}`, values.contents[i].file);
        newContentFile.push({
          ...values.contents[i],
          file: true,
        });
      } else {
        newContentFile.push({
          ...values.contents[i],
          file: false,
        });
      }
    }
    formData.append("contents", JSON.stringify(newContentFile));
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("sendTo", values.sendTo);
    formData.append("groupId", params.groupId);
    formData.append("user", session?.data?.user.email);
    formData.append("noticeId", values._id);

    try {
      let res = await updateGroupNotice(formData);
      if (res.data) {
        //
        toast.success("공지사항 수정에 성공하였습니다.");
        router.push(`/admin/group/${params.groupId}/detail/notice`);
      }
    } catch (e) {
      //
      console.log("message", JSON.parse(e));
      toast.error(e);
    }
  }

  //
  const clickDeleteGroup = async () => {
    setDeleteLoading(true);
    try {
      let res = await deleteGroupNotice(params.noticeId);
      if (res.data) {
        console.log("ok");
        toast.success("그룹 삭제에 성공하였습니다.");
        router.push(`/admin/group/${params.groupId}`);
      }
      if (res.message) {
        toast.error(res.message);
      }
    } catch (e) {
      toast.error(e);
    } finally {
      setDeleteOpen(false);
      setDeleteLoading(false);
    }
  };
  //
  return (
    <div className="w-full flex flex-col items-stretch flex-1  ">
      {isLoading ? (
        <ScrollArea className="  bg-white  w-full h-[calc(100vh-140px)] p-6  ">
          <div className="flex flex-col items-start gap-6">
            <Skeleton className="w-[100px] h-[30px] rounded-sm bg-neutral-200" />
            <Skeleton className="w-[100px] h-[30px] rounded-sm bg-neutral-200" />
            <Skeleton className="w-full h-[200px] rounded-sm bg-neutral-200" />
            <Skeleton className="w-full  h-[200px] rounded-sm bg-neutral-200" />
            <Skeleton className="w-full  h-[200px] rounded-sm bg-neutral-200" />
          </div>
        </ScrollArea>
      ) : (
        <div className="flex-1 flex flex-col  w-full ">
          <ScrollArea className="  bg-white  w-full h-[calc(100vh-140px)] ">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className=" w-full">
                <div className="w-full p-6 flex flex-col gap-3">
                  <div className="border-b  pb-6 flex flex-row items-center w-full  justify-between">
                    <div className="">
                      <p className="text-xl font-bold">그룹 공지사항 수정</p>
                      <p>그룹 공지사항을 수정하세요.</p>
                    </div>

                    <DeleteModal
                      title="공지사항 삭제"
                      desc="그공지사항 삭제 시 복구 되지 않습니다."
                      btnText="공지사항 삭제"
                      onClick={clickDeleteGroup}
                      disabled={deleteLoading}
                      deleteOpen={deleteOpen}
                      setDeleteOpen={setDeleteOpen}
                      deleteLoading={deleteLoading}
                    />
                  </div>
                  <div className="w-full grid grid-cols-12 gap-5">
                    <FormField
                      control={form.control}
                      name="sendTo"
                      render={({ field }) => (
                        <FormItem className="flex flex-col col-span-2 gap-2">
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
                              {sendToType.map((sendto, index) => {
                                return (
                                  <SelectItem value={sendto.value} key={index}>
                                    {sendto.label}
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
                            placeholder="공지사항 제목을 입력하세요."
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="flex flex-col col-span-12 gap-2">
                          <FormLabelWrap title="내용" required={false} />

                          <Textarea
                            placeholder="내용을 입력하세요."
                            className="resize-none"
                            {...field}
                            rows={12}
                          />

                          {/* <FormDescription>필수 입력</FormDescription> */}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="col-span-12 flex flex-col  gap-4 ">
                      <div>
                        <Button
                          type="button"
                          onClick={() => contentsAppend({})}
                        >
                          + 첨부파일 추가
                        </Button>
                      </div>
                      {contentsFields.map((content, contentIndex) => {
                        return (
                          <div
                            className="flex flex-row items-center gap-1  w-full"
                            key={contentIndex}
                          >
                            <NoticeFileEdit
                              form={form}
                              content={content}
                              contentIndex={contentIndex}
                              groupId={params.groupId}
                              disabled={false}
                              contentsRemove={contentsRemove}
                            />
                          </div>
                        );
                      })}
                    </div>

                    <div className=" col-span-12 flex flex-col items-end">
                      <Button type="submit" className="mt-6">
                        수정
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
