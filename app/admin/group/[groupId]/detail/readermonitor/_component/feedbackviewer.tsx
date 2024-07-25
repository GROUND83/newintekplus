"use client";
import ActionModal from "@/components/commonUi/ActionModal";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import React from "react";

export default function FeedBackViewer({ data }) {
  const [open, setOpen] = React.useState(false);
  console.log("data", data);
  return (
    <div>
      <ActionModal
        title="피드백 확인"
        desc={"피드백을 확인합니다."}
        trigger={
          <Button variant="outline" size="xs">
            <MagnifyingGlassIcon className="size-4" />
          </Button>
        }
        btnText={""}
        onClick={() => {}}
        open={open}
        setOpen={setOpen}
      >
        <div className="w-full">
          <div className="w-full border-b flex flex-row items-center gap-3 py-3">
            <p>대상자</p>
            <p>{data.username}</p>
          </div>
          <div className="w-full border-b flex flex-row items-center gap-3 py-3">
            <p>제목</p>
            <p>{data.feedBack?.title}</p>
          </div>
          <div className="w-full border-b flex flex-col items-start gap-3 py-3">
            <p>내용</p>
            <ScrollArea className="min-h-[200px] max-h-[500px] w-full ">
              <div className="">
                <p className=" whitespace-pre-wrap">
                  {data.feedBack?.description}
                </p>
              </div>
            </ScrollArea>
          </div>
          <div className="w-full border-b flex flex-row items-center gap-3 py-3">
            <p>첨부파일</p>
            <a
              href={data.feedBack?.contentdownloadURL}
              download={data.feedBack?.contentdownloadURL}
              target="_black"
              className=" underline hover:text-primary cursor-pointer"
            >
              {data.feedBack?.contenFileName}
            </a>
          </div>
          <div className="w-full border-b flex flex-row items-center gap-3 py-3">
            <p>업데이트</p>
            <p>{dayjs(data.feedBack?.updatedAt).format("YYYY-MM-DD")}</p>
          </div>
        </div>
      </ActionModal>
    </div>
  );
}
