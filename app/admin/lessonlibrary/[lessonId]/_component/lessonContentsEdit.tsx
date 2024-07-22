"use client";

import React from "react";
import { addContentEdit, getContentsData } from "./actions";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import LessonContentEditForm from "./lessonContentEditForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { lessonContentType } from "@/lib/common";
import { FormControl } from "@/components/ui/form";
import AlertDialogWrap from "@/app/admin/_component/alertDialogWrap";

//
export default function LessonContentsEdit({
  lessonId,
  disabled,
}: {
  lessonId: string;
  disabled: boolean;
}) {
  const [contentType, setContentType] = React.useState("");
  const [contents, setContents] = React.useState<any>([]);
  const [loading, setLoading] = React.useState(false);

  const getContents = async () => {
    //
    let res = await getContentsData(lessonId);
    let data = JSON.parse(res.data);
    console.log("getContentsData", data);
    setContents(data.lessonContents);
  };
  React.useEffect(() => {
    getContents();
  }, [lessonId]);

  const addContent = async () => {
    //
    setLoading(true);
    console.log("contentType", contentType);
    try {
      let res = await addContentEdit({ lessonId, contentType });
      //
      console.log("res", res);
      if (res.data) {
        await getContents();
        toast.success("컨텐츠 추가를 성공하였습니다.");
      }
    } catch (e) {
      //
      toast.error(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="col-span-12 gap-2 flex flex-col bg-white border mt-1 w-full">
      <div className="p-3 border-b flex flex-row items-center justify-between w-full ">
        <div className=" ">
          <p>레슨 컨텐츠</p>
          <p className=" text-neutral-500 text-sm">
            각 개별 컨텐츠 수정 후 [컨텐츠 수정 버튼]을 클릭해야 수정됩니다.
          </p>
        </div>
        <div className="  gap-3 = flex flex-row items-center">
          <Select
            disabled={disabled}
            onValueChange={(value) => setContentType(value)}
            defaultValue={contentType}
          >
            <SelectTrigger className="col-span-3 bg-neutral-100">
              <SelectValue placeholder="컨텐츠 타입을 선택하세요." />
            </SelectTrigger>

            <SelectContent>
              {lessonContentType.map((item, index) => {
                return (
                  <SelectItem value={item} key={index}>
                    {item}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <AlertDialogWrap
            btnTitle={"+ 자료추가"}
            title={`${contentType}를 추가합니다.`}
            description={"자료 추가시 데이터베이스로 직접 추가됩니다. "}
            okTitle={"추가"}
            disabled={!contentType || disabled}
            onClick={() => addContent()}
            loading={loading}
            deleteBtn={false}
          />
        </div>
      </div>

      <div className="w-full  col-span-12 grid grid-cols-12 gap-3 p-3">
        {contents.length > 0 ? (
          contents.map((con: any, index: any) => {
            return (
              <LessonContentEditForm
                disabled={disabled}
                lessonId={lessonId}
                content={con}
                key={con._id}
                getContents={getContents}
              />
            );
          })
        ) : (
          <div className="w-full col-span-12 flex flex-col items-center justify-center  h-[300px] text-neutral-400">
            <p>컨텐츠가 없습니다.</p>
            <p>컨텐츠를 추가하세요.</p>
          </div>
        )}
      </div>
    </div>
  );
}
