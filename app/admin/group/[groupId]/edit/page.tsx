"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
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
  Check,
  ChevronsUpDown,
  CalendarIcon,
  CircleMinus,
  CirclePlus,
  CircleCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import dayjs from "dayjs";
import FormLabelWrap from "@/components/formLabel";

import Participant from "@/models/participant";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { detailGroup } from "@/components/commonActions/commonActions";
import { FormSubmitButton } from "@/components/commonUi/formUi";
import { editGroup, getSelectInitData } from "../_components/actions";

const FormSchema = z.object({
  teacher: z.object({
    _id: z.string(),
    username: z.string(),
    email: z.string(),
  }),
  courseProfile: z.object({ _id: z.string(), title: z.string() }),
  participants: z.array(
    z.object({
      _id: z.string(),
      username: z.string(),
      jobPosition: z.string(),
      email: z.string(),
    })
  ),
  name: z.string({
    required_error: "그룹명을 입력하세요.",
  }),
  dob: z
    .object(
      {
        from: z.date().optional(),
        to: z.date().optional(),
      },
      { required_error: "Date is required." }
    )
    .refine((date) => {
      return !!date.to;
    }, "End Date is required."),
});

//
export default function Page({ params }: { params: { groupId: string } }) {
  const [readerArray, setReaderArray] = React.useState<any>([]);
  const [courseProfileArray, setCourseProfile] = React.useState<any>([]);
  const [paricipantArray, setParticipant] = React.useState<any>([]);
  const [loading, setLoading] = React.useState(false);

  const router = useRouter();
  // const getSelectData = async () => {
  //   //
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
  // };
  //
  const fetchDataOptions = {
    groupId: params.groupId,
  };

  const {
    data: groupData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["groupedit", fetchDataOptions],
    queryFn: async () => {
      let res = await getSelectInitData();
      if (res.data) {
        let reader = JSON.parse(res.data.reader);
        let participants = JSON.parse(res.data.participants);
        let courseProfile = JSON.parse(res.data.courseProfile);
        console.log("reader", reader, participants, courseProfile);
        setReaderArray(reader);
        setCourseProfile(courseProfile);
        setParticipant(participants);
      }
      let groupDetail = await detailGroup(params.groupId);
      let group = JSON.parse(groupDetail.data);
      console.log("group", group);
      form.reset({
        teacher: {
          _id: group.teacher._id,
          username: group.teacher.username,
          email: group.teacher.email,
        },
        courseProfile: {
          _id: group.courseProfile._id,
          title: group.courseProfile.title,
        },
        participants: group.participants,
        name: group.name,
        dob: {
          from: group.startDate,
          to: group.endDate,
        },
      });
      if (group) {
        return group;
      }
    },
    refetchOnMount: true,
  });

  //
  // React.useEffect(() => {
  //   getSelectData();
  // }, []);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      dob: {
        from: undefined,
        to: undefined,
      },
      participants: [],
      teacher: undefined,
      name: undefined,
    },
  });
  const {
    fields: participantsFields,
    append: participantsAppend,
    remove: participantsRemove,
    replace: participantsReplace,
  } = useFieldArray({
    control: form.control,
    name: "participants",
  });
  async function onSubmit(values: z.infer<typeof FormSchema>) {
    try {
      setLoading(true);
      console.log(values, dayjs(values.dob.from).format("YYYY-MM-DD"));
      const formData = new FormData();
      formData.append("groupId", params.groupId);
      formData.append("courseProfileId", values.courseProfile._id);
      formData.append("name", values.name);
      formData.append("startDate", dayjs(values.dob.from).format("YYYY-MM-DD"));
      formData.append("endDate", dayjs(values.dob.to).format("YYYY-MM-DD"));
      formData.append("teacherId", values.teacher._id);
      formData.append("participants", JSON.stringify(values.participants));

      // 코스프로파일에 모듈 .레슨이 있는지
      // 레슨에 집합교육이면 라이브서베이 설정 되었는지.
      // 코스프로 파일 선택 하면 eduForm 집학교육 or SOJT 확인 후 설문 배정
      //

      let res = await editGroup(formData);
      console.log(res);
      if (res.data) {
        toast.success("그룹수정 성공하였습니다.");
        router.push(`/admin/group`);
      } else {
        toast.error(res.message);
      }
    } catch (e) {
      toast.error(e);
      //
    } finally {
      setLoading(false);
    }
  }

  //
  // React.useEffect(() => {
  //   const subscription = form.watch((value, { name, type }) => {
  //     console.log(value, name, type);
  //     if (name === "courseProfile" && value.courseProfile) {
  //       console.log(value.courseProfile);
  //       let result = courseProfileArray.filter(
  //         (item: any) => item._id === value.courseProfile._id
  //       );
  //       console.log("result", result);
  //       if (result.length > 0) {
  //         setCourseProfileData(result[0]);
  //       }
  //     }
  //   });
  //   return () => subscription.unsubscribe();
  // }, [form.watch]);
  return (
    <div className="w-full flex flex-col items-stretch flex-1  ">
      <div className="flex-1 flex flex-col  w-full">
        <div className="py-3 flex flex-col items-start px-6 h-[30px] justify-center">
          <p className=" font-bold text-bold">그룹 수정</p>
        </div>
        <ScrollArea className="h-[calc(100vh-100px)]">
          <div className="bg-white border flex-1 w-full flex flex-col items-start gap-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 w-full"
              >
                <div className="w-full p-6 border-b">
                  <div>
                    <p className="text-lg font-bold">1. 그룹 설정</p>
                  </div>
                  <div className="flex flex-col items-start gap-3 w-full mt-3">
                    <div className="w-full grid grid-cols-2 gap-3">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field: { value, onChange } }) => (
                          <FormItem className="flex flex-col col-span-1">
                            <FormLabelWrap title={"그룹명"} required={true} />
                            <Input
                              value={value || ""}
                              onChange={onChange}
                              placeholder="그룹명을 입력하세요."
                            />

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="dob"
                        render={({ field }) => (
                          <FormItem className="flex flex-col col-span-1">
                            <FormLabelWrap title={"교육기간"} required={true} />

                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      <span>
                                        {dayjs(field.value.from).format(
                                          "YYYY-MM-DD"
                                        )}{" "}
                                        ~{" "}
                                        {dayjs(field.value.to).format(
                                          "YYYY-MM-DD"
                                        )}
                                      </span>
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  locale={ko}
                                  mode="range"
                                  numberOfMonths={2}
                                  defaultMonth={field.value.from}
                                  selected={{
                                    from: field.value.from!,
                                    to: field.value.to,
                                  }}
                                  onSelect={field.onChange}
                                />
                              </PopoverContent>
                            </Popover>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="teacher"
                      render={({ field: { value, onChange } }) => (
                        <FormItem className="flex flex-col w-full">
                          <FormLabelWrap title={"리더"} required={true} />
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "w-full justify-between",
                                    !value && "text-muted-foreground"
                                  )}
                                >
                                  {value
                                    ? readerArray.find(
                                        (reader: any) =>
                                          reader._id === value._id
                                      )?.username
                                    : "리더를 선택하세요."}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[800px]">
                              <Command className="w-full">
                                <CommandInput
                                  placeholder="리더를 검색하세요."
                                  className="w-full"
                                />
                                <CommandList>
                                  <CommandEmpty>
                                    검색결과가 없습니다.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {readerArray.map(
                                      (readerdata: any, index: any) => (
                                        <CommandItem
                                          value={readerdata.username}
                                          key={readerdata._id}
                                          onSelect={() => {
                                            form.setValue("teacher", {
                                              _id: readerdata._id,
                                              username: readerdata.username,
                                              email: readerdata.email,
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
                                          <span>
                                            {readerdata.username}-
                                            {readerdata.email}
                                          </span>
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
                    <FormLabelWrap title={"참여자"} required={true} />
                    <div className="w-full grid grid-cols-12 gap-3">
                      <Tabs defaultValue="전체" className=" col-span-6">
                        <TabsList>
                          <TabsTrigger value="전체">전체</TabsTrigger>
                          <TabsTrigger value="사원/연구원">
                            사원/연구원
                          </TabsTrigger>
                          <TabsTrigger value="대리/선임">대리/선임</TabsTrigger>
                          <TabsTrigger value="과.차장/책임">
                            과.차장/책임
                          </TabsTrigger>
                          <TabsTrigger value="부장/수석">부장/수석</TabsTrigger>
                          <TabsTrigger value="임원">임원</TabsTrigger>
                        </TabsList>

                        <TabsContent value="전체" className="w-full ">
                          <div className="w-full ">
                            <div className="grid grid-cols-12 gap-2 w-full p-2 bg-neutral-100 border h-[50px]">
                              <div className=" col-span-3 flex flex-row items-center gap-1">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    participantsReplace([]);
                                    participantsAppend([...paricipantArray]);
                                  }}
                                >
                                  <p>전체 선택</p>
                                </Button>
                              </div>
                            </div>
                            <ScrollArea className="w-full   h-[500px] border">
                              {paricipantArray.map(
                                (parti: any, partiInde: any) => {
                                  return (
                                    <div
                                      key={parti._id}
                                      className="p-2 gap-3 flex flex-row items-center border-b"
                                    >
                                      <div className=" col-span-3">
                                        {participantsFields.filter(
                                          (item) => item._id === parti._id
                                        ).length > 0 ? (
                                          <Button
                                            type="button"
                                            size="icon"
                                            variant="outline"
                                            disabled
                                          >
                                            <CircleCheck className="size-4" />
                                          </Button>
                                        ) : (
                                          <Button
                                            type="button"
                                            size="icon"
                                            variant="outline"
                                            onClick={() =>
                                              participantsAppend({
                                                _id: parti._id,
                                                username: parti.username,
                                                jobPosition: parti.jobPosition,
                                                email: parti.email,
                                              })
                                            }
                                          >
                                            <CirclePlus className="size-4" />
                                          </Button>
                                        )}
                                      </div>
                                      <div className="col-span-2">
                                        <p>{parti.jobPosition}</p>
                                      </div>
                                      <div className="col-span-2">
                                        <p>{parti.username}</p>
                                      </div>
                                      <div className="col-span-5">
                                        <p>{parti.email}</p>
                                      </div>
                                    </div>
                                  );
                                }
                              )}
                            </ScrollArea>
                          </div>
                        </TabsContent>
                        <TabsContent value="사원/연구원">
                          <div className="w-full ">
                            <div className="grid grid-cols-12 gap-2 w-full p-2 bg-neutral-100 border h-[50px]">
                              <div className=" col-span-3 flex flex-row items-center gap-1">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    participantsReplace([]);
                                    participantsAppend([
                                      ...paricipantArray.filter(
                                        (item: any) =>
                                          item.jobPosition === "사원" ||
                                          item.jobPosition === "연구원"
                                      ),
                                    ]);
                                  }}
                                >
                                  <p>전체 선택</p>
                                </Button>
                              </div>
                            </div>
                            <ScrollArea className="w-full   h-[500px] border">
                              {paricipantArray
                                .filter(
                                  (item: any) =>
                                    item.jobPosition === "사원" ||
                                    item.jobPosition === "연구원"
                                )
                                .map((parti: any, partiInde: any) => {
                                  return (
                                    <div
                                      key={parti._id}
                                      className="p-2 gap-3 flex flex-row items-center border-b"
                                    >
                                      <div className=" col-span-3">
                                        {participantsFields.filter(
                                          (item) => item._id === parti._id
                                        ).length > 0 ? (
                                          <Button
                                            type="button"
                                            size="icon"
                                            variant="outline"
                                            disabled
                                          >
                                            <CircleCheck className="size-4" />
                                          </Button>
                                        ) : (
                                          <Button
                                            type="button"
                                            size="icon"
                                            variant="outline"
                                            onClick={() =>
                                              participantsAppend({
                                                _id: parti._id,
                                                username: parti.username,
                                                jobPosition: parti.jobPosition,
                                                email: parti.email,
                                              })
                                            }
                                          >
                                            <CirclePlus className="size-4" />
                                          </Button>
                                        )}
                                      </div>
                                      <div className="col-span-2">
                                        <p>{parti.jobPosition}</p>
                                      </div>
                                      <div className="col-span-2">
                                        <p>{parti.username}</p>
                                      </div>
                                      <div className="col-span-5">
                                        <p>{parti.email}</p>
                                      </div>
                                    </div>
                                  );
                                })}
                            </ScrollArea>
                          </div>
                        </TabsContent>
                        <TabsContent value="대리/선임">
                          <div className="w-full ">
                            <div className="grid grid-cols-12 gap-2 w-full p-2 bg-neutral-100 border h-[50px]">
                              <div className=" col-span-3 flex flex-row items-center gap-1">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    participantsReplace([]);
                                    participantsAppend([
                                      ...paricipantArray.filter(
                                        (item: any) =>
                                          item.jobPosition === "대리" ||
                                          item.jobPosition === "선임"
                                      ),
                                    ]);
                                  }}
                                >
                                  <p>전체 선택</p>
                                </Button>
                              </div>
                            </div>
                            <ScrollArea className="w-full   h-[500px] border">
                              {paricipantArray
                                .filter(
                                  (item: any) =>
                                    item.jobPosition === "대리" ||
                                    item.jobPosition === "선임"
                                )
                                .map((parti: any, partiInde: any) => {
                                  return (
                                    <div
                                      key={parti._id}
                                      className="p-2 gap-3 flex flex-row items-center border-b"
                                    >
                                      <div className=" col-span-3">
                                        {participantsFields.filter(
                                          (item) => item._id === parti._id
                                        ).length > 0 ? (
                                          <Button
                                            type="button"
                                            size="icon"
                                            variant="outline"
                                            disabled
                                          >
                                            <CircleCheck className="size-4" />
                                          </Button>
                                        ) : (
                                          <Button
                                            type="button"
                                            size="icon"
                                            variant="outline"
                                            onClick={() =>
                                              participantsAppend({
                                                _id: parti._id,
                                                username: parti.username,
                                                jobPosition: parti.jobPosition,
                                                email: parti.email,
                                              })
                                            }
                                          >
                                            <CirclePlus className="size-4" />
                                          </Button>
                                        )}
                                      </div>
                                      <div className="col-span-2">
                                        <p>{parti.jobPosition}</p>
                                      </div>
                                      <div className="col-span-2">
                                        <p>{parti.username}</p>
                                      </div>
                                      <div className="col-span-5">
                                        <p>{parti.email}</p>
                                      </div>
                                    </div>
                                  );
                                })}
                            </ScrollArea>
                          </div>
                        </TabsContent>
                        <TabsContent value="과.차장/책임">
                          <div className="w-full ">
                            <div className="grid grid-cols-12 gap-2 w-full p-2 bg-neutral-100 border h-[50px]">
                              <div className=" col-span-3 flex flex-row items-center gap-1">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    participantsReplace([]);
                                    participantsAppend([
                                      ...paricipantArray.filter(
                                        (item: any) =>
                                          item.jobPosition === "과장" ||
                                          item.jobPosition === "차장" ||
                                          item.jobPosition === "책임"
                                      ),
                                    ]);
                                  }}
                                >
                                  <p>전체 선택</p>
                                </Button>
                              </div>
                            </div>
                            <ScrollArea className="w-full   h-[500px] border">
                              {paricipantArray
                                .filter(
                                  (item: any) =>
                                    item.jobPosition === "과장" ||
                                    item.jobPosition === "차장" ||
                                    item.jobPosition === "책임"
                                )
                                .map((parti: any, partiInde: any) => {
                                  return (
                                    <div
                                      key={parti._id}
                                      className="p-2 gap-3 flex flex-row items-center border-b"
                                    >
                                      <div className=" col-span-3">
                                        {participantsFields.filter(
                                          (item) => item._id === parti._id
                                        ).length > 0 ? (
                                          <Button
                                            type="button"
                                            size="icon"
                                            variant="outline"
                                            disabled
                                          >
                                            <CircleCheck className="size-4" />
                                          </Button>
                                        ) : (
                                          <Button
                                            type="button"
                                            size="icon"
                                            variant="outline"
                                            onClick={() =>
                                              participantsAppend({
                                                _id: parti._id,
                                                username: parti.username,
                                                jobPosition: parti.jobPosition,
                                                email: parti.email,
                                              })
                                            }
                                          >
                                            <CirclePlus className="size-4" />
                                          </Button>
                                        )}
                                      </div>
                                      <div className="col-span-2">
                                        <p>{parti.jobPosition}</p>
                                      </div>
                                      <div className="col-span-2">
                                        <p>{parti.username}</p>
                                      </div>
                                      <div className="col-span-5">
                                        <p>{parti.email}</p>
                                      </div>
                                    </div>
                                  );
                                })}
                            </ScrollArea>
                          </div>
                        </TabsContent>
                        <TabsContent value="부장/수석">
                          <div className="w-full ">
                            <div className="grid grid-cols-12 gap-2 w-full p-2 bg-neutral-100 border h-[50px]">
                              <div className=" col-span-3 flex flex-row items-center gap-1">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    participantsReplace([]);
                                    participantsAppend([
                                      ...paricipantArray.filter(
                                        (item: any) =>
                                          item.jobPosition === "부장" ||
                                          item.jobPosition === "수석"
                                      ),
                                    ]);
                                  }}
                                >
                                  <p>전체 선택</p>
                                </Button>
                              </div>
                            </div>
                            <ScrollArea className="w-full   h-[500px] border">
                              {paricipantArray
                                .filter(
                                  (item: any) =>
                                    item.jobPosition === "부장" ||
                                    item.jobPosition === "수석"
                                )
                                .map((parti: any, partiInde: any) => {
                                  return (
                                    <div
                                      key={parti._id}
                                      className="p-2 gap-3 flex flex-row items-center border-b"
                                    >
                                      <div className=" col-span-3">
                                        {participantsFields.filter(
                                          (item) => item._id === parti._id
                                        ).length > 0 ? (
                                          <Button
                                            type="button"
                                            size="icon"
                                            variant="outline"
                                            disabled
                                          >
                                            <CircleCheck className="size-4" />
                                          </Button>
                                        ) : (
                                          <Button
                                            type="button"
                                            size="icon"
                                            variant="outline"
                                            onClick={() =>
                                              participantsAppend({
                                                _id: parti._id,
                                                username: parti.username,
                                                jobPosition: parti.jobPosition,
                                                email: parti.email,
                                              })
                                            }
                                          >
                                            <CirclePlus className="size-4" />
                                          </Button>
                                        )}
                                      </div>
                                      <div className="col-span-2">
                                        <p>{parti.jobPosition}</p>
                                      </div>
                                      <div className="col-span-2">
                                        <p>{parti.username}</p>
                                      </div>
                                      <div className="col-span-5">
                                        <p>{parti.email}</p>
                                      </div>
                                    </div>
                                  );
                                })}
                            </ScrollArea>
                          </div>
                        </TabsContent>
                        <TabsContent value="임원">
                          <div className="w-full ">
                            <div className="grid grid-cols-12 gap-2 w-full p-2 bg-neutral-100 border h-[50px]">
                              <div className=" col-span-3 flex flex-row items-center gap-1">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    participantsReplace([]);
                                    participantsAppend([
                                      ...paricipantArray.filter(
                                        (item: any) =>
                                          item.jobPosition === "임원"
                                      ),
                                    ]);
                                  }}
                                >
                                  <p>전체 선택</p>
                                </Button>
                              </div>
                            </div>
                            <ScrollArea className="w-full   h-[500px] border">
                              {paricipantArray
                                .filter(
                                  (item: any) => item.jobPosition === "임원"
                                )
                                .map((parti: any, partiInde: any) => {
                                  return (
                                    <div
                                      key={parti._id}
                                      className="p-2 gap-3 flex flex-row items-center border-b"
                                    >
                                      <div className=" col-span-3">
                                        {participantsFields.filter(
                                          (item) => item._id === parti._id
                                        ).length > 0 ? (
                                          <Button
                                            type="button"
                                            size="icon"
                                            variant="outline"
                                            disabled
                                          >
                                            <CircleCheck className="size-4" />
                                          </Button>
                                        ) : (
                                          <Button
                                            type="button"
                                            size="icon"
                                            variant="outline"
                                            onClick={() =>
                                              participantsAppend({
                                                _id: parti._id,
                                                username: parti.username,
                                                jobPosition: parti.jobPosition,
                                                email: parti.email,
                                              })
                                            }
                                          >
                                            <CirclePlus className="size-4" />
                                          </Button>
                                        )}
                                      </div>
                                      <div className="col-span-2">
                                        <p>{parti.jobPosition}</p>
                                      </div>
                                      <div className="col-span-2">
                                        <p>{parti.username}</p>
                                      </div>
                                      <div className="col-span-5">
                                        <p>{parti.email}</p>
                                      </div>
                                    </div>
                                  );
                                })}
                            </ScrollArea>
                          </div>
                        </TabsContent>
                      </Tabs>
                      <div className=" col-span-6 mt-12">
                        <div className="p-3 w-full bg-neutral-100 border h-[50px] flex flex-row items-center justify-between">
                          <div className="flex flex-row items-center gap-2">
                            <p>선택된 교육생</p>
                            <p>{participantsFields.length}명</p>
                          </div>
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            onClick={() => participantsReplace([])}
                          >
                            <CircleMinus className="size-4" />
                          </Button>
                        </div>
                        <ScrollArea className="w-full   h-[490px] border">
                          {participantsFields.map((item, index) => {
                            return (
                              <div
                                key={index}
                                className=" col-span-12 flex flex-row items-center gap-3 p-2 border-b"
                              >
                                <div className=" col-span-3">
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="outline"
                                    onClick={() => participantsRemove(index)}
                                  >
                                    <CircleMinus className="size-4" />
                                  </Button>
                                </div>
                                <div className="col-span-2">
                                  <p>{item.jobPosition}</p>
                                </div>
                                <div className="col-span-2">
                                  <p>{item.username}</p>
                                </div>
                                <div className="col-span-5">
                                  <p>{item.email}</p>
                                </div>
                              </div>
                            );
                          })}
                        </ScrollArea>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full  p-6">
                  <div>
                    <p className="text-lg font-bold">2. 코스프로파일</p>
                    <p>그룹에 배정할 코스프로파일을 선택하세요</p>
                  </div>
                  <div className="w-full grid grid-cols-12 gap-3 mt-3">
                    <FormField
                      control={form.control}
                      name="courseProfile"
                      render={({ field: { value, onChange } }) => (
                        <FormItem className="flex flex-col  col-span-12">
                          <FormLabelWrap
                            title={"코스프로파일"}
                            required={true}
                          />
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "w-full justify-between",
                                    !value && "text-muted-foreground"
                                  )}
                                >
                                  {value
                                    ? courseProfileArray.find(
                                        (courseProfile: any) =>
                                          courseProfile._id === value._id
                                      )?.title
                                    : "코스프로파일을 선택하세요."}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[800px] ">
                              <Command className="w-full">
                                <CommandInput
                                  placeholder="코스프로파일을 검색하세요."
                                  className="w-full"
                                />
                                <CommandList className="">
                                  <CommandEmpty>
                                    검색결과가 없습니다.
                                  </CommandEmpty>
                                  <CommandGroup className="">
                                    {courseProfileArray.map(
                                      (courseProfile: any, index: any) => (
                                        <CommandItem
                                          value={courseProfile.title}
                                          key={courseProfile._id}
                                          onSelect={() => {
                                            form.setValue("courseProfile", {
                                              _id: courseProfile._id,
                                              title: courseProfile.title,
                                            });
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              courseProfile._id === value?._id
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                          <span>
                                            {courseProfile.title} -{" "}
                                            {dayjs(
                                              courseProfile.createdAt
                                            ).format("YYYY-MM-DD")}
                                          </span>
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
                  </div>
                </div>
                <div className="w-full  p-6">
                  <FormSubmitButton
                    title="수정"
                    form={form}
                    loading={loading}
                    disabled={false}
                  />
                </div>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
