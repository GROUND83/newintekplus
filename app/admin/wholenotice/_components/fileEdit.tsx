"use client";
import React, { forwardRef } from "react";
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
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";

export const FileEdit = ({ form, contentIndex, content, contentsRemove }) => {
  const [show, setShow] = React.useState(false);
  return (
    <div
      className="flex flex-row items-center gap-2 border px-3 py-2 rounded-md bg-neutral-100 col-span-12"
      key={contentIndex}
    >
      <FormField
        control={form.control}
        name={`contents.${contentIndex}.file`}
        render={({ field: { ref, name, onBlur, onChange } }) => (
          <FormItem className="flex flex-col flex-1">
            {content.contentdownloadURL ? (
              <div className="w-full flex flex-row items-center gap-2">
                {show ? (
                  <>
                    <FormControl>
                      <Input
                        type="file"
                        ref={ref}
                        name={name}
                        onBlur={onBlur}
                        className="bg-white flex-1"
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
                      href={content.contentdownloadURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className=" border px-3 py-2 text-primary border-primary  flex flex-row items-center flex-1 bg-white"
                    >
                      {/* <Download className="size-3" /> */}
                      <p className=" line-clamp-1">{content.contentName}</p>
                    </a>
                    <Button
                      type="button"
                      onClick={() => setShow(true)}
                      // disabled={disabled}
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

            <FormMessage />
          </FormItem>
        )}
      />
      <div>
        <Button
          type="button"
          variant={"outline"}
          onClick={() => contentsRemove(contentIndex)}
        >
          <XIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
};
