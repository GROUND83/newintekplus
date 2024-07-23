"use client";

import React, { use } from "react";
import { z } from "zod";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Check,
  ChevronsUpDown,
  CalendarIcon,
  CircleMinus,
  CirclePlus,
  CircleCheck,
  Loader2,
  SquareArrowOutUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import dayjs from "dayjs";
import FormLabelWrap from "@/components/formLabel";

import Participant from "@/models/participant";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getSelectInitData } from "../new/actions";
import {
  detailGroup,
  getLiveSurvey,
  updateGroupStatus,
  updateLiveSurvey,
} from "./_components/actions";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

import { toast } from "sonner";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
const FormSchema = z.object({
  liveSurvey: z.object({
    _id: z.string(),
    title: z.string(),
  }),
});
export default function Page({ params }: { params: { groupId: string } }) {
  const [readerArray, setReaderArray] = React.useState<any>([]);
  const [courseProfileArray, setCourseProfile] = React.useState<any>([]);
  const [paricipantArray, setParticipant] = React.useState<any>([]);
  const [courseProfileData, setCourseProfileData] = React.useState<any>();
  // const [groupData, setGroupData] = React.useState<any>();
  const [liveSurveyData, setLiveSurveyData] = React.useState<any>([]);
  const [loading, setLoading] = React.useState<any>(false);
  const [statusloading, setStatusLoading] = React.useState<any>(false);

  const fetchDataOptions = {
    groupId: params.groupId,
  };

  const {
    data: groupData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["groupDetail", fetchDataOptions],
    queryFn: async () => {
      let readers = await getSelectInitData();
      if (readers.data) {
        let reader = JSON.parse(readers.data.reader);
        let participants = JSON.parse(readers.data.participants);
        let courseProfile = JSON.parse(readers.data.courseProfile);
        console.log("reader", reader, participants, courseProfile);
        setReaderArray(reader);
        setCourseProfile(courseProfile);
        setParticipant(participants);
      }
      let data = await initailData();
      let newLiveSurvey = [];
      let liveSurvey = await getLiveSurvey({
        groupId: fetchDataOptions.groupId,
      });

      if (liveSurvey.data) {
        //
        newLiveSurvey = await JSON.parse(liveSurvey.data);
        console.log("newLiveSurvey", newLiveSurvey);
        setLiveSurveyData(newLiveSurvey);
      }
      //

      // setGroupData(data);
      console.log("data.liveSurvey", data.liveSurvey);
      form.reset(
        {
          liveSurvey: {
            _id: data.liveSurvey?._id || "",
            title: data.liveSurvey?.title || "",
          },
        }
        //   { keepDirtyValues: true }
      );
      return data;
    },
    // staleTime: 6000, // 1분
    refetchOnMount: true,
  });
  //
  // const reload = async () => {
  //   // setLoading(true);
  //   let readers = await getSelectInitData();
  //   if (readers.data) {
  //     let reader = JSON.parse(readers.data.reader);
  //     let participants = JSON.parse(readers.data.participants);
  //     let courseProfile = JSON.parse(readers.data.courseProfile);
  //     console.log("reader", reader, participants, courseProfile);
  //     setReaderArray(reader);
  //     setCourseProfile(courseProfile);
  //     setParticipant(participants);
  //   }
  //   let data = await initailData();

  //   //   코스프로파일 에서 eduFrom이 집합교육이면
  //   //    linveSurvey 세팅
  //   let modulesdata = [];
  //   let newLiveSurvey = [];
  //   let liveSurvey = await getLiveSurvey({
  //     groupId: params.groupId,
  //   });

  //   if (liveSurvey.data) {
  //     //
  //     newLiveSurvey = await JSON.parse(liveSurvey.data);
  //     console.log("newLiveSurvey", newLiveSurvey);
  //     setLiveSurveyData(newLiveSurvey);
  //   }
  //   //

  //   setGroupData(data);
  //   console.log("data.liveSurvey", data.liveSurvey);
  //   form.reset(
  //     {
  //       liveSurvey: {
  //         _id: data.liveSurvey?._id || "",
  //         title: data.liveSurvey?.title || "",
  //       },
  //     }
  //     //   { keepDirtyValues: true }
  //   );
  // };

  const initailData = async () => {
    //
    let response = await detailGroup(params.groupId);
    if (response.data) {
      let result = JSON.parse(response.data);
      console.log("data", result);
      return result;
    }
  };
  // React.useEffect(() => {
  //   // getSelectData();
  //   reload();
  // }, []);

  //
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      liveSurvey: { _id: "", title: "" },
    },
  });

  React.useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      console.log(value, name, type);
      if (name === "liveSurvey") {
        console.log("result", value);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch, courseProfileArray]);

  const changeStatus = async () => {
    let groupId = params.groupId;
    setStatusLoading(true);
    try {
      let res = await updateGroupStatus({ groupId: groupId });
      if (res.data) {
        toast.success("그룹개설이 완료 되었습니다.");
        refetch();
      }
    } catch (e) {
      toast.error(e);
    } finally {
      setStatusLoading(false);
    }

    //
  };
  async function onSubmit(values: z.infer<typeof FormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    setLoading(true);
    const formData = new FormData();
    formData.append("surveyId", values.liveSurvey._id);
    formData.append("groupId", params.groupId);

    // 코스프로파일에 모듈 .레슨이 있는지
    // 레슨에 집합교육이면 라이브서베이 설정 되었는지.
    // 코스프로 파일 선택 하면 eduForm 집학교육 or SOJT 확인 후 설문 배정
    //
    try {
      let res = await updateLiveSurvey({
        groupId: params.groupId,
        surveyId: values.liveSurvey._id,
      });
      if (res.data) {
        let resData = JSON.parse(res.data);
        console.log(resData);
        toast.success("설문 설정에 성공하였습니다.");
        refetch();
      }
    } catch (e) {
      toast.error(e);
    } finally {
      setLoading(false);
    }
  }
  if (isLoading) {
    return (
      <div className="w-full  h-[calc(100vh-70px)]  flex flex-col items-center justify-center">
        <Loader2 className=" animate-spin size-8 text-primary" />
      </div>
    );
  }
  return (
    <div className="w-full flex flex-col   ">
      <ScrollArea className="w-full flex  flex-col gap-3 max-h-[calc(100vh-70px)]">
        <div className="w-full flex flex-col ">
          <div className="w-full flex flex-row items-center justify-between p-6 bg-white  border-b ">
            <div className="flex flex-col items-start ">
              <div className="flex flex-row gap-2">
                <p className="text-lg font-bold">그룹상태 변경</p>
                <Badge>{groupData?.status}</Badge>
              </div>
              <p className="w-[500px] text-neutral-500 mt-3">
                그룹의 상태를 변경 합니다.
              </p>
              <p className="w-[500px] text-neutral-500">
                개설 완료 변경시 그룹 데이터는{" "}
                <span className="text-red-500">변경 불가</span> 합니다.
              </p>
              <p className="w-[500px] text-neutral-500">
                <span className="text-red-500">개설 완료 시 </span>리더,
                교육생에게 노출 됩니다.
              </p>
            </div>
            <div className=" ">
              {groupData?.status === "개설중" ? (
                <Button onClick={() => changeStatus()}>
                  {statusloading ? (
                    <Loader2 className=" animate-spin" />
                  ) : (
                    <span>개설상태 변경</span>
                  )}
                </Button>
              ) : (
                <Button asChild>
                  <Link
                    href={`/admin/group/${params.groupId}/detail/notice`}
                    className="flex flex-row gap-2"
                  >
                    <SquareArrowOutUpRight className="size-4" /> 그룹 이동
                  </Link>
                </Button>
              )}
            </div>
          </div>

          <div className="w-full flex flex-col items-start  p-6 bg-white  border-b ">
            <div className=" w-full flex flex-row items-center justify-between">
              <p className="text-lg font-bold">그룹 정보</p>
              <div className=" ">
                {groupData?.status === "개설중" ? (
                  <Button>그룹 수정</Button>
                ) : (
                  <Button disabled>그룹 수정 불가</Button>
                )}
              </div>
            </div>

            <div className="w-full grid grid-cols-12 gap-3">
              <div className=" col-span-6 pt-4 pb-6 border-b flex flex-col gap-2">
                <p className="text-neutral-500">그룹명</p>
                <p className="">{groupData?.name}</p>
              </div>
              <div className="col-span-6 pt-4 pb-6 border-b flex flex-col gap-2">
                <p className="text-neutral-500">교육기간</p>
                <p>
                  {dayjs(groupData?.starDate).format("YYYY-MM-DD")} ~{" "}
                  {dayjs(groupData?.endDate).format("YYYY-MM-DD")}
                  {/* {dayjs(groupData?.endDate).diff(
                    dayjs(groupData?.starDate),
                    "days"
                  ) / 7} */}
                </p>
              </div>
              <div className=" col-span-6  pt-4 pb-6 border-b flex flex-col gap-2">
                <p className="text-neutral-500">리더</p>
                <p>
                  {groupData?.teacher.username} - {groupData?.teacher.email}
                </p>
              </div>
              <div className=" col-span-6  pt-4 pb-6 border-b flex flex-col gap-2">
                <p className="text-neutral-500">
                  참여자 {groupData?.participants.length}명
                </p>
                <ScrollArea className="w-full flex flex-col max-h-[200px] ">
                  <div className="flex flex-col w-full ">
                    {groupData?.participants.map((item: any, index: any) => {
                      return (
                        <div
                          key={item._id}
                          className="py-2 w-full border-b px-3 flex flex-row items-center gap-2"
                        >
                          <p className="w-[50px] border-r text-center">
                            {item.jobPosition}
                          </p>
                          <p className="w-[70px] border-r text-center">
                            {item.username}
                          </p>
                          <p className="pl-2">{item.email}</p>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
              <div className=" col-span-12 pt-4 pb-6 flex flex-col gap-2">
                <p className="text-neutral-500">코스프로파일</p>

                <Link
                  href={`/admin/courseprofile/${groupData?.courseProfile._id}`}
                  className="flex flex-row items-center gap-2 hover:text-primary"
                >
                  <SquareArrowOutUpRight className="size-4" />
                  <p>
                    {groupData?.courseProfile.eduForm} -
                    {groupData?.courseProfile.title}
                  </p>
                </Link>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col items-start  p-6 bg-white pb-12">
            <div className="flex flex-col items-start gap-2">
              <p className="text-lg font-bold">평가/설문</p>
              <p className="w-[500px] text-neutral-500">
                각 레슨에 배정할 설문을 선택하세요
              </p>
            </div>
            <div className="w-full  mt-3">
              <Form {...form}>
                <form
                  className="col-span-12  grid grid-cols-12 gap-3 w-full"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <FormField
                    control={form.control}
                    name="liveSurvey"
                    render={({ field: { value, onChange } }) => (
                      <FormItem className="flex flex-col   col-span-10">
                        <Popover>
                          <PopoverTrigger
                            asChild
                            disabled={
                              groupData?.status === "개설완료" ? true : false
                            }
                          >
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between",
                                  !value && "text-muted-foreground"
                                )}
                              >
                                {value?.title
                                  ? form.getValues("liveSurvey").title
                                  : "설문을 선택하세요."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[800px]">
                            <Command className="w-full">
                              <CommandInput
                                placeholder="설문를 검색하세요."
                                className="w-full"
                              />
                              <CommandList>
                                <CommandEmpty>
                                  검색결과가 없습니다.
                                </CommandEmpty>
                                <CommandGroup>
                                  {liveSurveyData.map(
                                    (readerdata: any, index: any) => (
                                      <CommandItem
                                        value={readerdata.title}
                                        key={readerdata._id}
                                        onSelect={() => {
                                          form.setValue("liveSurvey", {
                                            _id: readerdata._id,
                                            title: readerdata.title,
                                          });
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            readerdata._id === value?._id
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        <span>{readerdata.title}</span>
                                      </CommandItem>
                                    )
                                  )}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className=" col-span-2">
                    <Button
                      type="submit"
                      disabled={groupData?.status === "개설완료" ? true : false}
                    >
                      {loading ? (
                        <Loader2 className=" animate-spin" />
                      ) : (
                        <span>설문 설정</span>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
