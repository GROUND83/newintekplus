"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  detailWholeNotice,
  updateLiveSurvey,
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
import { XIcon } from "lucide-react";
import { toast } from "sonner";
import { sendToType } from "@/lib/common";
import { Textarea } from "@/components/ui/textarea";
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
      title: z.string().optional(),
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
  const [loading, setLoading] = React.useState(false);
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

    const formData = new FormData();
    formData.append("_id", params.wholeNoticeId);
    formData.append("title", values.title);
    // formData.append("surveys", JSON.stringify(values.surveys));

    // try {
    //   let res = await updateLiveSurvey(formData);
    //   console.log("resdta", res);
    //   if (res.data) {
    //     //
    //     toast.success("설문 수정에 성공하였습니다.");
    //     reload();
    //     // router.push("/admin/courseprofile");
    //   }
    // } catch (e) {
    //   //
    //   console.log("message", e);
    //   toast.error(e);
    // }
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
                          rows={10}
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
                      return (
                        <div
                          className="flex flex-row items-center gap-2 border px-3 py-2 rounded-md bg-neutral-100 col-span-12"
                          key={contentIndex}
                        >
                          <FormField
                            control={form.control}
                            name={`contents.${contentIndex}.file`}
                            render={({
                              field: { ref, name, onBlur, onChange },
                            }) => (
                              <FormItem className="flex flex-col flex-1">
                                <Input
                                  type="file"
                                  ref={ref}
                                  name={name}
                                  onBlur={onBlur}
                                  onChange={(e) =>
                                    onChange(e.target.files?.[0])
                                  }
                                />

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="button"
                            variant={"outline"}
                            onClick={() => contentsRemove(contentIndex)}
                          >
                            <XIcon className="size-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>

                  <div className=" col-span-12 flex flex-col items-end">
                    <Button
                      type="submit"
                      className="mt-6"

                      // disabled={editAvaliable.length > 0 ? true : false}
                    >
                      공지사항 수정
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