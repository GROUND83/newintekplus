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
} from "@/lib/common";
import React from "react";
import { getJobSubGroup, getComPetency, createCourseProfile } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
const FormSchema = z.object({
  title: z.string({
    required_error: "과정명을 입력하세요.",
  }),
  eduTarget: z.string().optional(), //교육 목표
  eduForm: z.string({
    required_error: "교육형태를 입력하세요.",
  }), //교육형태
  eduPlace: z.string({
    required_error: "교육장소을 입력하세요.",
  }),
  jobGroup: z.string({
    required_error: "대상직군을 입력하세요.",
  }), // 대상직군
  jobSubGroup: z.string({
    required_error: "대상그룹을 입력하세요.",
  }), // 대상그룹
  competency: z.string({
    required_error: "역량구분을 입력하세요.",
  }), // 대상그룹
  eduAbilitys: z.array(
    z.object({
      _id: z.string().optional(),
      title: z.string().optional(),
      type: z.string().optional(),
    })
  ), // 요구 역량
  courseDirective: z.object({
    type: z.string().optional(),
    LessonDirectiveURL: z.string().optional(),
    contentName: z.string().optional(),
    contentSize: z.string().optional(),
    contentfileName: z.string().optional(),
    file: z.instanceof(File).optional(),
    contentdescription: z.string().optional(),
  }),
  courseWholeDirective: z.object({
    type: z.string().optional(),
    LessonDirectiveURL: z.string().optional(),
    contentName: z.string().optional(),
    contentSize: z.string().optional(),
    contentfileName: z.string().optional(),
    file: z.instanceof(File).optional(),
    contentdescription: z.string().optional(),
  }),
});
export default function Page() {
  const router = useRouter();
  const [sublist, setSublist] = React.useState<any>([]);
  const [eduAbilityInputData, setEduAbilityInputData] = React.useState([]); // 인풋데이터
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });

  const {
    fields: eduAbilityFields,
    append: eduAbilityAppend,
    remove: eduAbilityRemove,
  } = useFieldArray({
    control: form.control,
    name: "eduAbilitys",
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
    formData.append("eduTarget", values.eduTarget);
    formData.append("jobGroup", values.jobGroup);
    formData.append("jobSubGroup", values.jobSubGroup);
    formData.append("eduPlace", values.eduPlace);
    formData.append("eduForm", values.eduForm);
    formData.append("eduAbility", JSON.stringify(values.eduAbilitys));
    formData.append("competency", values.competency);
    if (values.courseDirective.file) {
      //
      formData.append("courseDirective_file", values.courseDirective.file);
    }
    if (values.courseWholeDirective.file) {
      formData.append(
        "courseWholeDirective_file",
        values.courseWholeDirective.file
      );
      //
    }

    try {
      let res = await createCourseProfile(formData);
      if (res.data) {
        //
        toast.success("레슨 생성에 성공하였습니다.");
        router.push("/admin/courseprofile");
      }
    } catch (e) {
      //
      console.log("message", e);
      toast.error(e);
    }
    // let res = await createLessonLibrary(formData);
    // if (res.data) {
    //   let lesson = JSON.parse(res.data);
    //   console.log("up", lesson);
    //   toast.success("레슨 생성에 성공하였습니다.");
    //   router.push("/admin/lessonlibrary");
    // } else {
    //   console.log("message", res.message);
    //   toast.error(res.message);
    // }
  }
  const getjobSubGroup = async (jobGroup: string) => {
    //

    let res = await getJobSubGroup(jobGroup);
    if (res.data) {
      let data = JSON.parse(res.data);
      console.log("res", data);
      setSublist(data.group);
    }
  };
  const getCompetency = async (competency: string) => {
    //

    let res = await getComPetency(competency);
    if (res.data) {
      let data = JSON.parse(res.data);
      console.log("res", data);
      if (competency === "직무 역량") {
        setEduAbilityInputData(data);
      } else if (competency === "전체") {
        setEduAbilityInputData(data);
      } else {
        setEduAbilityInputData(data[0].competencys);
      }
      // setSublist(data.group);
    }
  };
  React.useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      console.log(value, name, type);
      if (name === "jobGroup") {
        //
        getjobSubGroup(value.jobGroup);
      }
      if (name === "competency") {
        //
        getCompetency(value.competency);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);
  return (
    <div className="w-full flex flex-col items-stretch flex-1  ">
      <div className="p-3 flex-1 flex flex-col  w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full"
          >
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-xl">코스프로파일 생성</CardTitle>
                <CardDescription>코스프로파일을 생성하세요.</CardDescription>
              </CardHeader>
              <CardContent className="w-full grid grid-cols-12 gap-5">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field: { value, onChange } }) => (
                    <FormItem className="flex flex-col col-span-12 gap-2">
                      <FormLabelWrap title="과정명" required />
                      <Input
                        value={value || ""}
                        onChange={onChange}
                        placeholder="과정명을 입력하세요."
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eduTarget"
                  render={({ field }) => (
                    <FormItem className="flex flex-col col-span-6 gap-2">
                      <FormLabelWrap title="교육 목표" required={false} />

                      <Textarea
                        placeholder="교육목표를 입력하세요."
                        className="resize-none"
                        {...field}
                        rows={7}
                      />

                      {/* <FormDescription>필수 입력</FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="col-span-6 grid grid-cols-6 gap-2">
                  <FormField
                    control={form.control}
                    name="eduForm"
                    render={({ field }) => (
                      <FormItem className="flex flex-col col-span-3 gap-2">
                        <FormLabelWrap title="교육형태" required />

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
                                <SelectItem
                                  value={lessontype.value}
                                  key={index}
                                >
                                  {lessontype.value}
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
                    name="eduPlace"
                    render={({ field }) => (
                      <FormItem className="flex flex-col col-span-3 gap-2">
                        <FormLabelWrap title="교육장소" required />

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
                            {eduPlaceData.map((evalation, index) => {
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
                    name="jobGroup"
                    render={({ field }) => (
                      <FormItem className="flex flex-col col-span-3 gap-2">
                        <FormLabelWrap title="대상 직군" required />

                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="대상 직군을 선택하세요." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {jobGroupType.map((job, index) => {
                              return (
                                <SelectItem value={job} key={index}>
                                  {job}
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
                    name="jobSubGroup"
                    render={({ field }) => (
                      <FormItem className="flex flex-col col-span-3 gap-2">
                        <FormLabelWrap title="대상 그룹" required />

                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="먼저 대상직군을 선택하세요." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {sublist.length > 0 &&
                              sublist.map((item: any, index: any) => {
                                return (
                                  <SelectItem
                                    key={index}
                                    value={item.groupName}
                                  >
                                    {item.groupName}
                                  </SelectItem>
                                );
                              })}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="competency"
                  render={({ field }) => (
                    <FormItem className="flex flex-col col-span-2 gap-2">
                      <FormLabelWrap title="역량 구분" required />

                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="역량 구분을 선택하세요." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {competencyType.map((job, index) => {
                            return (
                              <SelectItem value={job} key={index}>
                                {job}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className=" col-span-10  grid grid-cols-12 gap-3">
                  <div className=" col-span-12">
                    <FormLabelWrap title="요구역량" required />
                  </div>
                  <div className="flex flex-row items-start gap-2 col-span-12 ">
                    <div className=" col-span-4">
                      <Select
                        onValueChange={(value) => {
                          console.log("value", value);
                          let findData = eduAbilityInputData.filter(
                            (item) => item._id === value
                          );
                          eduAbilityAppend({
                            _id: findData[0]._id,
                            type: findData[0].type,
                            title: findData[0].title,
                          });
                        }}
                        value={""}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="역량구분 먼저 선택하세요." />
                        </SelectTrigger>

                        <SelectContent className=" w-full">
                          {eduAbilityInputData.map((eduAbilityInput, index) => {
                            console.log("eduAbilityInput", eduAbilityInput);
                            return (
                              <SelectItem
                                value={eduAbilityInput._id}
                                key={eduAbilityInput._id}
                              >
                                {eduAbilityInput.type === "common"
                                  ? "공통"
                                  : eduAbilityInput.type === "level"
                                  ? "직무"
                                  : "리더십"}
                                -{eduAbilityInput.title}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-8 flex flex-row  items-center gap-2 flex-wrap ">
                      {eduAbilityFields.map(
                        (eduAbilityField, eduAbilityFieldIndex) => {
                          return (
                            <div
                              className="flex flex-row items-center gap-2 border px-3 py-1 rounded-md bg-neutral-100"
                              key={eduAbilityFieldIndex}
                            >
                              <p>
                                {eduAbilityField.type === "common"
                                  ? "공통"
                                  : eduAbilityField.type === "level"
                                  ? "직무"
                                  : "리더십"}
                                -{eduAbilityField.title}
                              </p>
                              <Button
                                type="button"
                                size="xs"
                                variant={"outline"}
                                onClick={() =>
                                  eduAbilityRemove(eduAbilityFieldIndex)
                                }
                              >
                                <XIcon className="size-4" />
                              </Button>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-span-6 flex flex-col  gap-4 ">
                  <FormField
                    control={form.control}
                    name="courseDirective.file"
                    render={({ field: { ref, name, onBlur, onChange } }) => (
                      <FormItem className="flex flex-col">
                        <FormLabelWrap title="과정 안내서" required={false} />
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
                <div className="col-span-6 flex flex-col  gap-4 ">
                  <FormField
                    control={form.control}
                    name="courseWholeDirective.file"
                    render={({ field: { ref, name, onBlur, onChange } }) => (
                      <FormItem className="flex flex-col">
                        <FormLabelWrap
                          title="교안 전체 파일"
                          required={false}
                        />
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
                <div className=" col-span-12 flex flex-col items-end">
                  <Button type="submit" className="mt-6">
                    생성
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}
