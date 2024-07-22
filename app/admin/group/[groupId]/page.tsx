"use client";

import React from "react";
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
  const [groupData, setGroupData] = React.useState<any>();
  const [liveSurveyData, setLiveSurveyData] = React.useState<any>([]);
  const [loading, setLoading] = React.useState<any>(false);
  const [statusloading, setStatusLoading] = React.useState<any>(false);

  //
  const reload = async () => {
    // setLoading(true);
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
    console.log("reloadData", data);

    //   코스프로파일 에서 eduFrom이 집합교육이면
    //    linveSurvey 세팅
    let modulesdata = [];
    let newLiveSurvey = [];
    let liveSurvey = await getLiveSurvey({
      groupId: params.groupId,
    });

    if (liveSurvey.data) {
      //
      newLiveSurvey = await JSON.parse(liveSurvey.data);
      console.log("newLiveSurvey", newLiveSurvey);
      setLiveSurveyData(newLiveSurvey);
    }
    //

    setGroupData(data);
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
  };

  const initailData = async () => {
    //
    let response = await detailGroup(params.groupId);
    if (response.data) {
      let result = JSON.parse(response.data);
      console.log("data", result);
      return result;
    }
  };
  React.useEffect(() => {
    // getSelectData();
    reload();
  }, []);

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
        reload();
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
        reload();
      }
    } catch (e) {
      toast.error(e);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="w-full flex flex-col items-stretch flex-1  ">
      <div className="p-3 flex-1 flex flex-col  w-full">
        <div className="bg-white border flex-1 w-full p-6 flex flex-col items-start gap-2">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>
                1. 그룹상태 변경 <Badge>{groupData?.status}</Badge>
              </CardTitle>
              <CardDescription>
                그룹의 상태를 변경 합니다. 개설 완료 변경시 그룹 데이터는 변경
                불가 합니다. 개설 완료 시 리더, 교육생에게 노출 됩니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-start gap-3 w-full">
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
                  <Link href={`/admin/group/${params.groupId}/detail/notice`}>
                    그룹 이동
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>2. 그룹 정보</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-start gap-3 w-full">
              <div className="w-full grid grid-cols-2 gap-3">
                <div>
                  <Label>그룹명</Label>
                  <p>{groupData?.name}</p>
                </div>
                <div>
                  <Label>교육기간</Label>
                  <p>
                    {dayjs(groupData?.from).format("YYYY-MM-DD")} ~{" "}
                    {dayjs(groupData?.to).format("YYYY-MM-DD")}
                  </p>
                </div>
                <div>
                  <Label>리더</Label>
                  <p>
                    {groupData?.teacher.username} - {groupData?.teacher.email}
                  </p>
                </div>
                <div>
                  <Label>참여자</Label>
                  {groupData?.participants.map((item, index) => {
                    return (
                      <p key={item._id}>
                        {item.jobPosition} {item.username} - {item.email}
                      </p>
                    );
                  })}
                </div>
                <div>
                  <Label>코스프로파일</Label>
                  <p>
                    {groupData?.courseProfile.eduForm} -
                    {groupData?.courseProfile.title}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>3. 설문 설정</CardTitle>
              <CardDescription>
                각 레슨에 배정할 설문을 선택하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="w-full grid grid-cols-12 gap-3 ">
              <Form {...form}>
                <form
                  className="space-y-8  col-span-12"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <FormField
                    control={form.control}
                    name="liveSurvey"
                    render={({ field: { value, onChange } }) => (
                      <FormItem className="flex flex-col w-full  col-span-6">
                        <FormLabelWrap title={"설문"} required={true} />
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
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
