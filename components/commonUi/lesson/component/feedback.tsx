"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { XIcon } from "lucide-react";
import React from "react";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import FormLabelWrap from "@/components/formLabel";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
//
import { createFeedBack } from "../../../commonActions/commonActions";
import { UploadFileClient } from "@/lib/fileUploaderClient";
import { FormSubmitButton } from "../../formUi";
const FormSchema = z.object({
  title: z.string({
    required_error: "과정명을 입력하세요.",
  }),
  description: z.string(), //교육 목표
  file: z.instanceof(File).optional(),
});
//
export default function FeedbackSend({
  lessonResult,
  getLessonData,
}: {
  lessonResult: any;
  getLessonData: () => void;
}) {
  const [evaluationOepn, setEvaluationOepn] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });
  console.log("lessonResult", lessonResult);
  async function onSubmit(values: z.infer<typeof FormSchema>) {
    console.log("values", values);
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("groupId", lessonResult.groupId);
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("lessonResultId", lessonResult._id);
      formData.append("participants", lessonResult.onwer._id);
      // formData.append("auth", lessonResult.onwer._id);

      if (values.file) {
        //
        const upload = await UploadFileClient({
          folderName: "feedBack",
          file: values.file,
        });
        if (upload.location) {
          let feedBackFile = {
            contentdownloadURL: upload.location,
            contenFileName: values.file.name,
            contentSize: values.file.size,
            contentType: values.file.type,
          };

          formData.append("feedBackFile", JSON.stringify(feedBackFile));
        }
      }

      let res = await createFeedBack(formData);
      if (res.data) {
        //
        setEvaluationOepn(false);
        toast.success("피드백이 정상적으로 발송하였습니다.");
        getLessonData();

        // router.push("/admin/courseprofile");
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
    <div>
      {lessonResult.isEvaluationDone ? (
        <div className="flex flex-row items-center justify-between w-full gap-3">
          <Button
            onClick={() => setEvaluationOepn(true)}
            variant="outline"
            color="primary"
            size="xs"
          >
            피드백
          </Button>
        </div>
      ) : (
        <Button
          disabled
          onClick={() => setEvaluationOepn(true)}
          variant="outline"
          color="primary"
          size="xs"
        >
          평가대기
        </Button>
      )}

      <Dialog open={evaluationOepn}>
        <DialogContent className="w-[400px] flex flex-col">
          <div className="self-end">
            <Button
              onClick={() => setEvaluationOepn(false)}
              variant="outline"
              color="primary"
              size="xs"
            >
              <XIcon className="size-4" />
            </Button>
          </div>
          <DialogHeader>
            <DialogTitle>피드백 보내기</DialogTitle>
            <DialogDescription>
              해당 참여자에게 피드백을 보냅니다.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-row items-center gap-3 mt-3">
            <p>대상</p>
            <p>{lessonResult.onwer.username}</p>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 w-full"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field: { value, onChange } }) => (
                  <FormItem className="flex flex-col col-span-12 gap-2">
                    <FormLabelWrap title="피드백 명" required />
                    <Input
                      value={value || ""}
                      onChange={onChange}
                      placeholder="피드백 명을 입력하세요."
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex flex-col col-span-6 gap-2">
                    <FormLabelWrap title="피드백 내용" required={true} />

                    <Textarea
                      placeholder="피드백 내용을 입력하세요."
                      className="resize-none"
                      {...field}
                      rows={7}
                    />

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="file"
                render={({ field: { ref, name, onBlur, onChange } }) => (
                  <FormItem className="flex flex-col">
                    <FormLabelWrap title="첨부파일" required={false} />
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
              <div>
                <FormSubmitButton
                  title="전송"
                  form={form}
                  loading={loading}
                  disabled={false}
                />
                {/* <Button type="submit">전송</Button> */}
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
