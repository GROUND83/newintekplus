"use client";
import FormLabelWrap from "@/components/formLabel";
import { Button } from "@/components/ui/button";
import { ExclamationCircleIcon as FillExclamtion } from "@heroicons/react/24/solid";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Download, XIcon } from "lucide-react";
import React from "react";

export default function LessonContentEdit({
  lessonContent,
  lessonContentIndex,
  lessonContentRemove,
  form,
}: {
  lessonContent: any;
  lessonContentIndex: any;
  lessonContentRemove: any;
  form: any;
}) {
  //
  const [show, setShow] = React.useState(false);
  return (
    <div
      className="flex flex-col gap-2 relative  col-span-4 border "
      key={lessonContentIndex}
    >
      <div className=" flex flex-row items-center justify-between px-3 py-3 bg-neutral-100 border-b">
        <p>{lessonContent.type}</p>
        <Button
          type="button"
          size="sm"
          variant={"outline"}
          onClick={() => lessonContentRemove(lessonContentIndex)}
        >
          <XIcon className="size-4" />
        </Button>
      </div>
      <div className="p-3 flex flex-col gap-3">
        <FormField
          control={form.control}
          name={`lessonContents.${lessonContentIndex}.lessonContendescription`}
          render={({ field: { value, onChange } }) => (
            <FormItem className="flex flex-col">
              <FormLabelWrap title="자료설명" required={true} />
              <Textarea
                className=" resize-none"
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
          name={`lessonContents.${lessonContentIndex}.link`}
          render={({ field: { value, onChange } }) => (
            <FormItem className="flex flex-col">
              <FormLabelWrap title="관련 링크" required={false} />
              <Input value={value || ""} onChange={onChange} />

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`lessonContents.${lessonContentIndex}.file`}
          render={({ field: { ref, name, onBlur, onChange } }) => (
            <FormItem className="">
              <FormLabel className="flex flex-row items-center gap-2">
                파일
              </FormLabel>
              {lessonContent.lessonContentdownloadURL ? (
                <div className="flex flex-row items-center gap-3">
                  {show ? (
                    <>
                      <FormControl>
                        <Input
                          type="file"
                          ref={ref}
                          name={name}
                          onBlur={onBlur}
                          onChange={(e) => onChange(e.target.files?.[0])}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        onClick={() => {
                          form.setValue(
                            `lessonContents.${lessonContentIndex}.file`,
                            undefined
                          );
                          setShow(false);
                        }}
                      >
                        취소
                      </Button>
                    </>
                  ) : (
                    <>
                      <a
                        href={lessonContent.lessonContenFileName}
                        target="_blank"
                        rel="noopener noreferrer"
                        className=" border px-3 py-2 text-primary border-primary flex-1 flex flex-row items-center gap-3"
                      >
                        <Download className="size-5" />
                        {lessonContent.lessonContenFileName}
                      </a>
                      <Button type="button" onClick={() => setShow(true)}>
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
    </div>
  );
}
