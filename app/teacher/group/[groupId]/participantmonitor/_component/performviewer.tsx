"use client";

import ActionModal from "@/components/commonUi/ActionModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import React from "react";

export default function PerformViewer({ data }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <ActionModal
        open={open}
        setOpen={setOpen}
        trigger={
          <Button variant="outline" size="xs">
            <MagnifyingGlassIcon className="size-4" />
          </Button>
        }
        title="과제수행 확인"
        desc={"과제수행 결과를 확인합니다."}
        btnText={""}
        onClick={() => {}}
      >
        <div>
          <div className="w-full border-b py-3">
            <p className="text-neutral-500">과제 제출</p>
            <a
              className=" underline  hover:text-primary cursor-pointer"
              href={data.newPerformInfo?.lessonPerformdownloadURL}
              download={data.newPerformInfo?.lessonPerformdownloadURL}
              target="_black"
            >
              {data.newPerformInfo?.lessonPerformFileName}
            </a>
          </div>
          <div className="w-full border-b py-3">
            {data.isEvaluationDone ? (
              <Badge>평가완료</Badge>
            ) : (
              <Badge variant="outline">평가대기</Badge>
            )}
          </div>
          <div className="w-full border-b py-3">
            <p className="text-neutral-500">과제 점수</p>
            <p>{data.point}</p>
          </div>
          <div className="w-full border-b py-3">
            <p className="text-neutral-500">과제 제출일</p>
            <p>{dayjs(data.newPerformInfo?.updatedAt).format("YYYY-MM-DD ")}</p>
          </div>
        </div>
      </ActionModal>
    </div>
  );
}
