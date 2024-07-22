"use client";

import React from "react";
import { detailCourseProfile, updateCourseProfile } from "./actions";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { ExclamationCircleIcon as FillExclamtion } from "@heroicons/react/24/solid";
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
import { Download, XIcon } from "lucide-react";
import {
  competencyType,
  eduPlaceData,
  evaluationMethod,
  jobGroupType,
  lessonType,
} from "@/lib/common";

import { getJobSubGroup, getComPetency } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ModulesLessonEdit from "./_components/modulesLessonEdit";
import { ScrollArea } from "@/components/ui/scroll-area";
//
const FormSchema = z.object({
  _id: z.string(),
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
export default function Page({
  params,
}: {
  params: { courseProfileId: string };
}) {
  const router = useRouter();
  const [sublist, setSublist] = React.useState<any>([]);
  const [eduAbilityInputData, setEduAbilityInputData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [updateLoading, setUpdateLoading] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const [courseDirectiveshow, setcourseDirectiveShow] = React.useState(false);
  const [editAvaliable, setEditAvaliable] = React.useState([]);
  //
  const initailData = async () => {
    //
    let response = await detailCourseProfile(params.courseProfileId);
    if (response.data) {
      let result = JSON.parse(response.data);
      let group = JSON.parse(response.group);
      if (group.length > 0) {
        //
        setEditAvaliable(group);
      } else {
        setEditAvaliable([]);
      }
      console.log("data", result, group);
      return result;
    }
  };
  const reload = async () => {
    setLoading(true);
    let data = await initailData();
    // console.log("reloadData", data);
    // let res = await getJobSubGroup(data.jobGroup);
    // if (res.data) {
    //   let resdata = JSON.parse(res.data);
    //   console.log("getJobSubGroup", resdata.group);

    //   setSublist(resdata.group);
    // }
    form.reset(
      {
        _id: data._id,
        title: data.title,
        competency: data.competency,
        eduAbilitys: data.eduAbilitys,
        eduForm: data.eduForm,
        eduPlace: data.eduPlace,
        eduTarget: data.eduTarget,
        jobGroup: data.jobGroup,
        jobSubGroup: data.jobSubGroup,
        courseDirective: {
          LessonDirectiveURL: data.courseDirective?.LessonDirectiveURL
            ? data.courseDirective.LessonDirectiveURL
            : "",
          contentfileName: data.courseDirective?.contentfileName || "",
          file: undefined,
        },
        courseWholeDirective: {
          LessonDirectiveURL:
            data.courseWholeDirective?.LessonDirectiveURL || "",
          contentfileName: data.courseWholeDirective?.contentfileName || "",
          file: undefined,
        },
      },
      { keepDirtyValues: true }
    );
    await getjobSubGroup(data.jobGroup);
    form.setValue("jobSubGroup", data.jobSubGroup);
    // let res1 = await getComPetency(data.competency);
    // if (res1.data) {
    //   let data = JSON.parse(res1.data);
    //   console.log("res", data);
    //   if (data.competency === "직무 역량") {
    //     setEduAbilityInputData(data);
    //   } else if (data.competency === "전체") {
    //     setEduAbilityInputData(data);
    //   } else {
    //     setEduAbilityInputData(data[0].competencys);
    //   }
    // setSublist(data.group);
    setLoading(false);
  };

  React.useEffect(() => {
    reload();
  }, []);
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
  // const { fields, remove, append } = useFieldArray({
  //   control: form.control,
  //   name: `eduAbilitys.${nestIndex}.lessons`,
  // });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    console.log("values", values);

    const formData = new FormData();
    formData.append("_id", values._id);
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
      let res = await updateCourseProfile(formData);
      console.log("resdta", res);
      if (res.data) {
        //
        toast.success("코스프로파일 수정에 성공하였습니다.");
        router.push("/admin/courseprofile");
      }
    } catch (e) {
      //
      console.log("message", e);
      toast.error(e);
    }
  }

  const getjobSubGroup = async (jobGroup: string) => {
    // console.log("jobGroup", jobGroup);
    let res = await getJobSubGroup(jobGroup);
    if (res.data) {
      let data = JSON.parse(res.data);
      // console.log("jobGroup", data);
      if (jobGroup === "전체") {
        setSublist([{ _id: "12312sdfa1", groupName: "전체" }, ...data.group]);
      } else {
        setSublist([{ _id: "12312sdfa1", groupName: "전체" }, ...data.group]);
      }
    }
  };
  const getCompetency = async (competency: string) => {
    // console.log(competency);
    let res = await getComPetency(competency);
    if (res.data) {
      let data = JSON.parse(res.data);
      // console.log("전체", data);
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
      // console.log(value, name, type);
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
    <div className="w-full flex-1 flex ">
      <ScrollArea className="rounded-md border   w-full h-[calc(100vh-70px)] ">
        <div className=" w-full p-3 flex flex-col items-start">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 w-full"
            >
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-xl">코스프로파일 수정</CardTitle>
                  {editAvaliable.length > 0 ? (
                    <CardDescription>
                      <p className="text-red-500">
                        {editAvaliable.length}개의 그룹에 배정되었습니다.
                      </p>
                      <p className="flex flex-row items-center gap-2 text-red-500">
                        <FillExclamtion className="size-5 text-red-500" />
                        그룹에 배정된 코스프로파일인 수정이 불가 합니다.
                      </p>
                    </CardDescription>
                  ) : (
                    <CardDescription>
                      <p>코스프로파일을 수정하세요.</p>
                    </CardDescription>
                  )}
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
                            value={field.value || ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="교육형태를 선택하세요." />
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
                            value={field.value || ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="교육장소를 선택하세요." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {eduPlaceData.map((evalation, index) => {
                                return (
                                  <SelectItem
                                    value={evalation.value}
                                    key={index}
                                  >
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
                            onValueChange={(value) => {
                              if (value) {
                                form.setValue("jobGroup", value);
                              }
                            }}
                            value={field.value || ""}
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
                            onValueChange={(value) => {
                              if (value) {
                                form.setValue("jobSubGroup", value);
                              }
                            }}
                            value={field.value || ""}
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
                                      key={item._id}
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
                          onValueChange={(value) => {
                            if (value) {
                              form.setValue("competency", value);
                            }
                          }}
                          value={field.value || ""}
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
                            {eduAbilityInputData.map(
                              (eduAbilityInput, index) => {
                                // console.log("eduAbilityInput", eduAbilityInput);
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
                              }
                            )}
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

                  <div className="col-span-12 grid grid-cols-12   gap-4 ">
                    <FormField
                      control={form.control}
                      name="courseDirective.file"
                      render={({ field: { ref, name, onBlur, onChange } }) => (
                        <FormItem className="flex flex-col col-span-6 ">
                          <FormLabelWrap title="과정 안내서" required={false} />
                          {form.getValues(
                            "courseDirective.LessonDirectiveURL"
                          ) ? (
                            <div className="flex flex-row items-center gap-3">
                              {courseDirectiveshow ? (
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
                                      form.setValue(
                                        "courseDirective.file",
                                        undefined
                                      );
                                      setcourseDirectiveShow(false);
                                    }}
                                  >
                                    취소
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <a
                                    href={form.getValues(
                                      "courseDirective.LessonDirectiveURL"
                                    )}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className=" border px-3 py-2 text-primary border-primary flex-1 flex flex-row items-center gap-3 hover:bg-primary/30 transition-all"
                                  >
                                    <Download className="size-5" />
                                    <p className=" line-clamp-1">
                                      {form.getValues(
                                        "courseDirective.contentfileName"
                                      )}
                                    </p>
                                  </a>
                                  <Button
                                    type="button"
                                    onClick={() => setcourseDirectiveShow(true)}
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
                                  onChange={(e) =>
                                    onChange(e.target.files?.[0])
                                  }
                                />
                              </FormControl>
                            </div>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-12 grid grid-cols-12   gap-4 ">
                    <FormField
                      control={form.control}
                      name="courseWholeDirective.file"
                      render={({ field: { ref, name, onBlur, onChange } }) => (
                        <FormItem className="flex flex-col col-span-6">
                          <FormLabelWrap
                            title="교안 전체 파일"
                            required={false}
                          />
                          {form.getValues(
                            "courseWholeDirective.LessonDirectiveURL"
                          ) ? (
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
                                      form.setValue(
                                        "courseWholeDirective.file",
                                        undefined
                                      );
                                      setShow(false);
                                    }}
                                  >
                                    취소
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <a
                                    href={form.getValues(
                                      "courseWholeDirective.LessonDirectiveURL"
                                    )}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className=" border px-3 py-2 text-primary border-primary flex-1 flex flex-row items-center gap-3  hover:bg-primary/30 transition-all"
                                  >
                                    <Download className="size-5" />
                                    <p className=" line-clamp-1">
                                      {form.getValues(
                                        "courseWholeDirective.contentfileName"
                                      )}
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
                                  onChange={(e) =>
                                    onChange(e.target.files?.[0])
                                  }
                                />
                              </FormControl>
                            </div>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className=" col-span-12 flex flex-col items-end">
                    <Button
                      type="submit"
                      className="mt-6"
                      disabled={editAvaliable.length > 0 ? true : false}
                    >
                      코스프로파일 수정
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </Form>
          <ModulesLessonEdit
            courseProfileId={params.courseProfileId}
            disabled={editAvaliable.length > 0 ? true : false}
            // disabled={false}
          />
        </div>
      </ScrollArea>
    </div>
  );
}
