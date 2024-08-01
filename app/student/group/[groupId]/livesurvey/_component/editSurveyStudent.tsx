"use client";
import ActionModal from "@/components/commonUi/ActionModal";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Search } from "lucide-react";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast, Toaster } from "sonner";
import { updateResultSurvey } from "./actions";
import { Input } from "@/components/ui/input";

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
export default function EditSurveyStudent({
  resultSurvey,
  livesurveytitle,
  getData,
}: {
  resultSurvey: any;
  livesurveytitle: string;
  getData: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [updataLoading, setUpdateLoading] = React.useState(false);
  console.log("resultSurveyresultSurvey", resultSurvey);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { results: resultSurvey.results || [] },
  });
  const {
    fields: resultsFields,
    append: resultsAppend,
    remove: resultsRemove,
  } = useFieldArray({
    control: form.control,
    name: "results",
  });

  React.useEffect(() => {
    form.reset({ results: resultSurvey.results });
  }, [resultSurvey]);

  //
  async function onSubmit(values: z.infer<typeof FormSchema>) {
    setUpdateLoading(true);

    console.log("values", values);
    const formData = new FormData();
    formData.append("resultSurverId", resultSurvey._id);

    formData.append("results", JSON.stringify(values.results));
    try {
      let res = await updateResultSurvey(formData);
      if (res.data) {
        //
        console.log(JSON.parse(res.data));
        toast.success("설문 업데이트에 성공하였습니다.");
        // router.push(`/student/group/${params.groupId}/notice`);
      } else {
        console.log("res.data", res.message);
        toast.error(res.message);
      }
    } catch (e) {
      //
      console.log("message", e);
      toast.error(e);
    } finally {
      setUpdateLoading(false);
      setOpen(false);
      getData();
    }
  }
  return (
    <div className="">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="xs" className="flex flex-row items-center gap-2">
            <Search className="size-3" />
            설문 수정
          </Button>
        </DialogTrigger>

        <DialogContent className="w-[800px]">
          <DialogHeader>
            <DialogTitle>설문 수정</DialogTitle>
            <DialogDescription>설문 내용을 수정합니다.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col  gap-2 ">
            {resultSurvey && (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8 w-full"
                >
                  <ScrollArea className="flex flex-col  w-full h-[calc(100vh-200px)]">
                    <div className="bg-white border flex-1 w-full p-6 flex flex-col items-start gap-2">
                      <div className="flex flex-row  items-center gap-2 flex-wrap  w-full">
                        <p>{livesurveytitle}</p>
                        {resultsFields.map(
                          (resultSurvey, resultSurveyIndex) => {
                            return (
                              <div
                                className=" border px-3 py-3 rounded-md bg-neutral-100 w-full"
                                key={resultSurveyIndex}
                              >
                                {resultSurvey.type === "객관식" ? (
                                  <FormField
                                    control={form.control}
                                    name={`results.${resultSurveyIndex}.point`}
                                    render={({
                                      field: { value, onChange },
                                    }) => (
                                      <FormItem className="flex flex-col col-span-12 gap-1">
                                        <div className="py-2 ">
                                          <p className=" font-bold text-md">
                                            {resultSurveyIndex + 1}.{" "}
                                            {resultSurvey.title}
                                          </p>
                                        </div>
                                        <div className="flex flex-row items-center gap-2">
                                          <Button
                                            type="button"
                                            variant={
                                              value === 1
                                                ? "default"
                                                : "defaultoutline"
                                            }
                                            size="sm"
                                            onClick={() => onChange(1)}
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
                                            onClick={() => onChange(2)}
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
                                            onClick={() => onChange(3)}
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
                                            onClick={() => onChange(4)}
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
                                            onClick={() => onChange(5)}
                                          >
                                            매우 그렇다
                                          </Button>
                                        </div>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                ) : (
                                  <FormField
                                    control={form.control}
                                    name={`results.${resultSurveyIndex}.answer`}
                                    render={({
                                      field: { value, onChange },
                                    }) => (
                                      <FormItem className="flex flex-col col-span-12 gap-1">
                                        <div className="py-2 ">
                                          <p className=" font-bold text-md">
                                            {resultSurveyIndex + 1}.{" "}
                                            {resultSurvey.title}
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
                          }
                        )}
                      </div>
                    </div>
                  </ScrollArea>
                  <div className="w-full flex flex-row items-center justify-end gap-2">
                    <Button
                      type="button"
                      onClick={() => setOpen(false)}
                      variant="outline"
                    >
                      <p>취소</p>
                    </Button>
                    <Button type="submit">
                      {updataLoading ? (
                        <Loader2 className=" animate-spin" />
                      ) : (
                        <p>수정</p>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
