"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
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
import { ko } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, ChevronsUpDown, CalendarIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import dayjs from "dayjs";
import { Textarea } from "@/components/ui/textarea";
import {
  evaluationMethod,
  lessonContentType,
  lessonTime,
  lessonType,
} from "@/lib/common";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { createLessonLibrary } from "./actions";
import FormLabelWrap from "@/components/formLabel";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";
import LessonContent from "@/models/lessonContents";
import React from "react";

const FormSchema = z.object({
  title: z.string({
    required_error: "레슨명을 입력하세요.",
  }),
  description: z.string().optional(),
  property: z.string({
    required_error: "학습형태를 입력하세요.",
  }),
  evaluation: z.string({
    required_error: "평가 방법을 입력하세요.",
  }),
  lessonHour: z.string({
    required_error: "교육시간을 입력하세요.",
  }),
  lessonDirective: z.object({
    type: z.string().optional(),
    LessonDirectiveURL: z.string().optional(),
    contentName: z.string().optional(),
    contentSize: z.string().optional(),
    file: z.instanceof(File).optional(),
    contentdescription: z.string().optional(),
  }),
  lessonContent: z.array(
    z.object({
      type: z.string(),
      link: z.string().optional(),
      lessonContendescription: z
        .string({
          required_error: "컨텐츠 자료설명을 입력하세요.",
        })
        .min(1, { message: "컨텐츠 자료설명을 입력하세요." }),
      file: z.instanceof(File).optional(),
    })
  ),
});
export default function Page() {
  const [contentType, setContentType] = React.useState("");
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });
  const {
    fields: lessonContentFields,
    append: lessonContentAppend,
    remove: lessonContentRemove,
  } = useFieldArray({
    control: form.control,
    name: "lessonContent",
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // values.lessonDirective.file.name = Buffer.from(
    //   values.lessonDirective.file.name,
    //   "ascii"
    // ).toString("utf8");
    console.log("values", values);
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("property", values.property);
    formData.append("evaluation", values.evaluation);
    formData.append("lessonHour", values.lessonHour);
    if (values.lessonDirective.file) {
      formData.append("file", values.lessonDirective.file);
    }
    formData.append(
      "contentdescription",
      values.lessonDirective.contentdescription
    );
    let newContentFile = [];
    for (let i = 0; i < values.lessonContent.length; i++) {
      if (values.lessonContent[i].file) {
        formData.append(`contentFile_${i}`, values.lessonContent[i].file);
        newContentFile.push({
          ...values.lessonContent[i],
          file: true,
        });
      } else {
        newContentFile.push({
          ...values.lessonContent[i],
          file: false,
        });
      }
    }
    formData.append("lessonContent", JSON.stringify(newContentFile));
    let res = await createLessonLibrary(formData);
    console.log(res);
    if (res.data) {
      let lesson = JSON.parse(res.data);
      console.log("up", lesson);
      toast.success("레슨 생성에 성공하였습니다.");
      router.push("/admin/lessonlibrary");
    } else {
      console.log("message", res.message);
      toast.error(res.message);
    }
  }
  return (
    <div className="w-full flex flex-col items-stretch flex-1  ">
      <div className="flex-1 flex flex-col  w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full bg-white "
          >
            <div className="w-full p-6">
              <div className="w-full flex flex-row items-center justify-between">
                <div>
                  <p className="text-xl">레슨 라이브러리 생성</p>
                  <p>레슨 라이브러리를 생성하세요.</p>
                </div>
                <div>
                  <Button type="submit" className="mt-6">
                    생성
                  </Button>
                </div>
              </div>
              <div className="w-full grid grid-cols-12 gap-5">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field: { value, onChange } }) => (
                    <FormItem className="flex flex-col col-span-12 gap-2">
                      <FormLabelWrap title="  레슨 명" required />

                      <Input
                        value={value || ""}
                        onChange={onChange}
                        placeholder="레슨명을 입력하세요."
                      />
                      {/* <FormDescription>필수 입력</FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="property"
                  render={({ field }) => (
                    <FormItem className="flex flex-col col-span-4 gap-2">
                      <FormLabelWrap title="학습형태" required />

                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="학습형태를 선택하세요." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {lessonType.map((lessontype, index) => {
                            return (
                              <SelectItem value={lessontype.value} key={index}>
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
                  name="evaluation"
                  render={({ field }) => (
                    <FormItem className="flex flex-col col-span-4 gap-2">
                      <FormLabelWrap title="평가방법" required />

                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="평가방법을 선택하세요." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {evaluationMethod.map((evalation, index) => {
                            return (
                              <SelectItem value={evalation.value} key={index}>
                                {evalation.value}
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
                  name="lessonHour"
                  render={({ field }) => (
                    <FormItem className="flex flex-col col-span-4 gap-2">
                      <FormLabelWrap title="교육시간" required />

                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="교육시간을 선택하세요." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {lessonTime.map((lessontime, index) => {
                            return (
                              <SelectItem value={lessontime.value} key={index}>
                                {lessontime.label}
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
                  name="description"
                  render={({ field }) => (
                    <FormItem className="flex flex-col col-span-6 gap-2">
                      <FormLabelWrap title="레슨 개요" required={false} />

                      <Textarea
                        placeholder="레슨 개요를 입력하세요."
                        className="resize-none"
                        {...field}
                        rows={8}
                      />

                      {/* <FormDescription>필수 입력</FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className=" col-span-6 flex flex-col  gap-4 ">
                  <FormField
                    control={form.control}
                    name="lessonDirective.contentdescription"
                    render={({ field: { value, onChange } }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabelWrap title="학습교안" required={false} />
                        <Textarea
                          placeholder="학습교안에 대한 설명을 입력하세요."
                          className="resize-none"
                          value={value}
                          onChange={onChange}
                          rows={5}
                        />

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lessonDirective.file"
                    render={({ field: { ref, name, onBlur, onChange } }) => (
                      <FormItem className="flex flex-col">
                        <Input
                          type="file"
                          ref={ref}
                          name={name}
                          onBlur={onBlur}
                          onChange={(e) => onChange(e.target.files?.[0])}
                        />

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className=" col-span-12 flex flex-col  gap-4 ">
                  <p>레슨 컨텐츠</p>
                  <div className="w-full grid grid-cols-12 gap-3">
                    <Select
                      onValueChange={(value) => setContentType(value)}
                      defaultValue={contentType}
                    >
                      <FormControl>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="컨텐츠 타입을 선택하세요." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {lessonContentType.map((item, index) => {
                          return (
                            <SelectItem value={item} key={index}>
                              {item}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      onClick={() =>
                        lessonContentAppend({
                          type: contentType,
                          link: "",
                          lessonContendescription: "",
                        })
                      }
                      disabled={!contentType}
                    >
                      + 자료 추가
                    </Button>
                  </div>
                  <div className="grid grid-cols-12 gap-3 w-full">
                    {lessonContentFields.map(
                      (lessonContent, lessonContentIndex) => {
                        return (
                          <div
                            className="flex flex-col gap-2 relative  col-span-4 border "
                            key={lessonContentIndex}
                          >
                            <div className=" flex flex-row items-center justify-between px-3 py-3 bg-neutral-100 border-b">
                              <p>{lessonContent.type}</p>
                              <Button
                                type="button"
                                size="sm"
                                variant={"outline"}
                                onClick={() =>
                                  lessonContentRemove(lessonContentIndex)
                                }
                              >
                                <XIcon className="size-4" />
                              </Button>
                            </div>
                            <div className="p-3 flex flex-col gap-3">
                              <FormField
                                control={form.control}
                                name={`lessonContent.${lessonContentIndex}.lessonContendescription`}
                                render={({ field: { value, onChange } }) => (
                                  <FormItem className="flex flex-col">
                                    <FormLabelWrap
                                      title="자료설명"
                                      required={true}
                                    />
                                    <Textarea
                                      className=" resize-none"
                                      rows={5}
                                      value={value || ""}
                                      onChange={onChange}
                                    />

                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`lessonContent.${lessonContentIndex}.link`}
                                render={({ field: { value, onChange } }) => (
                                  <FormItem className="flex flex-col">
                                    <FormLabelWrap
                                      title="관련 링크"
                                      required={false}
                                    />
                                    <Input
                                      value={value || ""}
                                      onChange={onChange}
                                    />

                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`lessonContent.${lessonContentIndex}.file`}
                                render={({
                                  field: { ref, name, onBlur, onChange },
                                }) => (
                                  <FormItem className="flex flex-col">
                                    <FormLabelWrap
                                      title="관련 파일"
                                      required={false}
                                    />
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
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
