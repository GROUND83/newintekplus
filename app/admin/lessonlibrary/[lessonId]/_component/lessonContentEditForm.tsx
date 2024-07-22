"use client";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Textarea } from "@/components/ui/textarea";
import { Download, Loader2, XIcon } from "lucide-react";

import FormLabelWrap from "@/components/formLabel";
import { Button } from "@/components/ui/button";
import AlertDialogWrap from "@/app/admin/_component/alertDialogWrap";
import { deleteContent, editContenWithFile, editContent } from "./actions";
import { toast } from "sonner";

export const lessonContent = z.object({
  _id: z.string().optional(),
  type: z.string(),
  link: z.string().optional(),
  lessonContentdownloadURL: z.string(),
  lessonContenFileName: z.string(),
  lessonContendescription: z
    .string({
      required_error: "컨텐츠 자료설명을 입력하세요.",
    })
    .min(1, { message: "컨텐츠 자료설명을 입력하세요." }),
  file: z.instanceof(File).optional(),
});

export type lessonLibrarybaseSchemType = z.infer<typeof lessonContent>;

export default function LessonContentEditForm({
  content,
  lessonId,
  getContents,
  disabled,
}: {
  content: any;
  lessonId: string;
  getContents: any;
  disabled: boolean;
}) {
  const [show, setShow] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [updateLoading, setUpdateLoading] = React.useState(false);

  const form = useForm<z.infer<typeof lessonContent>>({
    resolver: zodResolver(lessonContent),
    defaultValues: {
      _id: "",
      type: "",
      link: "",
      lessonContentdownloadURL: "",
      lessonContenFileName: "",
      lessonContendescription: "",
      file: undefined,
    },
  });
  const reload = async () => {
    // setLoading(true);
    // let data = await initailData();
    console.log("lessonContent", content);
    form.reset({
      _id: content._id || "",
      type: content.type || "",
      link: content.link || "",
      lessonContentdownloadURL: content.lessonContentdownloadURL || "",
      lessonContenFileName: content.lessonContenFileName || "",
      lessonContendescription: content.lessonContendescription || "",
      file: undefined,
    });
    // setLoading(false);
  };
  React.useEffect(() => {
    reload();
  }, []);
  //
  async function onSubmit(values: z.infer<typeof lessonContent>) {
    console.log("values", values);
    if (values.file) {
      const formData = new FormData();
      // const formData = new FormData();
      formData.append("id", values._id);
      formData.append("file", values.file);
      formData.append(
        "lessonContendescription",
        values.lessonContendescription
      );
      formData.append("link", values.link);
      formData.append("type", values.type);
      formData.append(
        "lessonContentdownloadURL",
        values.lessonContentdownloadURL
      );
      setUpdateLoading(true);
      try {
        let res = await editContenWithFile(formData);
        console.log("res", res);
        if (res.data) {
          //
          getContents();
          toast.success("컨텐츠 수정에 성공하였습니다.");
        }
      } catch (e) {
        //
        toast.error(e);
      } finally {
        setUpdateLoading(false);
      }
    } else {
      const formData = new FormData();
      formData.append("id", values._id);
      formData.append(
        "lessonContendescription",
        values.lessonContendescription
      );
      formData.append("link", values.link);
      formData.append("type", values.type);
      formData.append(
        "lessonContentdownloadURL",
        values.lessonContentdownloadURL
      );
      setUpdateLoading(true);
      try {
        let res = await editContent(formData);
        console.log("res", res);
        if (res.data) {
          //
          getContents();
          toast.success("컨텐츠 수정에 성공하였습니다.");
        }
      } catch (e) {
        //
        toast.error(e);
      } finally {
        setUpdateLoading(false);
      }
    }
    //
  }

  //
  const clickDelete = async () => {
    //
    console.log("content._id", content._id, lessonId);
    setLoading(true);
    try {
      let res = await deleteContent({ lessonId, contentId: content._id });
      console.log("res", res);
      if (res.data === "ok") {
        toast.success("삭제가 완료되었습니다.");
        getContents();
      }
    } catch (e) {
      //
      toast.error(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div key={content._id} className="w-full col-span-4 border">
      <div className=" flex flex-row items-center justify-between px-3 py-3 bg-neutral-100 border-b">
        <p>{content.type}</p>
        <AlertDialogWrap
          btnTitle={"삭제"}
          title={`컨텐츠를 삭제합니다.`}
          description={"삭제된 컨텐츠는 복구 되지 않습니다."}
          okTitle={"삭제"}
          disabled={disabled}
          onClick={() => clickDelete()}
          loading={loading}
          deleteBtn={true}
        />
      </div>
      <div className=" flex flex-col gap-3">
        <Form {...form}>
          <form
            className="w-full gap-3 flex flex-col"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="p-3 flex flex-col gap-3">
              <FormField
                control={form.control}
                name={`lessonContendescription`}
                render={({ field: { value, onChange } }) => (
                  <FormItem className="flex flex-col">
                    <FormLabelWrap title="자료설명" required={true} />
                    <Textarea
                      className=" resize-none bg-neutral-100"
                      rows={5}
                      value={value || ""}
                      onChange={onChange}
                    />

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`link`}
                render={({ field: { value, onChange } }) => (
                  <FormItem className="flex flex-col">
                    <FormLabelWrap title="관련 링크" required={false} />
                    <Input
                      value={value || ""}
                      onChange={onChange}
                      className="bg-neutral-100"
                    />

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`file`}
                render={({ field: { ref, name, onBlur, onChange } }) => (
                  <FormItem className="">
                    <FormLabel className="flex flex-row items-center gap-2">
                      파일
                    </FormLabel>
                    {form.getValues("lessonContentdownloadURL") ? (
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
                                onChange={(e) => onChange(e.target.files?.[0])}
                              />
                            </FormControl>
                            <Button
                              type="button"
                              onClick={() => {
                                form.setValue(`file`, undefined);
                                setShow(false);
                              }}
                            >
                              취소
                            </Button>
                          </>
                        ) : (
                          <>
                            <a
                              href={form.getValues("lessonContentdownloadURL")}
                              target="_blank"
                              rel="noopener noreferrer"
                              className=" border px-3 py-2 text-primary border-primary  flex flex-row items-center"
                            >
                              {/* <Download className="size-3" /> */}
                              <p className=" line-clamp-1">
                                {form.getValues("lessonContenFileName")}
                              </p>
                            </a>
                            <Button
                              type="button"
                              onClick={() => setShow(true)}
                              disabled={disabled}
                            >
                              수정
                            </Button>
                          </>
                        )}
                      </div>
                    ) : (
                      <Input
                        type="file"
                        ref={ref}
                        name={name}
                        onBlur={onBlur}
                        onChange={(e) => onChange(e.target.files?.[0])}
                      />
                    )}
                  </FormItem>
                )}
              />
            </div>
            <div className="border-t p-3 w-full ">
              <Button type="submit" className="w-full" disabled={disabled}>
                {updateLoading ? (
                  <Loader2 className=" animate-spin" />
                ) : (
                  <p>컨텐츠 수정</p>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
