"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createLiveSurvey } from "../_components/table/actions";
import React from "react";
import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormLabelWrap from "@/components/formLabel";
import { XIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { FormSubmitButton } from "@/components/commonUi/formUi";
const FormSchema = z.object({
  title: z.string({
    required_error: "과정명을 입력하세요.",
  }),
  surveys: z.array(
    z.object({
      title: z.string().optional(),
      type: z.string().optional(),
    })
  ), // 요구 역량
});
export default function Page() {
  //
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [editAvaliable, setEditAvaliable] = React.useState<any>([]);
  //
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });

  const {
    fields: surveysFields,
    append: surveysAppend,
    remove: surveysRemove,
  } = useFieldArray({
    control: form.control,
    name: "surveys",
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    setLoading(true);
    console.log("values", values);

    const formData = new FormData();

    formData.append("title", values.title);
    formData.append("surveys", JSON.stringify(values.surveys));

    try {
      let res = await createLiveSurvey(formData);
      console.log("resdta", res);
      if (res.data) {
        //
        toast.success("설문 생성에 성공하였습니다.");
        router.push("/admin/evaluation");
      }
    } catch (e) {
      //
      console.log("message", e);
      toast.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full flex-1 flex ">
      <ScrollArea className="w-full h-[calc(100vh-70px)] ">
        <div className=" w-full flex flex-col items-start">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 w-full"
            >
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-xl">설문생성</CardTitle>

                  <div>
                    <span> 설문을 생성하세요.</span>
                  </div>
                </CardHeader>
                <CardContent className="w-full grid grid-cols-12 gap-5">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field: { value, onChange } }) => (
                      <FormItem className="flex flex-col col-span-12 gap-2">
                        <FormLabelWrap title="설문명" required />
                        <Input
                          value={value || ""}
                          onChange={onChange}
                          placeholder="설문명을 입력하세요."
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="col-span-12  grid grid-cols-12 gap-3">
                    <div className="flex flex-row items-center gap-2">
                      <Button
                        onClick={() => surveysAppend({ type: "객관식" })}
                        type="button"
                      >
                        + 설문항목(객관식) 추가
                      </Button>
                      <div>
                        <Button
                          onClick={() =>
                            surveysAppend({ type: "주관식", title: "" })
                          }
                          type="button"
                        >
                          + 설문항목(주관식) 추가
                        </Button>
                      </div>
                    </div>
                    {surveysFields.map((survey, surveyIndex) => {
                      return (
                        <div
                          className="flex flex-row items-center gap-2 border px-3 py-2 rounded-md bg-neutral-100 col-span-12"
                          key={surveyIndex}
                        >
                          <FormField
                            control={form.control}
                            name={`surveys.${surveyIndex}.title`}
                            render={({ field: { value, onChange } }) => (
                              <FormItem className="flex flex-row items-center col-span-12 gap-2 flex-1">
                                <p>{surveyIndex + 1}.</p>
                                {survey.type === "객관식" ? (
                                  <Input
                                    value={value || ""}
                                    onChange={onChange}
                                    placeholder="객관식 설문 내용을 입력하세요."
                                    disabled={
                                      editAvaliable.length > 0 ? true : false
                                    }
                                  />
                                ) : (
                                  <Input
                                    value={value || ""}
                                    onChange={onChange}
                                    placeholder="주관식 설문 내용을 입력하세요."
                                    disabled={
                                      editAvaliable.length > 0 ? true : false
                                    }
                                  />
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="button"
                            size="xs"
                            variant={"outline"}
                            onClick={() => surveysRemove(surveyIndex)}
                          >
                            <XIcon className="size-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>

                  <div className=" col-span-12 flex flex-col items-end">
                    <FormSubmitButton
                      title="설문 생성"
                      form={form}
                      loading={loading}
                      disabled={false}
                    />
                    {/* <Button
                      type="submit"
                      className="mt-6"

                      // disabled={editAvaliable.length > 0 ? true : false}
                    >
                      설문 생성
                    </Button> */}
                  </div>
                </CardContent>
              </Card>
            </form>
          </Form>
        </div>
      </ScrollArea>
    </div>
  );
}
