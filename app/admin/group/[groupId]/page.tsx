"use client";

import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
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
  Loader2,
  SquareArrowOutUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  deleteGroup,
  getLiveSurvey,
  updateGroupStatus,
  updateLiveSurvey,
} from "./_components/actions";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  CourseProfileDataWrap,
  GroupTitle,
  LeaderWrap,
  PeriodWrap,
  StudentWrap,
} from "@/components/commonUi/aboutGroup";
import DeleteModal from "@/components/commonUi/DeleteModal";
import { notFound, useRouter } from "next/navigation";
import { detailGroup } from "@/components/commonActions/commonActions";
import { FormSubmitButton } from "@/components/commonUi/formUi";

const FormSchema = z.object({
  liveSurvey: z.object({
    _id: z.string().optional(),
    title: z.string().optional(),
  }),
});
export default function Page({ params }: { params: { groupId: string } }) {
  const router = useRouter();
  const [liveSurveyData, setLiveSurveyData] = React.useState<any>([]);
  const [loading, setLoading] = React.useState<any>(false);
  const [statusloading, setStatusLoading] = React.useState<any>(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
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
      let res = await detailGroup(params.groupId);
      let data = JSON.parse(res.data);
      let newLiveSurvey = [];
      let wholeliveSurvey = await getLiveSurvey({
        groupId: fetchDataOptions.groupId,
      });
      if (wholeliveSurvey.data) {
        newLiveSurvey = await JSON.parse(wholeliveSurvey.data);

        setLiveSurveyData(newLiveSurvey);
      }

      form.reset({
        liveSurvey: {
          _id: data.liveSurvey?._id || "",
          title: data.liveSurvey?.title || "",
        },
      });
      if (data) {
        return data;
      }
    },
    refetchOnMount: true,
  });
  //

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      liveSurvey: { _id: "", title: "" },
    },
  });

  const changeStatus = async () => {
    let groupId = params.groupId;
    console.log("liveSurvey", form.getValues("liveSurvey"));
    if (!form.getValues("liveSurvey")._id) {
      return alert("설문을 배정하세요.");
    }
    setStatusLoading(true);
    try {
      let res = await updateGroupStatus({ groupId: groupId });
      if (res.data) {
        toast.success("그룹개설이 완료 되었습니다.");
        refetch();
      } else {
        console.log(res.message);
      }
    } catch (e) {
      toast.error(e);
    } finally {
      setStatusLoading(false);
    }
  };

  // 설문설정
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
  const clickDeleteGroup = async () => {
    setDeleteLoading(true);
    try {
      let res = await deleteGroup(params.groupId);
      if (res.data) {
        console.log("ok");
        toast.success("그룹 삭제에 성공하였습니다.");
        router.push(`/admin/group`);
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
  if (isLoading) {
    return (
      <div className="w-full  h-[calc(100vh-70px)]  flex flex-col items-center justify-center">
        <Loader2 className=" animate-spin size-8 text-primary" />
      </div>
    );
  }
  if (isError) {
    notFound();
  }
  return (
    <div className="w-full flex flex-col  bg-white  ">
      <ScrollArea className="w-full flex  flex-col gap-3 h-[calc(100vh-70px)] bg-white ">
        <div className="w-full flex flex-col ">
          <div className="w-full flex flex-row items-center justify-between p-6  border-b ">
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
                <span className="text-red-500">수정 불가(그룹삭제는 가능)</span>{" "}
                합니다.
              </p>
              <p className="w-[500px] text-neutral-500">
                <span className="text-red-500">개설 완료 시 </span>리더,
                교육생에게 노출 됩니다.
              </p>
            </div>

            <div className=" flex flex-row items-center gap-2 ">
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
              <DeleteModal
                title="그룹삭제"
                desc="그룹 삭제시 복구 되지 않습니다."
                btnText="그룹 삭제"
                onClick={clickDeleteGroup}
                disabled={deleteLoading}
                deleteOpen={deleteOpen}
                setDeleteOpen={setDeleteOpen}
                deleteLoading={deleteLoading}
              />
            </div>
          </div>

          <div className="w-full flex flex-col items-start  p-6 bg-white  border-b ">
            <div className=" w-full flex flex-row items-center justify-between border-b pb-6">
              <p className="text-lg font-bold">그룹 정보</p>
              <div className=" ">
                {groupData?.status === "개설중" ? (
                  <Button asChild>
                    <Link href={`/admin/group/${params.groupId}/edit`}>
                      그룹수정
                    </Link>
                  </Button>
                ) : (
                  <Button disabled>그룹 수정 불가</Button>
                )}
              </div>
            </div>

            <div className="w-full grid grid-cols-12 gap-3">
              <div className=" col-span-6 pt-4 pb-6 border-b flex flex-col gap-2">
                <GroupTitle name={groupData?.name} />
              </div>
              <div className="col-span-6 pt-4 pb-6 border-b flex flex-col gap-2">
                <PeriodWrap
                  startDate={groupData?.startDate}
                  endDate={groupData?.endDate}
                />
              </div>
              <div className=" col-span-6  pt-4 pb-6 border-b flex flex-col gap-2">
                <LeaderWrap teacher={groupData?.teacher} />
              </div>
              <div className=" col-span-6  pt-4 pb-6 border-b flex flex-col gap-2">
                <StudentWrap
                  participants={groupData?.participants}
                  height="h-[300px]"
                />
              </div>
              <div className=" col-span-12 pt-4 pb-6 flex flex-col gap-2">
                <CourseProfileDataWrap
                  courseProfile={groupData?.courseProfile}
                />
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
                  className="col-span-12  flex flex-row items-center gap-3 w-full"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <FormField
                    control={form.control}
                    name="liveSurvey"
                    render={({ field: { value, onChange } }) => (
                      <FormItem className="flex flex-col   col-span-10 flex-1">
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
                  <div className=" col-span-1">
                    <FormSubmitButton
                      title="설문 설정"
                      form={form}
                      loading={loading}
                      disabled={groupData?.status === "개설완료" ? true : false}
                    />
                    {/* <Button
                      type="submit"
                      disabled={groupData?.status === "개설완료" ? true : false}
                    >
                      {loading ? (
                        <Loader2 className=" animate-spin" />
                      ) : (
                        <span>설문 설정</span>
                      )}
                    </Button> */}
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
