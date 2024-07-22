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
// import { deleteContent, editContenWithFile, editContent } from "./actions";
import { toast } from "sonner";

export const noticefileSchema = z.object({
  _id: z.string(),
  contentdownloadURL: z.string().optional(),
  contentName: z.string().optional(),
  contentSize: z.string().optional(),
  file: z.instanceof(File).optional(),
});

export type lessonLibrarybaseSchemType = z.infer<typeof noticefileSchema>;

export default function NoticeFileEdit({
  content,
  groupId,
  disabled,
  contentIndex,
  form,
  contentsRemove,
}: {
  content: any;
  groupId: string;
  disabled: boolean;
  contentIndex: number;
  form: any;
  contentsRemove: (index: any) => void;
}) {
  const [show, setShow] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  //
  const clickDelete = async () => {
    //
  };
  return (
    <div key={content._id} className="w-full ">
      <div className="flex flex-col gap-3">
        <FormField
          control={form.control}
          name={`contents.${contentIndex}.file`}
          render={({ field: { ref, name, onBlur, onChange } }) => (
            <FormItem className="">
              {form.getValues(`contents.${contentIndex}.contentdownloadURL`) ? (
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
                        href={form.getValues(
                          `contents.${contentIndex}.contentdownloadURL`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className=" border px-3 py-2 text-primary border-primary  flex flex-row items-center w-full"
                      >
                        {/* <Download className="size-3" /> */}
                        <p className=" line-clamp-1">
                          {form.getValues(
                            `contents.${contentIndex}.contentName`
                          )}
                        </p>
                      </a>
                      <Button
                        type="button"
                        onClick={() => setShow(true)}
                        disabled={disabled}
                      >
                        수정
                      </Button>
                      <Button
                        type="button"
                        variant="destructiveoutline"
                        onClick={() => contentsRemove(contentIndex)}
                        disabled={disabled}
                      >
                        삭제
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex flex-row items-center gap-3">
                  <Input
                    type="file"
                    ref={ref}
                    name={name}
                    onBlur={onBlur}
                    onChange={(e) => onChange(e.target.files?.[0])}
                  />
                  <Button
                    type="button"
                    variant="destructiveoutline"
                    onClick={() => contentsRemove(contentIndex)}
                    disabled={disabled}
                  >
                    삭제
                  </Button>
                </div>
              )}
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
