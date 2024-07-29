"use client";
import ActionModal from "@/components/commonUi/ActionModal";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import React from "react";

export default function FeedBackView({ feedBack }: { feedBack: any }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="">
      <ActionModal
        open={open}
        setOpen={setOpen}
        title={"피드백 확인"}
        desc={"피드백을 확인합니다."}
        trigger={
          <Button size="xs" className="flex flex-row items-center gap-2">
            <Search className="size-3" />
            피드백 확인
          </Button>
        }
        onClick={() => {}}
        btnText=""
      >
        {feedBack && (
          <div className="flex flex-col w-full gap-2">
            <div className="flex flex-col items-start gap-3 border-b py-3 justify-between">
              <p>제목</p>
              <p>{feedBack.title}</p>
              <p>내용</p>
              <ScrollArea className="h-[400px] flex">
                <p className=" whitespace-pre-wrap">{feedBack.description}</p>
              </ScrollArea>
            </div>
            {feedBack.contentdownloadURL && (
              <div>
                <a
                  href={feedBack.contentdownloadURL}
                  download={feedBack.contentdownloadURL}
                  className=" underline hover:text-primary"
                >
                  {feedBack.contenFileName}
                </a>
              </div>
            )}
          </div>
        )}
      </ActionModal>
    </div>
  );
}
