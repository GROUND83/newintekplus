"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { UploadFileClient } from "@/lib/fileUploaderClient";
import { getSenderData } from "./table/actions";
import { createGroupNotice } from "../new/action";
import { FormSubmitButton } from "@/components/commonUi/formUi";

//
const FormSchema = z.object({
  title: z.string({
    required_error: "과정명을 입력하세요.",
  }),
  description: z.string(),
  sendTo: z.string(),
  mail: z.boolean(),
  contents: z.array(
    z.object({
      contentdownloadURL: z.string().optional(),
      contentName: z.string().optional(),
      contentSize: z.string().optional(),
      file: z.instanceof(File).optional(),
    })
  ),
});
export default function NewGroupNotivce() {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const session = useSession();
  const [sender, setSender] = React.useState<any>([]);
  const params = useParams<{ groupId: string }>();
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
    setLoading(true);
    try {
      console.log("values", values, session);
      const formData = new FormData();
      let newContentFile = [];

      //
      if (values.contents.length > 0) {
        let newContent = [];
        for await (const content of values.contents) {
          if (content.file) {
            let upload = await UploadFileClient({
              folderName: "groupNotice",
              file: content.file,
            });
            if (upload.location) {
              let contentdata = {
                contentdownloadURL: upload.location,
                contentName: content.file.name,
                contentSize: content.file.size,
                type: content.file.type,
              };
              newContent.push(contentdata);
            }
          }
        }
        if (newContent.length > 0) {
          formData.append("newContent", JSON.stringify(newContent));
        }
      }
      //
      let data = {
        title: values.title,
        description: values.description,
        sendTo: values.sendTo,
        groupId: params.groupId,
        mail: values.mail,
      };
      if (sender.length > 0) {
        let newEmail = [];
        for (const senderdata of sender) {
          newEmail.push(senderdata.email);
        }
        console.log("newEmail", newEmail);
        formData.append("newEmail", JSON.stringify(newEmail));
      }

      // formData.append("contents", JSON.stringify(newContentFile));
      formData.append("data", JSON.stringify(data));

      // formData.append("user", session?.data?.user.email);
      // formData.append("eduTarget", values.eduTarget);
      // formData.append("jobGroup", values.jobGroup);

      let res = await createGroupNotice(formData);
      if (res.data) {
        //
        toast.success("공지사항 생성에 성공하였습니다.");
        setOpen(false);
        form.reset();
        // router.push(`/admin/group/${params.groupId}/detail/notice`);
      }
    } catch (e) {
      //
      console.log("message", JSON.parse(e));
      toast.error(e);
    } finally {
      setLoading(false);
    }
  }
  const settingSender = async (sendTo: string) => {
    //
    let res = await getSenderData({ sendTo, groupId: params.groupId });
    if (res.data) {
      let data = JSON.parse(res.data);
      console.log("data", data);
      setSender(data);
    }
    //
  };
  React.useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (value.sendTo && value.mail) {
        console.log(value.sendTo, value.mail);
        settingSender(value.sendTo);
      }
      if (value.sendTo && !value.mail) {
        console.log(value.sendTo, value.mail);
        setSender([]);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="defaultoutline" type="button">
          +공지사항 생성
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[80vw]">
        <DialogHeader>
          <DialogTitle>그룹 공지사항 생성</DialogTitle>
          <DialogDescription>그룹 공지사항을 생성하세요.</DialogDescription>
        </DialogHeader>
        <div className=" flex flex-col  w-full ">
          <ScrollArea className="w-full flex  h-[800px]">
            <div className="p-3 flex-1 flex flex-col  w-full">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8 w-full"
                >
                  <Card className="w-full p-3">
                    <CardContent className="w-full grid grid-cols-12 gap-5">
                      <FormField
                        control={form.control}
                        name="sendTo"
                        render={({ field }) => (
                          <FormItem className="flex flex-col col-span-12 gap-2">
                            <FormLabelWrap title="대상" required />

                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value || ""}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="대상을 선택하세요." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {sendToType.map((sendto, index) => {
                                  return (
                                    <SelectItem
                                      value={sendto.value}
                                      key={index}
                                    >
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
                        name="mail"
                        render={({ field }) => (
                          <FormItem className="flex flex-col col-span-12 gap-3">
                            <div className="">
                              <FormLabelWrap title="메일발송" required />

                              <FormDescription className="text-xs">
                                전체 선택시 모두에게, 리더 선택시 리더에게,
                                참여자 선택시 참여자에게 발송됩니다.
                              </FormDescription>
                            </div>
                            <div className="flex flex-row items-center gap-2">
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              {field.value ? <p>발송</p> : <p>미발송</p>}
                            </div>
                          </FormItem>
                        )}
                      />
                      <div className="w-full col-span-12">
                        <p>
                          대상자
                          {sender.length > 0 ? `[${sender.length}명]` : null}
                        </p>

                        {sender.length > 0 ? (
                          <div className="flex flex-row items-center flex-wrap gap-2 mt-3">
                            {sender.map((sen: any, senIndex: any) => {
                              return (
                                <div
                                  key={sen._id}
                                  className=" px-2 py-1 bg-neutral-100 border"
                                >
                                  <p>
                                    {sen.email}[{sen.username}]
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="p-2 w-full bg-neutral-100 border mt-3">
                            <p>대상자가 없습니다.</p>
                          </div>
                        )}
                      </div>
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
                              className="flex flex-row items-center gap-2 border px-3 py-1 rounded-md bg-neutral-100 w-full"
                              key={contentIndex}
                            >
                              <FormField
                                control={form.control}
                                name={`contents.${contentIndex}.file`}
                                render={({
                                  field: { ref, name, onBlur, onChange },
                                }) => (
                                  <FormItem className="flex flex-col w-full">
                                    <div className="flex flex-row items-center gap-2">
                                      <Input
                                        type="file"
                                        ref={ref}
                                        name={name}
                                        onBlur={onBlur}
                                        onChange={(e) =>
                                          onChange(e.target.files?.[0])
                                        }
                                      />
                                      <div>
                                        <Button
                                          type="button"
                                          variant={"outline"}
                                          onClick={() =>
                                            contentsRemove(contentIndex)
                                          }
                                        >
                                          <XIcon className="size-4" />
                                        </Button>
                                      </div>
                                    </div>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          );
                        })}
                      </div>

                      <div className=" col-span-12 flex flex-row items-center justify-end gap-3">
                        <Button
                          type="button"
                          onClick={() => setOpen(false)}
                          variant="outline"
                        >
                          취소
                        </Button>
                        <FormSubmitButton
                          title="생성"
                          form={form}
                          loading={loading}
                          disabled={false}
                        />
                        {/* <Button type="submit">생성</Button> */}
                      </div>
                    </CardContent>
                  </Card>
                </form>
              </Form>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
