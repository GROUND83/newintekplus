"use client";

import React from "react";
import {
  createResultSurvey,
  getGroupDetail,
  getResultSurveyData,
} from "./_component/actions";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
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

import { Loader2, XIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useRouter } from "next/navigation";
import EditSurveyStudent from "./_component/editSurveyStudent";
import ViewResultSurveyt from "@/components/commonUi/viewResultSurvey";
//

const FormSchema = z.object({
  results: z.array(
    z.object({
      surveyId: z.string().optional(),
      point: z.number({ required_error: "필수사항 입니다." }),
      title: z.string().optional(),
      type: z.string().optional(),
      answer: z.string().optional(),
    })
  ), // 요구 역량
});
export default function Page({ params }: { params: { groupId: string } }) {
  console.log("groupId", params.groupId);
  // console.log("groupId", params.groupId);
  const router = useRouter();
  const [livesurvey, setLiveSurvey] = React.useState<any>();
  //
  const [resultSurveyData, setResultSurvey] = React.useState<any>();
  const [updataLoading, setUpdateLoading] = React.useState<any>(false);
  //
  //
  const session = useSession();

  const getData = async () => {
    // let res = await getGroupDetail({
    //   groupId: params.groupId,
    //   userEmail: session?.data.user.email,
    // });
    let res = await getResultSurveyData(params.groupId);
    if (res.data) {
      let data = JSON.parse(res.data);
      console.log("data", data);
      if (data.liveSurvey) {
        setLiveSurvey(data.liveSurvey);
      }
      let resultSurvey = JSON.parse(res.resultSurvey);
      console.log("resultSurvey", resultSurvey);
      setResultSurvey(resultSurvey);
      if (resultSurvey.results.length > 0) {
        form.reset({
          results: resultSurvey.results,
        });
      } else {
        let newArray = [];
        for (const survey of data.liveSurvey.surveys) {
          if (survey.type === "객관식") {
            let newData = {
              surveyId: survey._id,
              title: survey.title,
              point: undefined,
              type: survey.type,
              answer: "",
            };
            newArray.push(newData);
          } else {
            let newData = {
              surveyId: survey._id,
              title: survey.title,
              point: 0,
              type: survey.type,
              answer: "",
            };
            newArray.push(newData);
          }
        }
        form.reset({
          results: newArray,
        });
      }
      // setResultSurvey(resultSurvey);
    }
  };

  React.useEffect(() => {
    getData();
  }, []);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });
  const {
    fields: resultsFields,
    append: resultsAppend,
    remove: resultsRemove,
  } = useFieldArray({
    control: form.control,
    name: "results",
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    // setUpdateLoading(true);
    // console.log("session", session);
    console.log("values", values);
    const formData = new FormData();
    formData.append("resultSurveyId", resultSurveyData._id);
    formData.append("liveSurveyId", livesurvey._id);
    formData.append("groupId", params.groupId);

    formData.append("results", JSON.stringify(values.results));

    try {
      let res = await createResultSurvey(formData);
      if (res.data) {
        //
        console.log(JSON.parse(res.data));
        toast.success("설문 업데이트에 성공하였습니다.");
        router.push(`/student/group/${params.groupId}/notice`);
      } else {
        console.log("res.data", res.message);
        toast.success(res.message);
      }
    } catch (e) {
      //
      console.log("message", e);
      toast.error(e);
    } finally {
      setUpdateLoading(false);
    }
  }
  return (
    <div className="w-full flex flex-col items-stretch flex-1  ">
      {!resultSurveyData?.isDone ? (
        <ScrollArea className="flex flex-col  w-full h-[calc(100vh-120px)]">
          <div className="bg-white border flex-1 w-full p-6 flex flex-col items-start gap-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 w-full"
              >
                <div className="flex flex-row  items-center gap-2 flex-wrap  w-full">
                  <p>{livesurvey?.title}</p>
                  {resultsFields.map((livesurveydata, resuResultIndex) => {
                    return (
                      <div
                        className=" border px-3 py-3 rounded-md bg-neutral-100 w-full"
                        key={resuResultIndex}
                      >
                        {livesurveydata.type === "객관식" ? (
                          <FormField
                            control={form.control}
                            name={`results.${resuResultIndex}.point`}
                            render={({ field: { value, onChange } }) => (
                              <FormItem className="flex flex-col col-span-12 gap-1">
                                <div className="py-2 ">
                                  <p className=" font-bold text-md">
                                    {resuResultIndex + 1}.{" "}
                                    {livesurveydata.title}
                                  </p>

                                  <div className="flex flex-row items-center gap-2">
                                    <Button
                                      type="button"
                                      variant={
                                        value === 1
                                          ? "default"
                                          : "defaultoutline"
                                      }
                                      size="sm"
                                      onClick={() => {
                                        onChange(1);
                                      }}
                                    >
                                      전혀 그렇지 않다
                                    </Button>
                                    <Button
                                      type="button"
                                      variant={
                                        value === 2
                                          ? "default"
                                          : "defaultoutline"
                                      }
                                      size="sm"
                                      onClick={() => {
                                        onChange(2);
                                      }}
                                    >
                                      별로 그렇지 않다
                                    </Button>
                                    <Button
                                      type="button"
                                      variant={
                                        value === 3
                                          ? "default"
                                          : "defaultoutline"
                                      }
                                      size="sm"
                                      onClick={() => {
                                        onChange(3);
                                      }}
                                    >
                                      보통이다
                                    </Button>
                                    <Button
                                      type="button"
                                      variant={
                                        value === 4
                                          ? "default"
                                          : "defaultoutline"
                                      }
                                      size="sm"
                                      onClick={() => {
                                        onChange(4);
                                      }}
                                    >
                                      다소 그렇다
                                    </Button>
                                    <Button
                                      type="button"
                                      variant={
                                        value === 5
                                          ? "default"
                                          : "defaultoutline"
                                      }
                                      size="sm"
                                      onClick={() => {
                                        onChange(5);
                                      }}
                                    >
                                      매우 그렇다
                                    </Button>
                                  </div>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ) : (
                          <FormField
                            control={form.control}
                            name={`results.${resuResultIndex}.answer`}
                            render={({ field: { value, onChange } }) => (
                              <FormItem className="flex flex-col col-span-12 gap-1">
                                <div className="py-2 ">
                                  <p className=" font-bold text-md">
                                    {resuResultIndex + 1}.{" "}
                                    {livesurveydata.title}
                                  </p>
                                </div>

                                <div>
                                  <Input
                                    value={value || ""}
                                    onChange={onChange}
                                    placeholder="답변을 입력하세요."
                                  />
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div>
                  <Button type="submit">
                    {updataLoading ? (
                      <Loader2 className=" animate-spin" />
                    ) : (
                      <p>제출</p>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </ScrollArea>
      ) : (
        <div className="flex-1 flex flex-col  w-full h-[calc(100vh-120px)] items-center justify-center">
          <div className="bg-white border  w-full p-6 flex flex-col items-center justify-center gap-2 h-[calc(100vh-140px)]">
            <p>설문을 완료 하였습니다.</p>

            <ViewResultSurveyt resultSurvey={resultSurveyData} />
            {!resultSurveyData.isSend && (
              <EditSurveyStudent
                livesurveytitle={livesurvey.title}
                resultSurvey={resultSurveyData}
                getData={getData}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
